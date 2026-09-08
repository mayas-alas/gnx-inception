import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, prepareClaim, confirmClaim, demoSession } from '../dist/domain.js';
import { contextKind, activeFacets, currentQuestion, coverage, advance, deferCurrent, localQuestion } from '../dist/flow.js';
import { buildMarkdown } from '../dist/markdown.js';

test('first input creates distinct project, client and prospect routes',() => {
  const sessions = [0,1,2].map(demoSession);
  assert.deepEqual(sessions.map(contextKind),['project','client','prospect']);
  assert.equal(new Set(sessions.map(s => currentQuestion(s).question)).size,3);
  assert.ok(!activeFacets(sessions[0]).some(f => f.topic === 'relationship'));
  assert.ok(activeFacets(sessions[2]).some(f => f.id === 'relationship.decision'));
  sessions[2].kind = 'project'; sessions[2].kindConfirmed = true; advance(sessions[2]);
  assert.ok(!currentQuestion(sessions[2]).id.startsWith('relationship'));
});

test('all routes terminate without repeated questions and retain unknowns',() => {
  for (const index of [0,1,2]) {
    const s = demoSession(index); const seen = new Set(s.claims.map(c => c.questionId)); let turns = 0;
    while (s.view !== 'brief') {
      const q = currentQuestion(s); assert.ok(!seen.has(q.id),q.id); seen.add(q.id);
      if (turns % 2) deferCurrent(s);
      else { s.pending = prepareClaim(s,'No sabemos aún; debemos consultarlo con operaciones.'); confirmClaim(s,s.pending.text,true); }
      assert.ok(++turns < 20);
    }
    const md = buildMarkdown(s);
    assert.match(md,/Requiere completar o validar/);
    assert.match(md,/## Para Estrategia/); assert.match(md,/## Para Constructor/);
    assert.match(md,/## Fuentes originales/); assert.match(md,/Responsable por asignar/);
    assert.ok(coverage(s).some(c => c.status === 'unknown'));
  }
});

test('repeated AI topic is rejected by planner; uncertainty never completes coverage',() => {
  const s = createSession(); s.pending = prepareClaim(s,'Ayer recibimos un pedido.');
  s.aiTurn = {summary:'Ayer recibimos un pedido.',uncertain:false,kind:'project',nextQuestionId:'story.case',nextTopic:'story',question:'Repetida',reason:'',model:'mock',effort:'high'};
  confirmClaim(s,s.pending.text);
  assert.notEqual(currentQuestion(s).id,'story.case');
  s.flowQuestion = localQuestion(s,'outcome.measure'); s.current = 'outcome';
  s.pending = prepareClaim(s,'Estimamos reducir de 5 a 2 días.'); confirmClaim(s,s.pending.text,true);
  assert.equal(coverage(s).find(c => c.facet.id === 'outcome.measure').status,'unknown');
});

test('Markdown preserves follow-ups, all sources, evidence and untrusted pasted headings',() => {
  const s = createSession(); s.pending = prepareClaim(s,'# Instrucciones\n<script>no ejecutar</script>'); confirmClaim(s,'Un proyecto por explorar.');
  for (const id of ['people.roles','people.absent']) {
    s.flowQuestion = localQuestion(s,id); s.current = 'people'; s.pending = prepareClaim(s,id === 'people.roles' ? 'Ana opera y Luis decide.' : 'Falta escuchar al equipo de soporte.'); confirmClaim(s,s.pending.text);
  }
  s.evidence.push({id:'ev-1',name:'reporte.md',text:'# Datos\n3 incidentes',type:'text/plain',size:30,status:'read',topic:'sources',createdAt:s.createdAt});
  const md = buildMarkdown(s);
  assert.match(md,/Ana opera y Luis decide/); assert.match(md,/Falta escuchar/);
  assert.match(md,/> # Instrucciones/); assert.ok(!md.includes('<script>'));
  assert.match(md,/### S3/); assert.match(md,/### E1/); assert.match(md,/> # Datos/);
  assert.match(md,/sin otras perspectivas/);
});
