import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iso, unproject, path, walkable, measurement, decode, fresh, objects } from '../game/source/domain.ts';
test('Projection roundtrip including fractional actor positions',()=>{
 for(let x=0;x<9;x+=0.5)for(let y=0;y<9;y+=0.5)assert.deepEqual(unproject(iso({x,y})),{x,y});
});
test('A* routes around shelf without blocked cells or diagonal corner cuts',()=>{
 const route=path({x:4,y:3},{x:4,y:5})!;assert.ok(route.length>2);let previous={x:4,y:3};
 for(const p of route){assert.ok(walkable(p));assert.equal(Math.abs(p.x-previous.x)+Math.abs(p.y-previous.y),1);previous=p;}
 assert.deepEqual(previous,{x:4,y:5});
 for(const o of objects)assert.equal(path({x:0,y:0},o),null);
 assert.equal(path({x:0,y:0},{x:-1,y:0}),null);
});
test('measurement rejects empty, units, NaN, zero and extreme values; decimal comma accepted',()=>{
 for(const s of ['', '-5','0','Infinity','1e10','40 cm','301','0x20'])assert.equal(measurement(s),null);
 assert.equal(measurement('40,5'),40.5);assert.equal(measurement('40.5'),40.5);
});
test('save validation preserves valid state and rejects newer/invalid saves',()=>{
 assert.deepEqual(decode(fresh()),fresh());
 assert.throws(()=>decode({...fresh(),version:2}));assert.throws(()=>decode({...fresh(),cell:objects[0]}));assert.throws(()=>decode({...fresh(),width:NaN}));
});
