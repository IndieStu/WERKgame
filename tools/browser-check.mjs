import { chromium, devices } from 'playwright';
import { writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const output='docs/phase-1';
await mkdir(`${output}/screenshots`,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174','--strictPort'],{stdio:'pipe'});
let browser;
try {
 for(let n=0;n<50;n++){try{if((await fetch('http://127.0.0.1:4174/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[];
 for(const mobile of [false,true]){
  const context=await browser.newContext(mobile?{...devices['iPad (gen 7)']}:{viewport:{width:1280,height:900}});
  const page=await context.newPage();page.setDefaultTimeout(15000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/');
  const waitReady=()=>page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Testraum bereit'));
  await waitReady();await page.waitForFunction(()=>document.querySelector('#offline-status').textContent.includes('vollständig'));
  await page.waitForTimeout(1600);
  const firstLoad=await page.evaluate(()=>({readyMs:performance.getEntriesByName('werk-ready')[0].startTime,resources:performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,transfer:r.transferSize,encoded:r.encodedBodySize,duration:r.duration}))}));
  const initialMetrics=await page.locator('#metrics').textContent();
  await page.screenshot({path:`${output}/screenshots/${mobile?'touch-emulation':'desktop'}.png`,fullPage:true});
  await page.getByRole('button',{name:'Testdialog öffnen'}).click();
  await page.locator('#width').fill('NaN');await page.getByRole('button',{name:'Wert lokal speichern'}).click();assert.equal(await page.locator('#width').getAttribute('aria-invalid'),'true');
  const before=await page.locator('#position').textContent();await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);assert.equal(await page.locator('#position').textContent(),before);
  await page.locator('#width').fill('40,5');await page.getByRole('button',{name:'Wert lokal speichern'}).click();
  await page.waitForFunction(()=>document.querySelector('#save-status').textContent.includes('gespeichert'));
  await page.screenshot({path:`${output}/screenshots/${mobile?'touch-dialog':'desktop-dialog'}.png`,fullPage:true});
  await page.keyboard.press('Escape');assert.equal(await page.locator('#dialog').evaluate(d=>d.open),false);
  await page.locator('#mode').selectOption('direct');
  const button=await page.locator('[data-dir="right"]').boundingBox();
  if(mobile){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:button.x+25,y:button.y+25}]});await page.waitForTimeout(800);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
  else{await page.mouse.move(button.x+25,button.y+25);await page.mouse.down();await page.waitForTimeout(800);await page.mouse.up();}
  await page.waitForTimeout(400);assert.notEqual(await page.locator('#position').textContent(),before);
  await page.screenshot({path:`${output}/screenshots/${mobile?'touch-direct':'desktop-direct'}.png`,fullPage:true});
  await page.reload();await waitReady();assert.equal(await page.locator('#mode').inputValue(),'direct');
  await page.getByRole('button',{name:'Testdialog öffnen'}).click();assert.equal(await page.locator('#width').inputValue(),'40.5');await page.getByRole('button',{name:'Schließen',exact:true}).click();
  await page.locator('#mode').selectOption('tap');
  async function go(x,y){const b=await page.locator('canvas').boundingBox();const px=b.x+(400+(x-y)*32)/800*b.width,py=b.y+(90+(x+y)*16)/500*b.height;if(mobile)await page.touchscreen.tap(px,py);else await page.mouse.click(px,py);await page.waitForFunction(expected=>document.querySelector('#position').textContent===expected,`${x}, ${y}`);}
  await go(0,6);
  if(!mobile){await go(4,3);await page.screenshot({path:`${output}/screenshots/depth-behind.png`,fullPage:true});await go(4,5);await page.screenshot({path:`${output}/screenshots/depth-front.png`,fullPage:true});}
  await page.getByRole('button',{name:'Hoher Regalblock'}).click();await page.waitForFunction(()=>document.querySelector('#dialog').open);await page.getByRole('button',{name:'Schließen',exact:true}).click();
  await context.setOffline(true);await page.reload();await waitReady();
  // Close and open a new tab while offline, preserving this browser profile/cache.
  await page.close();const reopened=await context.newPage();await reopened.goto('http://127.0.0.1:4174/');await reopened.waitForFunction(()=>document.querySelector('#message').textContent.includes('Testraum bereit'));
  results.push({environment:mobile?'Chromium touch emulation; NOT Safari or real iPad':'MacBook host, Chrome headless, SwiftShader; NOT hardware GPU benchmark',browserVersion:browser.version(),userAgent:await reopened.evaluate(()=>navigator.userAgent),firstLoad,initialMetrics,checks:{invalidMeasurement:true,modalPausesMovement:true,directMovement:true,tapMovement:true,saveReload:true,objectApproach:true,offlineReload:true,offlineNewTab:true},errors});
  assert.deepEqual(errors,[]);await context.close();
 }
 const profile=await mkdtemp(join(tmpdir(),'werk-phase1-'));
 let persistent;
 let restartResult;
 try {
  const launch={executablePath:process.env.CHROME_PATH||undefined,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
  persistent=await chromium.launchPersistentContext(profile,launch);
  let p=await persistent.newPage();await p.goto('http://127.0.0.1:4174/');
  await p.waitForFunction(()=>document.querySelector('#offline-status').textContent.includes('vollständig') && !!navigator.serviceWorker.controller);
  await p.getByRole('button',{name:'Testdialog öffnen'}).click();await p.locator('#width').fill('55,5');await p.getByRole('button',{name:'Wert lokal speichern'}).click();await p.waitForFunction(()=>document.querySelector('#save-status').textContent.includes('gespeichert'));
  await persistent.close();persistent=undefined;
  persistent=await chromium.launchPersistentContext(profile,launch);await persistent.setOffline(true);
  p=await persistent.newPage();await p.goto('http://127.0.0.1:4174/');await p.waitForFunction(()=>document.querySelector('#message').textContent.includes('Testraum bereit'));
  await p.getByRole('button',{name:'Testdialog öffnen'}).click();assert.equal(await p.locator('#width').inputValue(),'55.5');
  restartResult={browserRestartOffline:true,measurementAfterRestart:55.5,environment:'Persistent Chrome headless profile on Mac host; not Safari/iPad'};
 } finally {await persistent?.close();await rm(profile,{recursive:true,force:true});}
 await writeFile(`${output}/browser-results.json`,JSON.stringify({date:new Date().toISOString(),results,restartResult},null,2)+'\n');console.log(JSON.stringify(results,null,2));
} finally {await browser?.close();server.kill();}
