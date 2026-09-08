import { test } from 'node:test';
import assert from 'node:assert/strict';
// Dummy credential only; all HTTP calls are intercepted by a test transport.
process.env.OPENAI_API_KEY = 'test-placeholder';
const { interview, validateInput } = await import('../ai.mjs');
const body = {topic:'story',answer:'El prospecto busca mejorar pedidos.',claims:[],kind:'prospect',questionId:'story.case',candidates:[{id:'people.roles',topic:'people',question:'¿Quién decide?'}]};
const turn = {summary:'Un prospecto busca mejorar pedidos.',uncertain:false,kind:'prospect',nextQuestionId:'people.roles',nextTopic:'people',question:'¿Quién decide la compra en este prospecto?',reason:'Necesitamos conocer al decisor.'};
test('OpenAI contract includes context, coverage candidates, high effort and no storage',async () => {
  const result = await interview(body,async (url,options) => {
    assert.equal(url,'https://api.openai.com/v1/responses');
    const request = JSON.parse(options.body);
    assert.equal(request.store,false); assert.equal(request.reasoning.effort,'high');
    assert.equal(JSON.parse(request.input).candidates[0].id,'people.roles');
    assert.ok(request.text.format.schema.required.includes('kind'));
    return new Response(JSON.stringify({status:'completed',model:'gpt-5.6-luna',output:[{content:[{type:'output_text',text:JSON.stringify(turn)}]}]}));
  });
  assert.equal(result.kind,'prospect');
});
test('invalid model choice and malformed API body are rejected',async () => {
  assert.equal(validateInput({...body,candidates:[{id:'invented',topic:'people',question:'?'}]}),false);
  await assert.rejects(interview(body,async () => new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({...turn,nextQuestionId:'story.case',nextTopic:'story'})}]}]}))),/fuera de la ruta/);
});
