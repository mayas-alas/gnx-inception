import { advance, contextKind, currentQuestion, coverage, candidateFacets, type ContextKind, type FlowQuestion } from './flow.js';
export const topics = [
  { id: 'story', label: 'El punto de partida', short: 'Contexto', question: '¿Qué te gustaría cambiar?', reason: 'Un caso real nos ayuda a entender dónde empieza el problema.', hint: 'Cuéntame la última vez que ocurrió. Si todavía es una idea, empieza por lo que imaginas.', starters: ['Tengo un proceso que mejorar', 'Estoy explorando una idea', 'Quiero ahorrar tiempo'] },
  { id: 'people', label: 'Las personas', short: 'Personas', question: '¿Quién vive este problema de cerca?', reason: 'Quien usa la solución y quien la aprueba pueden necesitar cosas distintas.', hint: 'Piensa en quien hace el trabajo, quien recibe el resultado y quien decide.', starters: ['Nuestro equipo de operaciones', 'Los clientes', 'Todavía necesito consultarlo'] },
  { id: 'process', label: 'El trabajo de hoy', short: 'Proceso', question: '¿Cómo lo resuelven hoy, paso a paso?', reason: 'Los pasos y las esperas revelan el mejor lugar para empezar.', hint: 'Desde que llega la solicitud hasta que alguien da el trabajo por terminado.', starters: ['Primero recibimos una solicitud', 'Lo hacemos manualmente', 'Cada persona lo hace diferente'] },
  { id: 'outcome', label: 'El cambio que importa', short: 'Resultado', question: '¿Qué tendría que mejorar en los próximos 30 días?', reason: 'Una señal observable nos permitirá saber si la primera prueba sirvió.', hint: 'Puedes estimar: tiempo actual, tiempo deseado y cómo lo medirías.', starters: ['Reducir el tiempo de respuesta', 'Disminuir los errores', 'Tomar mejores decisiones'] },
  { id: 'sources', label: 'Lo que ya existe', short: 'Información', question: '¿Dónde está la información que necesitamos?', reason: 'Saber qué fuente es confiable evita construir sobre supuestos.', hint: 'Documentos, sistemas, mensajes o alguien que conoce el proceso. Indica quién los mantiene.', starters: ['En hojas de cálculo', 'En nuestro sistema interno', 'En la experiencia del equipo'] },
  { id: 'boundaries', label: 'El criterio humano', short: 'Límites', question: '¿Qué decisión debe seguir en manos de una persona?', reason: 'Definir aprobaciones permite explorar la ayuda del agente con límites claros.', hint: 'Piensa en dinero, datos privados, mensajes a clientes o decisiones difíciles de revertir.', starters: ['Enviar al cliente requiere aprobación', 'Nunca modificar los datos originales', 'Necesitamos definirlo con el equipo'] },
  { id: 'exceptions', label: 'Cuando algo se complica', short: 'Excepciones', question: '¿Qué caso difícil podría cambiar este plan?', reason: 'Las excepciones nos dicen cuándo pedir ayuda y detener una automatización.', hint: 'Recuerda un error, información incompleta o una situación que no encaja en el proceso habitual.', starters: ['Cuando faltan datos', 'Cuando hay una urgencia', 'Cuando dos fuentes se contradicen'] },
  { id: 'experiment', label: 'La primera prueba', short: 'Prueba', question: '¿Cuál sería una primera prueba pequeña y útil?', reason: 'Una prueba con responsable y criterio de éxito convierte el mapa en una acción.', hint: 'Elige un caso, una persona responsable y una señal para decidir si continuar.', starters: ['Probar con cinco casos reales', 'Revisarlo con quien opera el proceso', 'Primero validar la información'] },
  { id:'relationship',label:'La relación',short:'Relación comercial',question:'¿En qué etapa está la relación?',reason:'El contexto comercial orienta el siguiente paso.',hint:'Contacto, compromisos, compra y objeciones.',starters:[] },
  { id:'economics',label:'El valor en juego',short:'Valor y recursos',question:'¿Qué valor y recursos están en juego?',reason:'El valor debe contrastarse con recursos disponibles.',hint:'Puedes indicar rangos o lo que falta confirmar.',starters:[] },
  { id:'systems',label:'Las conexiones',short:'Sistemas',question:'¿Qué sistemas deben participar?',reason:'El constructor necesita conocer entradas y salidas.',hint:'Herramientas, accesos e integraciones.',starters:[] },
  { id:'adoption',label:'El trabajo de mañana',short:'Adopción',question:'¿Quién usará y mantendrá la solución?',reason:'La adopción necesita un dueño.',hint:'Roles, hábitos y soporte.',starters:[] }
] as const;
export type TopicId = typeof topics[number]['id'];
export type Claim = { id: string; topic: TopicId; text: string; original: string; reviewed: boolean; uncertain: boolean; sourceId: string; createdAt: string; questionId?:string; questionText?:string };
export type Evidence = { id: string; name: string; type: string; size: number; text?: string; createdAt: string; status: 'read' | 'attached'; topic: TopicId };
export type AiTurn = { summary: string; uncertain: boolean; nextTopic: TopicId; nextQuestionId?:string; kind?:ContextKind; question: string; reason: string; model: string; effort: string };
export type Session = { id: string; title: string; createdAt: string; updatedAt: string; claims: Claim[]; skipped: TopicId[]; evidence: Evidence[]; draft: string; current: TopicId; view: 'interview' | 'brief'; pending?: Claim; route?: string; demo?: boolean; aiTurn?: AiTurn; kind?:ContextKind; kindConfirmed?:boolean; flowQuestion?:FlowQuestion; deferred?:string[]; markdown?:string };
export const uid = () => crypto.randomUUID();
export function createSession(): Session { const now = new Date().toISOString(); return { id: uid(), title: 'Nuevo contexto', createdAt: now, updatedAt: now, claims: [], skipped: [], evidence: [], draft: '', current: 'story', view: 'interview',deferred:[] }; }
export function nextTopic(s: Session): TopicId | undefined {
  return candidateFacets(s)[0]?.facet.topic;
}
export function prepareClaim(s: Session, text: string): Claim { const q = currentQuestion(s); return { id: uid(), topic: s.current, text: text.trim(), original: text.trim(), reviewed: false, uncertain: /no (lo )?sé|no sabemos|supongo|quizá|creo|aproximad|estim|por definir|desconozco|no lo sabemos/.test(text.toLowerCase()), sourceId: uid(), createdAt: new Date().toISOString(),questionId:q.id,questionText:q.question }; }
export function confirmClaim(s: Session, text: string, uncertain = false) {
  if (!s.pending) return;
  s.pending.text = text.trim(); s.pending.reviewed = true; s.pending.uncertain = uncertain || s.pending.uncertain;
  // Keep earlier versions: a correction must not erase its original source.
  s.claims.push(s.pending); s.skipped = s.skipped.filter(id => id !== s.pending!.topic); s.pending = undefined; s.draft = '';
  if (!s.kindConfirmed) s.kind = s.aiTurn?.kind ?? contextKind({...s,kind:undefined});
  advance(s);
}
export function latest(s: Session, id: TopicId) { return s.claims.filter(c => c.topic === id).at(-1); }
export function gaps(s: Session) { return coverage(s).filter(c => c.status !== 'reported').map(c => ({id:c.facet.id,question:c.facet.question,status:c.status})); }
export function tensions(s: Session): string[] {
  const all = s.claims.map(c => c.text).join(' ').toLowerCase(); const result: string[] = [];
  if (/automátic|sin intervención|sin aprobación/.test(all) && /requiere aprobación|debe aprobar|revisión humana/.test(all)) result.push('Revisar alcance: se menciona automatización y también aprobación humana. Aclara qué acciones corresponden a cada una.');
  if (s.claims.some(c => c.uncertain)) result.push('Hay estimaciones o respuestas pendientes de validación. No deben tratarse como hechos comprobados.');
  return result;
}
export function packageSession(s: Session) {
  const pending = gaps(s); return { schemaVersion: 2, project: { id: s.id, title: s.title, kind:contextKind(s),status: pending.length ? 'needs_validation' : 'reported_context', updatedAt: s.updatedAt },coverage:coverage(s),
    brief: topics.map(t => ({ topic: t.id, label: t.short, statement: latest(s, t.id)?.text ?? null, claimId: latest(s, t.id)?.id ?? null })),
    claims: s.claims.map(c => ({ ...c, validation: 'reported', kind: c.uncertain ? 'estimate' : 'statement', interpretationReviewed: c.reviewed })),
    sources: s.claims.map(c => ({ id: c.sourceId, text: c.original, createdAt: c.createdAt })), evidence: s.evidence,
    contradictions: tensions(s), openQuestions: pending.map(t => t.question),
    agentDraft: { purpose: latest(s, 'outcome')?.text ?? latest(s, 'story')?.text ?? 'Por definir', capabilities: ['Organizar el contexto aportado', 'Preparar preguntas para validar pendientes'], boundaries: latest(s, 'boundaries')?.text ?? 'Por definir antes de ejecutar acciones', status: 'proposal_only' },
    handoff: { doNotAssume: ['Una revisión del operador no equivale a corroboración independiente.', 'Los adjuntos no demuestran por sí mismos una afirmación.', 'Este borrador no autoriza acciones externas.'], usableNow: s.claims.filter(c => !c.uncertain).map(c => c.id), validationPlan: pending.map(t => ({ question: t.question, owner: 'Por asignar' })), nextBestAction: pending[0]?.question ?? 'Acordar responsable y validar la prueba con el equipo.', destination: s.route ?? 'validation' } };
}
export function demoSession(index: number) {
  const s = createSession(); s.demo = true;
  const demos = [
    ['Proyecto · propuestas', 'Ayer usamos precios antiguos en Excel para tres propuestas. Queremos reducir de dos horas a treinta minutos el trabajo en 30 días.'],
    ['Cliente · renovación', 'Nuestro cliente actual, Lumbre, renueva su contrato en dos meses. En la última reunión señaló retrasos en soporte y necesitamos recuperar su confianza.'],
    ['Prospecto · descubrimiento', 'El prospecto Nébula nos contactó la semana pasada porque concilia pedidos manualmente. Aún no conocemos su presupuesto ni quién decide la compra.']
  ]; s.title = demos[index][0]; s.pending = prepareClaim(s, demos[index][1]); confirmClaim(s, s.pending.text); return s;
}
