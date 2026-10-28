import {chromium} from 'playwright';
import {mkdir,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const output='docs/visit-demo',base='http://127.0.0.1:4191/',url=base+'?demo=visit';
const launch={executablePath:process.env.CHROME_PATH||undefined,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
await mkdir(output+'/screenshots',{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4191','--strictPort'],{stdio:'pipe'});
const listen=new Promise((resolve,reject)=>{server.stdout.on('data',b=>{if(b.toString().includes('4191'))resolve();});server.on('error',reject);server.on('exit',code=>reject(Error('Preview '+code)));setTimeout(()=>reject(Error('Preview timeout')),10000).unref();});
let browser,page;
const ready=p=>p.waitForFunction(()=>document.body.dataset.ready==='true');
const tap=(p,name)=>p.getByRole('button',{name,exact:true}).tap();
async function save(p){return p.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('werk-visit-demo',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('state','readonly'),q=tx.objectStore('state').get('current');q.onsuccess=()=>{resolve(q.result);db.close();};};r.onerror=()=>reject(r.error);}));}
async function step(p,id,complete=false){for(let i=0;i<60;i++){const s=await save(p);if(s?.quest.stepId===id&&s.quest.completed===complete)return s;await p.waitForTimeout(100);}throw Error('Missing step '+id);}
async function visit(p,id){console.log('Visit',id);await p.locator(`[data-object="${id}"]`).tap();await p.waitForFunction(()=>document.querySelector('#talk').open||document.querySelector('#planner').open||document.querySelector('[data-object="measure_start"]'));}
async function close(p){await tap(p,'Gespräch schließen');}
try{
 await listen;browser=await chromium.launch(launch);const context=await browser.newContext({viewport:{width:1600,height:900},hasTouch:true});page=await context.newPage();page.setDefaultTimeout(18000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await ready(page);await tap(page,'Neues Spiel');await tap(page,'Los geht’s');
 await page.screenshot({path:output+'/screenshots/workshop.png'});
 await visit(page,'coffee');await close(page);await visit(page,'laser');await close(page);
 await visit(page,'jonas');await page.screenshot({path:output+'/screenshots/jonas.png'});
 const bubble=await page.locator('#talk').boundingBox();assert.ok(bubble.x>=0&&bubble.y>=0&&bubble.x+bubble.width<=1601&&bubble.y+bubble.height<=901);
 await tap(page,'Was brauchst du?');await tap(page,'Ich schau nach.');await step(page,'observe');
 await visit(page,'site');await step(page,'measure');await page.locator('[data-object="measure_start"]').tap();await page.locator('[data-object="measure_end"]').tap();
 await page.locator('#width').fill('40');await tap(page,'Maß mitnehmen');await tap(page,'Noch mal eingeben');await page.locator('#width').fill('90');await tap(page,'Maß mitnehmen');await step(page,'report_measure');
 await visit(page,'jonas');await tap(page,'Ich sehe mir die Proben an.');await step(page,'material');
 for(const id of ['multiplex','mdf','osb']){await visit(page,id);await close(page);}
 await visit(page,'jonas');await tap(page,'Die Schichtkante von Multiplex gefällt mir.');await tap(page,'Alles klar.');
 for(const id of ['cut','cnc']){await visit(page,id);await close(page);}
 await visit(page,'jonas');await tap(page,'CNC – einmal programmieren, dann wiederholen.');await tap(page,'Alles klar.');await step(page,'planning');
 await visit(page,'bench');
 for(const id of ['level-30','part-board1','level-70','part-tall','gap-1','part-small','gap-0'])await page.locator('#'+id).tap();
 assert.equal(await page.locator('#confirm-plan').isEnabled(),true);await page.screenshot({path:output+'/screenshots/planning.png'});
 await tap(page,'Den Plan mitnehmen');await visit(page,'jonas');await tap(page,'Bauen wir’s.');await step(page,'complete',true);await page.waitForTimeout(1000);await page.screenshot({path:output+'/screenshots/completed.png'});
 assert.equal(await page.locator('[data-object="crates"]').count(),0);
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await ready(page);await tap(page,'Fortsetzen');assert.equal((await save(page)).quest.completed,true);
 await context.setOffline(false);page.on('dialog',d=>d.accept());await tap(page,'Demo neu starten');await tap(page,'Los geht’s');await step(page,'briefing');
 assert.equal(await page.locator('[data-object="crates"]').count(),1);assert.deepEqual(errors,[]);
 // Existing Phase-2B entry still loads; demo storage cannot replace its save.
 const baseline=await context.newPage();await baseline.goto(base);await ready(baseline);assert.equal(await baseline.locator('body').getAttribute('data-demo'),null);
 await context.close();
 const narrow=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});page=await narrow.newPage();await page.goto(url);await ready(page);await tap(page,'Neues Spiel');await tap(page,'Los geht’s');await visit(page,'jonas');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:output+'/screenshots/touch-1024.png'});await narrow.close();
 const profile=await mkdtemp(join(tmpdir(),'werk-visit-'));let persistent;
 try{persistent=await chromium.launchPersistentContext(profile,{...launch,viewport:{width:1600,height:900},hasTouch:true});let p=await persistent.newPage();await p.goto(url);await ready(p);await tap(p,'Neues Spiel');await tap(p,'Los geht’s');await visit(p,'jonas');await tap(p,'Was brauchst du?');await tap(p,'Ich schau nach.');await step(p,'observe');await p.waitForFunction(()=>!!navigator.serviceWorker.controller);await persistent.close();persistent=undefined;
 persistent=await chromium.launchPersistentContext(profile,{...launch,viewport:{width:1600,height:900},hasTouch:true});await persistent.setOffline(true);p=await persistent.newPage();await p.goto(url);await ready(p);await tap(p,'Fortsetzen');await step(p,'observe');}
 finally{await persistent?.close();await rm(profile,{recursive:true,force:true});}
 const result={date:new Date().toISOString(),browser:browser.version(),viewport:'1600×900 / 1024×768',input:'Chromium touchscreen events on Mac; physical external screen not tested',checks:{fullQuest:true,allThreeSamples:true,physicalApproach:true,measurementRetry:true,anchoredDialogue:true,planning:true,worldChange:true,offlineReload:true,browserRestartOffline:true,dedicatedRestartFlow:true,baselineEntry:true,separateSave:true},errors};await writeFile(output+'/browser-results.json',JSON.stringify(result,null,2)+'\n');console.log(result);
}catch(e){if(page&&!page.isClosed()){console.error(await page.locator('body').innerText().catch(()=>''));await page.screenshot({path:output+'/failure.png'}).catch(()=>{});}throw e;}
finally{await browser?.close();server.kill();}
