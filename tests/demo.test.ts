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
 assert.equal(walkable({x:8,y:16},true),true); // crates clear the floor
});
test('windows are hosted on photo-backed exterior walls M, E and C and stay inside those segments',()=>{
 const allowed=new Set(['M','E','C']);let count=0;
 const floor=(p:{x:number,y:number})=>roomConfig!.floorRegions.some(r=>p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.d);
 for(const wall of roomConfig!.walls){
  const dx=wall.to.x-wall.from.x,dy=wall.to.y-wall.from.y,len=Math.hypot(dx,dy);
  for(const w of wall.windows){
   count++;assert.ok(allowed.has(wall.id));assert.ok(w.start>=0&&w.start+w.length<=len);assert.ok(w.sill+w.height<=wall.height);
   const x=wall.from.x+dx/len*(w.start+w.length/2),y=wall.from.y+dy/len*(w.start+w.length/2);
   const a={x:Math.round(x+(dy?-.5:0)),y:Math.round(y+(dx?-.5:0))},b={x:Math.round(x+(dy?.5:0)),y:Math.round(y+(dx?.5:0))};
   assert.notEqual(floor(a),floor(b),wall.id+' must be an exterior floor boundary');
  }
 }
 assert.equal(count,4);
 for(const id of ['cnc','laser','diode','cut','table_saw','bandsaw','drill','extractor'])assert.ok(objects.some(o=>o.id===id),id+' present');
});
