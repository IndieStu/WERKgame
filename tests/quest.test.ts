import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quest, fresh, decode } from '../game/source/domain.ts';
import { initialProgress, nextHint, transition, type Action } from '../game/source/quest.ts';
import { emptyLayout, layoutReady, placeBoard, placeBox } from '../game/source/planning.ts';
const observations = ['site','measure_start','measure_end','multiplex','mdf','osb','cut','cnc'];
const sequence = (material:string,process:string):Action[] => [
 {type:'continue',stepId:'briefing'},
 ...observations.map(objectId=>({type:'observe',objectId} as const)),
 {type:'continue',stepId:'observe'}, {type:'answer',stepId:'measure',value:'90,0'},
 {type:'continue',stepId:'report_measure'}, {type:'answer',stepId:'material',value:material},
 {type:'answer',stepId:'process',value:process}, {type:'board',stepId:'planning',index:0,level:30},
 {type:'board',stepId:'planning',index:1,level:70}, {type:'box',stepId:'planning',box:'small',slot:0},
 {type:'box',stepId:'planning',box:'tall',slot:1}, {type:'plan_complete',stepId:'planning'},
 {type:'finish',stepId:'complete'},
];
test('all six material/procedure routes complete through exploration and a fitting layout; every checkpoint saves',()=>{
 for(const m of ['multiplex','mdf','osb'])for(const procedure of ['panel_cut','cnc']){
  let p=initialProgress(quest);
  for(const action of sequence(m,procedure)){
   const result=transition(quest,p,action);assert.equal(result.changed,true,JSON.stringify(action));p=result.progress;
   assert.deepEqual(decode({...fresh(),quest:p}).quest,p);
  }
  assert.equal(p.completed,true);assert.equal(p.answers.material,m);
  assert.equal(transition(quest,p,{type:'finish',stepId:'complete'}).changed,false);
 }
});
test('unobserved site, endpoints, material and procedure cannot be skipped',()=>{
 let p=transition(quest,initialProgress(quest),{type:'continue',stepId:'briefing'}).progress;
 assert.equal(transition(quest,p,{type:'continue',stepId:'observe'}).changed,false);
 p=transition(quest,p,{type:'observe',objectId:'site'}).progress;
 p=transition(quest,p,{type:'continue',stepId:'observe'}).progress;
 assert.equal(transition(quest,p,{type:'answer',stepId:'measure',value:'90'}).changed,false);
 for(const objectId of ['measure_start','measure_end'])p=transition(quest,p,{type:'observe',objectId}).progress;
 for(const value of ['', 'NaN','-1','0','400','40']){
  const r=transition(quest,p,{type:'answer',stepId:'measure',value});assert.equal(r.progress.stepId,'measure');assert.ok(r.feedback);p=r.progress;
 }
 for(let i=0;i<8;i++)p=nextHint(quest,p);
 assert.equal(p.hints.measure,quest.steps.find(s=>s.id==='measure')!.hints!.length);
 p=transition(quest,p,{type:'answer',stepId:'measure',value:'89.5'}).progress;
 assert.equal(transition(quest,p,{type:'answer',stepId:'measure',value:'90'}).changed,false);
 p=transition(quest,p,{type:'continue',stepId:'report_measure'}).progress;
 assert.equal(transition(quest,p,{type:'answer',stepId:'material',value:'mdf'}).changed,false);
 for(const objectId of ['mdf','osb'])p=transition(quest,p,{type:'observe',objectId}).progress;
 assert.equal(transition(quest,p,{type:'answer',stepId:'material',value:'multiplex'}).changed,false);
 p=transition(quest,p,{type:'answer',stepId:'material',value:'mdf'}).progress;
 assert.equal(transition(quest,p,{type:'answer',stepId:'process',value:'cnc'}).changed,false);
 assert.equal(transition(quest,p,{type:'observe',objectId:'unknown'}).changed,false);
 assert.equal(transition(quest,p,{type:'observe',objectId:'mdf'}).changed,false);
});
test('planning has multiple solutions, rejects undersized/shared compartments and resets boxes when a board moves',()=>{
 for(const [levels,slots] of [[[30,70],[0,1]],[[40,70],[1,0]],[[10,40],[1,2]]] as const){
  let l=placeBoard(placeBoard(emptyLayout(),0,levels[0]),1,levels[1]);
  l=placeBox(l,'small',slots[0]).layout;l=placeBox(l,'tall',slots[1]).layout;assert.ok(layoutReady(l));
  assert.equal(layoutReady(placeBoard(l,0,20)),false);
 }
 let l=placeBoard(placeBoard(emptyLayout(),0,30),1,70);
 assert.equal(placeBox(l,'tall',0).layout,l);assert.equal(placeBox(l,'small',2).layout,l);
 l=placeBox(l,'small',1).layout;assert.equal(placeBox(l,'tall',1).layout,l);
 assert.equal(placeBoard(l,9,30),l);assert.equal(placeBoard(l,0,33),l);
});
test('old test saves are explicitly restarted with settings preserved and no stale measurement',()=>{
 for(const version of [1,2]){
  const old={version,cell:{x:1,y:4},mode:'direct',width:40,avatar:'orange',help:'more',quest:{revision:1,completed:true}};
  const migrated=decode(old);assert.equal(migrated.version,3);assert.equal(migrated.width,null);
  assert.equal(migrated.mode,'direct');assert.equal(migrated.quest.stepId,'briefing');assert.equal(migrated.legacy!.version,version);
 }
 const p=initialProgress(quest);
 for(const bad of [{...p,revision:99},{...p,hints:{measure:99}},{...p,answers:{material:'impossible'}},{...p,layout:undefined},{...p,discovered:['unknown']}])assert.throws(()=>decode({...fresh(),quest:bad}));
});
