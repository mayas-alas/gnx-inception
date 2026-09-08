import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[]; page.on('pageerror',e => errors.push(e.message));
try {
  await page.goto('http://localhost:4173');
  await expect(page.locator('footer')).toContainText('Motor local');
  for (const [input,kind,pattern] of [
    ['Ayer se retrasó nuestro proyecto de automatización.','project',/Quién vive/],
    ['Nuestro cliente actual renueva contrato en dos meses.','client',/relación con este cliente/],
    ['El prospecto Nébula quiere mejorar pedidos.','prospect',/etapa está este prospecto/]
  ]) {
    await page.locator('#new').click();
    await page.locator('#answer').fill(input);
    await page.locator('#submit').click(); await page.locator('#confirm').click();
    await expect(page.locator('#context-kind')).toHaveValue(kind);
    await expect(page.locator('.card h2')).toHaveText(pattern);
  }
  // Complete traversal by explicitly deferring unknowns; must never claim verification.
  let count=0;
  while (await page.locator('#skip').count()) {
    await page.locator('#skip').click();
    assert.ok(++count < 20);
  }
  await expect(page.locator('.brief')).toBeVisible();
  await page.locator('#title').fill('Nébula · oportunidad');
  await page.locator('#handoff').click();
  await page.locator('.md-preview summary').click();
  const markdown = await page.locator('#markdown').inputValue();
  assert.match(markdown,/## Para Estrategia/); assert.match(markdown,/## Para Constructor/);
  assert.match(markdown,/## Fuentes originales/); assert.match(markdown,/Requiere completar o validar/);
  assert.match(markdown,/Nébula quiere mejorar pedidos/);
  assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('gnx-inception-v3')).sessions.at(-1).markdown.includes('## Para Constructor')));
  const downloadPromise=page.waitForEvent('download'); await page.locator('#download-md').click();
  const download=await downloadPromise;
  assert.match(download.suggestedFilename(),/\.md$/);
  assert.equal(await readFile(await download.path(),'utf8'),markdown);
  await page.reload(); await page.locator('.md-preview summary').click();
  assert.equal(await page.locator('#markdown').inputValue(),markdown);
  await mkdir('test-results',{recursive:true});
  await page.screenshot({path:'test-results/context-360-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
  await page.screenshot({path:'test-results/context-360-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: 3 context routes, full traversal, honest gaps, MD download/content, autosave, reload, responsive brief.');
} finally { await browser.close(); }
