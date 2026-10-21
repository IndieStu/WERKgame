import Ajv from 'ajv';
import { readFile } from 'node:fs/promises';
export function validateQuest(q, schema) {
 const validate=new Ajv({allErrors:true,strict:false}).compile(schema);
 if(!validate(q))throw Error(JSON.stringify(validate.errors,null,2));
 const ids=new Set(q.steps.map(s=>s.id));
 if(ids.size!==q.steps.length || !ids.has(q.startStepId))throw Error('Doppelte IDs oder fehlender Start');
 const known=new Set(q.discoveries);
 const checkRequirements=r=>{
  if(!r)return;
  const references=[...(r.all??[]),...(r.minOf?.ids??[])];
  if(references.some(id=>!known.has(id)))throw Error('Unbekannte Entdeckung in Voraussetzung');
  if(r.minOf && (new Set(r.minOf.ids).size!==r.minOf.ids.length || r.minOf.count>r.minOf.ids.length))throw Error('Unerfüllbare Mindestanzahl');
 };
 const adjacency=new Map();
 for(const s of q.steps){
  checkRequirements(s.requires);for(const o of s.options??[])checkRequirements(o.requires);
  const edges=s.type==='choice'?s.options.map(o=>o.next):s.next?[s.next]:[];
  if(edges.some(id=>!ids.has(id)))throw Error('Unbekannter Folgeschritt: '+s.id);
  if(s.type==='choice'&&new Set(s.options.map(o=>o.id)).size!==s.options.length)throw Error('Doppelte Option: '+s.id);
  adjacency.set(s.id,edges);
 }
 const reachable=new Set();const visit=id=>{if(reachable.has(id))return;reachable.add(id);for(const n of adjacency.get(id))visit(n);};visit(q.startStepId);
 if(reachable.size!==ids.size)throw Error('Unerreichbare Schritte');
 const exits=new Set(q.steps.filter(s=>s.type==='result').map(s=>s.id));
 let changed=true;while(changed){changed=false;for(const [id,edges]of adjacency)if(!exits.has(id)&&edges.some(n=>exits.has(n))){exits.add(id);changed=true;}}
 if(exits.size!==ids.size)throw Error('Schritt ohne erreichbaren Abschluss');
 return q;
}
if(process.argv[1]?.endsWith('validate-content.mjs')){
 const quest=JSON.parse(await readFile('content/quests/shelf-problem.json','utf8'));
 const schema=JSON.parse(await readFile('content/schemas/quest.schema.json','utf8'));
 validateQuest(quest,schema);
 const room=JSON.parse(await readFile('content/rooms/prototype-room.json','utf8'));
 const ids=new Set(), cells=new Set();
 for(const o of room.objects){
  if(ids.has(o.id)||cells.has(`${o.x},${o.y}`)||!Number.isInteger(o.x)||!Number.isInteger(o.y)||o.x<0||o.y<0||o.x>=9||o.y>=9||!o.label||!o.shortLabel||!o.description||!Number.isFinite(o.height)||o.height<=0)throw Error('Ungültiges Raumobjekt: '+o.id);
  ids.add(o.id);cells.add(`${o.x},${o.y}`);
 }
 if(!ids.has(quest.npcId)||quest.steps.some(s=>s.stationId&&!ids.has(s.stationId)))throw Error('Unbekannte Raumreferenz');
 console.log('Quest: Schema, IDs, Übergänge, Erreichbarkeit und Abschluss geprüft.');
}
