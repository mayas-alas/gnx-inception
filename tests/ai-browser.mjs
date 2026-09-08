import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage();
await page.route('**/health',route => route.fulfill({json:{mode:'openai',model:'gpt-5.6-luna',effort:'high'}}));
let fail = true;
await page.route('**/api/interview',route => route.fulfill(fail ? {status:502,json:{error:'La clave OpenAI fue rechazada.'}} : {json:{summary:'El equipo necesita precios vigentes para sus propuestas.',uncertain:false,nextTopic:'sources',question:'¿Quién mantiene la lista de precios?',reason:'Necesitamos identificar la fuente confiable.',model:'gpt-5.6-luna',effort:'high'}}));
try {
  await page.goto('http://localhost:4173');
  await expect(page.locator('footer')).toContainText('gpt-5.6-luna');
  await page.locator('#answer').fill('Los precios antiguos nos hacen rehacer propuestas.');
  await page.locator('#submit').click();
  await expect(page.locator('#toast')).toContainText('rechazada');
  await expect(page.locator('#answer')).toHaveValue('Los precios antiguos nos hacen rehacer propuestas.');
  fail = false;
  await page.locator('#submit').click();
  await expect(page.locator('#review')).toHaveValue('El equipo necesita precios vigentes para sus propuestas.');
  await page.locator('#confirm').click();
  await expect(page.locator('.card h2')).toHaveText('¿Quién mantiene la lista de precios?');
  await page.reload();
  await expect(page.locator('.card h2')).toHaveText('¿Quién mantiene la lista de precios?');
  console.log('PASS: AI synthesis, dynamic question, persisted turn, error preservation and retry. No API calls charged.');
} finally { await browser.close(); }
