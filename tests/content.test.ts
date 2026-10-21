import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// @ts-ignore Node executes this test; the content validator is an intentionally small JS build tool.
import { validateQuest } from '../tools/validate-content.mjs';
const q=JSON.parse(readFileSync('content/quests/shelf-problem.json','utf8'));
const schema=JSON.parse(readFileSync('content/schemas/quest.schema.json','utf8'));
test('shipped quest validates and invalid content fails before build',()=>{
  assert.doesNotThrow(()=>validateQuest(q,schema));
  const broken=structuredClone(q);broken.steps[0].next='missing';assert.throws(()=>validateQuest(broken,schema));
  const missing=structuredClone(q);delete missing.steps[2].expected;assert.throws(()=>validateQuest(missing,schema));
  const badRequirement=structuredClone(q);badRequirement.steps[1].requires.all=['absent'];assert.throws(()=>validateQuest(badRequirement,schema));
  const deadEnd=structuredClone(q);deadEnd.steps.find((s:{id:string})=>s.id==='process').options.forEach((o:{next:string})=>o.next='process');assert.throws(()=>validateQuest(deadEnd,schema));
});
