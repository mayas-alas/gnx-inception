import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, prepareClaim, confirmClaim, nextTopic, demoSession, packageSession } from '../dist/domain.js';
test('risk and process stories lead to different questions', () => {
  const s = createSession(); s.pending = prepareClaim(s, 'El proceso maneja dinero y datos privados.'); confirmClaim(s,s.pending.text);
  assert.equal(nextTopic(s),'boundaries');
  assert.equal(demoSession(1).current,'relationship');
  assert.equal(demoSession(2).current,'relationship');
});
test('review keeps original source and never implies independent evidence', () => {
  const s = createSession(); s.pending = prepareClaim(s,'Creo que tarda cinco días.'); confirmClaim(s,'Estimamos tres días.',true);
  const p = packageSession(s);
  assert.equal(p.sources[0].text,'Creo que tarda cinco días.');
  assert.equal(p.claims[0].text,'Estimamos tres días.');
  assert.equal(p.claims[0].validation,'reported');
  assert.equal(p.claims[0].sourceId,p.sources[0].id);
  assert.ok(p.openQuestions.length > 0);
});
