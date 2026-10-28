import { test } from 'node:test';
import assert from 'node:assert/strict';
(globalThis as unknown as {window:unknown}).window={location:{search:'?demo=visit'}};
const { fresh, objects, walkable, path, adjacent, footprint, decode, roomConfig }=await import('../game/source/domain.ts');
test('visitor room has a safe spawn and every object has a reachable footprint edge',()=>{
 const spawn=fresh().cell;assert.ok(walkable(spawn));assert.deepEqual(decode(fresh()),fresh());
 for(const o of objects){
  const cells=footprint(o);assert.equal(cells.length,(o.w??1)*(o.d??1));
  for(const c of cells)assert.equal(walkable(c),false,o.id+' footprint');
  const routes=cells.flatMap(c=>adjacent(c)).map(c=>path(spawn,c)).filter(Boolean);
  assert.ok(routes.length,o.id+' reachable');
 }
 for(const b of roomConfig!.barriers)assert.equal(walkable(b),false);
 assert.equal(walkable({x:0,y:0}),false); // room cutout
 assert.equal(walkable({x:9,y:7},true),true); // crates clear the floor
});
