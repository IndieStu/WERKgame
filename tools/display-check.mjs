import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const output='docs/visit-demo/display';await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try{for(const dpr of [1,2]){
 const ctx=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:dpr,hasTouch:true});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:4193/?demo=visit');await p.waitForFunction(()=>document.body.dataset.ready==='true');await p.getByRole('button',{name:'Neues Spiel',exact:true}).tap();await p.getByRole('button',{name:'Los geht’s',exact:true}).tap();await p.waitForTimeout(1200);
 const dimensions=await p.locator('canvas').evaluate(c=>({width:c.width,height:c.height,cssWidth:c.getBoundingClientRect().width,cssHeight:c.getBoundingClientRect().height,dpr:devicePixelRatio}));assert.equal(dimensions.width,1600*dpr);assert.equal(dimensions.cssWidth,1600);assert.equal(dimensions.height,900*dpr);
 await p.screenshot({path:`${output}/detail-dpr${dpr}.png`});
 // One tile southeast of the centered spawn: verify canvas-to-world input at both densities.
 await p.locator('canvas').tap({position:{x:872,y:486}});
 await p.waitForFunction(()=>new Promise(resolve=>{const r=indexedDB.open('werk-visit-demo-v2',1);r.onsuccess=()=>{const db=r.result,q=db.transaction('state').objectStore('state').get('current');q.onsuccess=()=>{resolve(q.result?.cell.x===11&&q.result?.cell.y===10);db.close();};};}));
 await p.locator('[data-object="jonas"]').tap();await p.waitForFunction(()=>document.querySelector('#talk').open);await p.screenshot({path:`${output}/dialog-dpr${dpr}.png`});await p.getByRole('button',{name:'Gespräch schließen',exact:true}).tap();
 await p.getByRole('button',{name:'Gesamtansicht',exact:true}).tap();await p.waitForTimeout(500);await p.screenshot({path:`${output}/overview-dpr${dpr}.png`});
 await p.getByRole('button',{name:'Zur Spielfigur',exact:true}).tap();await p.setViewportSize({width:1024,height:768});await p.waitForTimeout(700);assert.equal(await p.locator('canvas').evaluate(c=>c.width),1024*dpr);await p.locator('[data-object="jonas"]').tap();await p.waitForFunction(()=>document.querySelector('#talk').open);assert.deepEqual(errors,[]);results.push({dimensions,resizeTouch:true,dialogTouch:true,canvasTapToMove:true,errors});await ctx.close();
}await writeFile(output+'/results.json',JSON.stringify({date:new Date().toISOString(),browser:browser.version(),results},null,2));}finally{await browser.close();}
