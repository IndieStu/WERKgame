import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quest, fresh, decode } from '../game/source/domain.ts';
import { currentStep, initialProgress, nextHint, transition } from '../game/source/quest.ts';
const start = () => {
  let p = initialProgress(quest);
  for (const stepId of ['briefing', 'observe']) p = transition(quest, p, { type: 'continue', stepId }).progress;
  return p;
};
test('complete quest with each material and both valid manufacturing choices', () => {
  for (const material of ['multiplex','mdf','osb']) for (const process of ['panel_cut','cnc']) {
    let p = start();
    p = transition(quest,p,{type:'answer',stepId:'measure',value:'40,0'}).progress;
    p = transition(quest,p,{type:'answer',stepId:'material',value:material}).progress;
    p = transition(quest,p,{type:'answer',stepId:'process',value:process}).progress;
    assert.equal(currentStep(quest,p).type,'result'); assert.equal(p.completed,false);
    p = transition(quest,p,{type:'finish',stepId:'complete'}).progress;
    assert.equal(p.completed,true); assert.equal(p.answers.material,material);
    assert.equal(transition(quest,p,{type:'finish',stepId:'complete'}).changed,false);
    assert.deepEqual(decode({...fresh(),quest:p}).quest,p);
  }
});
test('retry, hints and a later valid answer do not create a dead end', () => {
  let p=start();
  for(const value of ['','NaN','-1','0','400','30']) {
    const result=transition(quest,p,{type:'answer',stepId:'measure',value});
    assert.equal(result.progress.stepId,'measure'); assert.ok(result.feedback);p=result.progress;
  }
  for(let i=0;i<8;i++)p=nextHint(quest,p);
  assert.equal(p.hints.measure,3);
  p=transition(quest,p,{type:'answer',stepId:'measure',value:'39.5'}).progress;
  assert.equal(p.stepId,'material');
  p=transition(quest,p,{type:'answer',stepId:'material',value:'mdf'}).progress;
  p=transition(quest,p,{type:'answer',stepId:'process',value:'printer'}).progress;
  assert.equal(p.stepId,'process');
  assert.equal(transition(quest,p,{type:'answer',stepId:'process',value:'unknown'}).changed,false);
});
test('stale action events cannot skip newly rendered steps', () => {
  const p=transition(quest,start(),{type:'answer',stepId:'measure',value:'40'}).progress;
  const result=transition(quest,p,{type:'answer',stepId:'measure',value:'40'});
  assert.equal(result.changed,false); assert.equal(result.progress.stepId,'material');
});
test('save roundtrip at every checkpoint and explicit Phase-1 migration', () => {
  let p=initialProgress(quest);
  for(const action of [
    {type:'continue',stepId:'briefing'}, {type:'continue',stepId:'observe'},
    {type:'answer',stepId:'measure',value:'40'}, {type:'answer',stepId:'material',value:'osb'},
    {type:'answer',stepId:'process',value:'cnc'}, {type:'finish',stepId:'complete'},
  ] as const) {
    assert.deepEqual(decode({...fresh(),quest:p}).quest,p);
    p=transition(quest,p,action).progress;
  }
  const migrated=decode({version:1,cell:{x:1,y:4},mode:'direct',width:45});
  assert.equal(migrated.version,2);assert.equal(migrated.mode,'direct');assert.equal(migrated.width,45);
  assert.deepEqual(migrated.cell,fresh().cell); // new box occupies the old saved position
  assert.equal(migrated.quest.stepId,'briefing');
  assert.throws(()=>decode({...fresh(),quest:{...p,revision:99}}));
  assert.throws(()=>decode({...fresh(),quest:{...p,hints:{measure:12}}}));
  assert.throws(()=>decode({...fresh(),quest:{...p,answers:{material:'impossible'}}}));
});
