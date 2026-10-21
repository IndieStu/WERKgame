import { chromium, devices } from 'playwright';
import { writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const output = 'docs/phase-2';
const url = 'http://127.0.0.1:4174/';
const launch = {
  executablePath: process.env.CHROME_PATH || undefined, headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
};
await mkdir(`${output}/screenshots`, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: 'pipe' });
let browser;
let activePage;
async function ready(page) {
  await page.waitForFunction(() => document.querySelector('#message')?.textContent.includes('Raum bereit'));
}
async function readSave(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('werk-phase1', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction('state', 'readonly'), r = tx.objectStore('state').get('current');
      r.onsuccess = () => { resolve(r.result); db.close(); };
      r.onerror = () => reject(r.error);
    };
  }));
}
async function savedStep(page, stepId, completed = false) {
  for (let i = 0; i < 50; i++) {
    const s = await readSave(page);
    if (s?.quest.stepId === stepId && s.quest.completed === completed) return s;
    await page.waitForTimeout(100);
  }
  throw Error('Save checkpoint not reached: ' + stepId);
}
async function click(page, name) { await page.getByRole('button', { name, exact: true }).click(); }
async function resume(page) { await page.locator('#resume').click(); }
async function reloadCheckpoint(page, id) {
  await savedStep(page, id);
  await page.reload(); await ready(page); await resume(page);
}
try {
  for (let n = 0; n < 50; n++) {
    try { if ((await fetch(url)).ok) break; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch(launch);
  const results = [];
  for (const touch of [false, true]) {
    const context = await browser.newContext(touch ? { ...devices['iPad (gen 7)'] } : { viewport: { width: 1280, height: 1000 } });
    const page = await context.newPage(); activePage = page; page.setDefaultTimeout(20000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(url); await ready(page);
    await page.waitForFunction(() => document.querySelector('#offline-status').textContent.includes('vollständig'));
    await page.waitForTimeout(1300);
    const firstLoad = await page.evaluate(() => ({ readyMs: performance.getEntriesByName('werk-ready')[0].startTime }));
    const metrics = await page.locator('#metrics').textContent();
    await page.screenshot({ path: `${output}/screenshots/${touch ? 'touch' : 'desktop'}-room.png`, fullPage: true });

    // Both movement variants remain usable; touch context sends real Chromium touch events.
    await page.locator('#mode').selectOption('direct');
    const b = await page.locator('[data-dir="right"]').boundingBox();
    if (touch) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + 25, y: b.y + 25 }] });
      await page.waitForTimeout(600);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach();
    } else {
      await page.mouse.move(b.x + 25, b.y + 25); await page.mouse.down(); await page.waitForTimeout(600); await page.mouse.up();
    }
    await page.waitForTimeout(400); assert.notEqual(await page.locator('#position').textContent(), '1, 6');
    await page.locator('#mode').selectOption('tap');
    const canvas = await page.locator('canvas').boundingBox();
    const x = canvas.x + 208 / 800 * canvas.width, y = canvas.y + 166 / 440 * canvas.height;
    if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
    await page.waitForFunction(() => document.querySelector('#position').textContent === '0, 6');
    await page.getByRole('button', { name: 'Jonas', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#dialog').open);
    await click(page, 'Ich helfe mit');
    await reloadCheckpoint(page, 'observe');
    await click(page, 'Messkarte ansehen');
    await page.screenshot({ path: `${output}/screenshots/${touch ? 'touch' : 'desktop'}-observation.png`, fullPage: true });
    await click(page, 'Breite gemerkt – zum Eingabeschritt');
    await reloadCheckpoint(page, 'measure');
    const previousPosition = await page.locator('#position').textContent();
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
    assert.equal(await page.locator('#position').textContent(), previousPosition);
    await page.locator('#width').fill('400'); await click(page, 'Maß prüfen');
    await click(page, 'Weiter');
    await click(page, 'Ersten Hinweis zeigen'); await click(page, 'Nächsten Hinweis zeigen');
    assert.equal((await savedStep(page, 'measure')).quest.hints.measure, 2);
    await page.locator('#width').fill('40,0'); await click(page, 'Maß prüfen');
    await click(page, 'Weiter'); await reloadCheckpoint(page, 'material');
    await page.screenshot({ path: `${output}/screenshots/${touch ? 'touch' : 'desktop'}-material.png`, fullPage: true });
    await click(page, touch ? 'OSB – markante Struktur als Teil der Gestaltung' : 'MDF – glatte Fläche, Kanten zusätzlich beschichten');
    await click(page, 'Weiter'); await reloadCheckpoint(page, 'process');
    await click(page, '3D-Druck – die Holzplatte in den Drucker legen'); await click(page, 'Weiter');
    assert.equal((await savedStep(page, 'process')).quest.stepId, 'process');
    await click(page, touch ? 'CNC – ein Programm vorbereiten und danach wiederholen' : 'Plattenzuschnitt – Maße und wiederholbare Einstellung planen');
    await click(page, 'Weiter'); await reloadCheckpoint(page, 'complete');
    await click(page, 'Regal virtuell fertigstellen');
    await savedStep(page, 'complete', true);
    await page.screenshot({ path: `${output}/screenshots/${touch ? 'touch' : 'desktop'}-result.png`, fullPage: true });
    await click(page, 'Zurück in den Raum');
    await page.screenshot({ path: `${output}/screenshots/${touch ? 'touch' : 'desktop'}-changed-world.png`, fullPage: true });
    await context.setOffline(true); await page.reload(); await ready(page);
    assert.ok((await page.locator('#outcome').textContent()).includes('fertiges Regal'));
    await resume(page); assert.ok((await page.locator('#dialog-body').textContent()).includes('keine Berufseignungsdiagnose'));
    assert.equal((await readSave(page)).quest.completed, true);
    await page.close(); const reopened = await context.newPage(); await reopened.goto(url); await ready(reopened);
    assert.ok((await reopened.locator('#outcome').textContent()).includes('fertiges Regal'));
    await context.setOffline(false);
    reopened.on('dialog', d => d.accept()); await reopened.getByRole('button', { name: 'Neue Runde', exact: true }).click();
    await savedStep(reopened, 'briefing');
    assert.equal((await readSave(reopened)).quest.completed, false);
    results.push({ environment: touch ? 'Chromium touch emulation, NOT Safari or real iPad' : 'Chrome headless on Mac, SwiftShader', browserVersion: browser.version(), firstLoad, metrics, checks: { tapMovement: true, directMovement: true, approachJonas: true, reloadEachCheckpoint: true, retryWithoutPenalty: true, hintsPersist: true, alternateChoices: true, visibleWorldState: true, offlineReload: true, offlineNewTab: true, reset: true }, errors });
    assert.deepEqual(errors, []); await context.close();
  }
  const narrowContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const narrow = await narrowContext.newPage(); await narrow.goto(url); await ready(narrow); await resume(narrow);
  await click(narrow, 'Ich helfe mit'); await click(narrow, 'Messkarte ansehen'); await click(narrow, 'Breite gemerkt – zum Eingabeschritt');
  const overflow = await narrow.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  assert.equal(overflow, false);
  await narrow.screenshot({ path: `${output}/screenshots/phone-emulation-measurement.png`, fullPage: true });
  await narrowContext.close();
  const migrationContext = await browser.newContext();
  const migrationPage = await migrationContext.newPage(); await migrationPage.goto(url); await ready(migrationPage);
  async function replaceSave(page, value) {
    await page.evaluate(value => new Promise((resolve, reject) => {
      const r = indexedDB.open('werk-phase1', 1);
      r.onsuccess = () => { const db = r.result, tx = db.transaction('state', 'readwrite'); tx.objectStore('state').put(value, 'current'); tx.oncomplete = () => { db.close(); resolve(true); }; tx.onerror = () => reject(tx.error); };
      r.onerror = () => reject(r.error);
    }), value);
  }
  await replaceSave(migrationPage, { version: 1, cell: { x: 1, y: 4 }, mode: 'direct', width: 45 });
  await migrationPage.reload(); await ready(migrationPage);
  assert.equal(await migrationPage.locator('#mode').inputValue(), 'direct');
  assert.equal(await migrationPage.locator('#position').textContent(), '1, 6');
  await resume(migrationPage); await click(migrationPage, 'Ich helfe mit');
  assert.equal((await savedStep(migrationPage, 'observe')).version, 2);
  await migrationPage.locator('#close-dialog').click();
  await replaceSave(migrationPage, { version: 99, reserved: 'do-not-overwrite' });
  await migrationPage.reload(); await ready(migrationPage);
  assert.ok((await migrationPage.locator('#save-status').textContent()).includes('Unbekannte Saveversion'));
  await resume(migrationPage); await click(migrationPage, 'Ich helfe mit');
  await migrationPage.waitForTimeout(200);
  assert.equal((await readSave(migrationPage)).version, 99);
  await migrationContext.close();
  const profile = await mkdtemp(join(tmpdir(), 'werk-phase2-'));
  let persistent, restart;
  try {
    persistent = await chromium.launchPersistentContext(profile, launch);
    let p = await persistent.newPage(); await p.goto(url); await ready(p);
    await p.waitForFunction(() => document.querySelector('#offline-status').textContent.includes('vollständig') && !!navigator.serviceWorker.controller);
    await resume(p); await click(p, 'Ich helfe mit'); await click(p, 'Messkarte ansehen'); await click(p, 'Breite gemerkt – zum Eingabeschritt');
    await p.locator('#width').fill('40'); await click(p, 'Maß prüfen'); await savedStep(p, 'material');
    await persistent.close(); persistent = undefined;
    persistent = await chromium.launchPersistentContext(profile, launch); await persistent.setOffline(true);
    p = await persistent.newPage(); await p.goto(url); await ready(p); await resume(p);
    assert.ok((await p.locator('#dialog-title').textContent()).includes('Material'));
    restart = { browserRestartOffline: true, resumedStep: 'material', savedMeasurement: (await readSave(p)).quest.answers.measure };
  } finally { await persistent?.close(); await rm(profile, { recursive: true, force: true }); }
  await writeFile(`${output}/browser-results.json`, JSON.stringify({ date: new Date().toISOString(), results, restart, narrowViewportNoOverflow: true, phase1Migration: true, unknownSavePreserved: true }, null, 2) + '\n');
  console.log(JSON.stringify({ results, restart, narrowViewportNoOverflow: true, phase1Migration: true, unknownSavePreserved: true }, null, 2));
} catch (error) {
  if (activePage && !activePage.isClosed()) {
    console.error('Failure state:', await activePage.evaluate(() => ({ url: location.href, title: document.title, body: document.body.innerText, outcome: !!document.querySelector('#outcome') })).catch(() => null));
    await activePage.screenshot({ path: `${output}/failure.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally { await browser?.close(); server.kill(); }
