import { chromium, devices } from 'playwright';
import { writeFile, readFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const output='docs/phase-2b', url='http://127.0.0.1:4184/';
const objectLabels=JSON.parse(await readFile('content/rooms/prototype-room.json','utf8')).objects;
const launch={executablePath:process.env.CHROME_PATH||undefined,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
await mkdir(`${output}/screenshots`,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4184','--strictPort'],{stdio:'pipe'});
let browser, activePage;const results=[],touchPages=new WeakSet();
const listen=new Promise((resolve,reject)=>{server.stdout.on('data',data=>{if(data.toString().includes('4184'))resolve();});server.on('error',reject);server.on('exit',code=>reject(Error('Preview exited '+code)));setTimeout(()=>reject(Error('Preview did not start')),10000).unref();});
const activate=(p,locator)=>touchPages.has(p)?locator.tap():locator.click();
const click=(p,name)=>activate(p,p.getByRole('button',{name,exact:true}));
async function ready(p){await p.waitForFunction(()=>document.body.dataset.ready==='true');}
async function dbValue(p,key='current'){
 return p.evaluate(key=>new Promise((resolve,reject)=>{const r=indexedDB.open('werk-phase1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('state','readonly'),read=tx.objectStore('state').get(key);read.onsuccess=()=>{resolve(read.result);db.close();};read.onerror=()=>reject(read.error);};}),key);
}
async function replaceSave(p,value){await p.evaluate(value=>new Promise((resolve,reject)=>{const r=indexedDB.open('werk-phase1',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('state','readwrite');tx.objectStore('state').put(value,'current');tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>reject(tx.error);};}),value);}
async function checkpoint(p,id,completed=false){
 for(let i=0;i<70;i++){const s=await dbValue(p);if(s?.quest.stepId===id&&s.quest.completed===completed)return s;await p.waitForTimeout(100);}
 throw Error('Checkpoint not reached '+id);
}
async function newGame(p){await click(p,'Neues Spiel');await click(p,'Los geht’s');}
async function visit(p,id){
 console.log('  visit',id);
 // World hotspots trigger the same A* approach used by a human pointer. Narrow view can use the accessible places menu.
 let target=p.locator(`[data-object="${id}"]`);
 if(await target.isVisible()){await activate(p,target);}
 else{await click(p,'Menü');await click(p,'Orte und Dinge');await activate(p,p.locator('#panel').getByRole('button',{name:objectLabels.find(o=>o.id===id).label,exact:true}));}
 if(id==='site'){await p.waitForFunction(()=>document.querySelector('#talk').open||document.querySelector('[data-object="measure_start"]'));}
 else await p.waitForFunction(()=>document.querySelector('#talk').open||document.querySelector('#planner').open);
}
async function closeTalk(p){await click(p,'Gespräch schließen');}
async function measured(p){
 await visit(p,'jonas');await click(p,'Was brauchst du?');await click(p,'Ich schau nach.');await checkpoint(p,'observe');
 await visit(p,'site');await checkpoint(p,'measure');
 await p.locator('[data-object="measure_end"]').click();assert.equal(await p.locator('#talk').evaluate(d=>d.open),false);
 await p.locator('[data-object="measure_start"]').click();await p.locator('[data-object="measure_end"]').click();
 await p.locator('#width').fill('900');await click(p,'Maß mitnehmen');await click(p,'Noch mal eingeben');
 await p.locator('#width').fill('90,0');await click(p,'Maß mitnehmen');await checkpoint(p,'report_measure');
 await visit(p,'jonas');await click(p,'Ich sehe mir die Proben an.');await checkpoint(p,'material');
}
async function exploreToPlan(p,touch){
 await visit(p,'jonas');assert.match(await p.locator('#talk-body').innerText(),/Vergleiche erst/);await closeTalk(p);
 for(const id of ['multiplex','mdf','osb']){await visit(p,id);await closeTalk(p);}
 await visit(p,'jonas');await click(p,touch?'OSB – die Struktur passt zum Fest.':'MDF – ich möchte eine glatte Fläche.');await click(p,'Alles klar.');await checkpoint(p,'process');
 for(const id of ['cut','cnc']){await visit(p,id);await closeTalk(p);}
 await visit(p,'jonas');await click(p,touch?'CNC – einmal programmieren, dann wiederholen.':'Zuschnitt mit gleicher Einstellung.');await click(p,'Alles klar.');await checkpoint(p,'planning');
 await visit(p,'bench');
}
async function plan(p){
 await p.locator('#level-30').click();await p.locator('#part-board1').click();await p.locator('#level-70').click();
 await p.locator('#part-tall').click();await p.locator('#gap-0').click();assert.match(await p.locator('#plan-feedback').innerText(),/stößt oben an/);
 await p.locator('#gap-1').click();await p.locator('#part-small').click();await p.locator('#gap-0').click();
 assert.equal(await p.locator('#confirm-plan').isEnabled(),true);
}
async function offlineReady(p){await p.waitForFunction(async()=>{if(!navigator.serviceWorker.controller)return false;const keys=await caches.keys();return keys.some(k=>k.startsWith('werk-'));});}
try{
 await listen;browser=await chromium.launch(launch);
 for(const touch of [false,true]){
  console.log('Checking',touch?'touch emulation':'desktop');
  const context=await browser.newContext(touch?{...devices['iPad (gen 7)']}:{viewport:{width:1280,height:900}});
  const p=await context.newPage();if(touch)touchPages.add(p);activePage=p;p.setDefaultTimeout(15000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url);await ready(p);await offlineReady(p);
  const readyMs=await p.evaluate(()=>performance.getEntriesByName('werk-ready')[0].startTime);
  await newGame(p);assert.equal(await p.locator('select:visible').count(),0);
  const viewport=await p.evaluate(()=>({w:innerWidth,h:innerHeight,canvasW:document.querySelector('canvas').clientWidth,canvasH:document.querySelector('canvas').clientHeight}));assert.equal(viewport.w,viewport.canvasW);assert.equal(viewport.h,viewport.canvasH);
  await p.screenshot({path:`${output}/screenshots/${touch?'touch':'desktop'}-world.png`});
  const z=Math.max(.65,Math.min(1.8,Math.min(viewport.w/780,viewport.h/570))),tx=viewport.w/2-224*z,ty=viewport.h/2-8*z;
  if(touch)await p.touchscreen.tap(tx,ty);else await p.mouse.click(tx,ty);
  for(let n=0;n<50;n++){const cell=(await dbValue(p)).cell;if(cell.x===0&&cell.y===7)break;await p.waitForTimeout(100);}
  assert.deepEqual((await dbValue(p)).cell,{x:0,y:7});
  await visit(p,'coffee');assert.match(await p.locator('#talk-body').innerText(),/warm|Kaffee|Tasse/i);await closeTalk(p);
  // Direct control is still an experiment available in normal accessibility settings.
  await click(p,'Menü');await click(p,'Einstellungen & Zugänglichkeit');await p.locator('#mode').selectOption('direct');await click(p,'Zurück');
  const before=(await dbValue(p)).cell;const pad=p.locator('[data-dir="up"]'),b=await pad.boundingBox();
  if(touch){const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+24,y:b.y+24}]});await p.waitForTimeout(500);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
  else{await pad.hover();await p.mouse.down();await p.waitForTimeout(500);await p.mouse.up();}
  await p.waitForTimeout(400);assert.notDeepEqual((await dbValue(p)).cell,before);
  await click(p,'Menü');await click(p,'Einstellungen & Zugänglichkeit');await p.locator('#mode').selectOption('tap');await click(p,'Zurück');
  await measured(p);await exploreToPlan(p,touch);
  await plan(p);await p.screenshot({path:`${output}/screenshots/${touch?'touch':'desktop'}-planning.png`});
  // Interrupt a fitting plan before accepting it; save must reconstruct the exact layout.
  const layout=(await checkpoint(p,'planning')).quest.layout;
  await p.reload();await ready(p);await click(p,'Fortsetzen');await visit(p,'bench');assert.deepEqual((await dbValue(p)).quest.layout,layout);
  await click(p,'Den Plan mitnehmen');await checkpoint(p,'complete');
  await visit(p,'jonas');await p.screenshot({path:`${output}/screenshots/${touch?'touch':'desktop'}-dialog.png`});await click(p,'Bauen wir’s.');
  await checkpoint(p,'complete',true);await p.waitForTimeout(1000);assert.equal(await p.locator('[data-object="crates"]').count(),0);
  await p.screenshot({path:`${output}/screenshots/${touch?'touch':'desktop'}-changed-world.png`});
  await visit(p,'jonas');await click(p,'Was machen die da eigentlich?');assert.match(await p.locator('#talk-body').innerText(),/Tischlerei|Produktgestaltung/);await closeTalk(p);
  await p.keyboard.press('F2');const metrics=JSON.parse(await p.locator('#debug-state').innerText());await click(p,'Zurück');
  await context.setOffline(true);await p.reload();await ready(p);await click(p,'Fortsetzen');assert.equal((await dbValue(p)).quest.completed,true);
  const reopened=await context.newPage();await reopened.goto(url);await ready(reopened);assert.equal((await dbValue(reopened)).quest.completed,true);
  assert.deepEqual(errors,[]);results.push({environment:touch?'Chromium iPad touch emulation; NOT real iPad/Safari':'Chrome headless on Mac with SwiftShader',browser:browser.version(),readyMs,viewport,metrics:{fps:metrics.metrics,save:metrics.saveText,offline:metrics.offlineText},checks:{gameFirst:true,physicalObjectApproach:true,voluntaryCup:true,directControl:true,tapObjectControl:true,tapFloorMovement:true,measurementRetry:true,explorationGate:true,alternativeChoice:true,planningInteraction:true,planningReload:true,worldChange:true,optionalCareerConversation:true,offlineReload:true,offlineNewTab:true},errors});await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await context.newPage();touchPages.add(p);activePage=p;
 await p.goto(url);await ready(p);await newGame(p);await visit(p,'jonas');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const box=await p.locator('#talk').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=391&&box.y+box.height<=845);
 await p.screenshot({path:`${output}/screenshots/phone-dialog.png`});await closeTalk(p);
 await measured(p);await exploreToPlan(p,false);await plan(p);
 assert.equal(await p.locator('#planner').evaluate(d=>d.scrollWidth>d.clientWidth),false);
 await p.screenshot({path:`${output}/screenshots/phone-planning.png`});
 await click(p,'Den Plan mitnehmen');await visit(p,'jonas');await click(p,'Bauen wir’s.');await checkpoint(p,'complete',true);await context.close();
 const migration=await browser.newContext();const m=await migration.newPage();activePage=m;await m.goto(url);await ready(m);
 const old={version:2,cell:{x:1,y:4},mode:'direct',width:40,avatar:'orange',help:'more',quest:{revision:1,completed:true}};
 await replaceSave(m,old);await m.reload();await ready(m);await click(m,'Fortsetzen');const migrated=await checkpoint(m,'briefing');assert.equal(migrated.width,null);assert.equal(migrated.mode,'direct');assert.deepEqual(await dbValue(m,'backup-before-2b'),old);
 await replaceSave(m,{version:99,reserved:'do-not-overwrite'});await m.reload();await ready(m);assert.match(await m.locator('#notice').innerText(),/Unbekannte Saveversion/);assert.equal((await dbValue(m)).version,99);await migration.close();
 const denied=await browser.newContext();await denied.addInitScript(()=>{Object.defineProperty(window,'indexedDB',{get(){throw Error('Storage denied for test');}});});const d=await denied.newPage();activePage=d;await d.goto(url);await ready(d);assert.equal(await d.locator('#notice').isVisible(),true);d.on('dialog',dialog=>dialog.accept());await newGame(d);assert.equal(await d.locator('#notice').isVisible(),true);await denied.close();
 const profile=await mkdtemp(join(tmpdir(),'werk-2b-'));let persistent;
 try{
  persistent=await chromium.launchPersistentContext(profile,launch);let p=await persistent.newPage();activePage=p;await p.goto(url);await ready(p);await offlineReady(p);await newGame(p);await measured(p);await checkpoint(p,'material');await persistent.close();persistent=undefined;
  persistent=await chromium.launchPersistentContext(profile,launch);await persistent.setOffline(true);p=await persistent.newPage();activePage=p;await p.goto(url);await ready(p);await click(p,'Fortsetzen');assert.equal((await dbValue(p)).quest.stepId,'material');assert.equal((await dbValue(p)).width,90);
 }finally{await persistent?.close();await rm(profile,{recursive:true,force:true});}
 const summary={date:new Date().toISOString(),results,phoneDialogFits:true,phoneFullFlow:true,oldSaveBackedUpAndRestarted:true,futureSavePreserved:true,deniedStorageVisible:true,browserRestartOfflineAtMaterial:true,humanUsabilityTest:'pending',realIpadSafari:'pending'};
 await writeFile(`${output}/browser-results.json`,JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
}catch(error){if(activePage&&!activePage.isClosed()){console.error(await activePage.locator('body').innerText().catch(()=>''));await activePage.screenshot({path:`${output}/failure.png`}).catch(()=>{});}throw error;}
finally{await browser?.close();server.kill();}
