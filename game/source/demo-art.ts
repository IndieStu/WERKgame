import Phaser from 'phaser';
import { onFloor, SIZE, type Cell, type RoomObject } from './domain';
type G = Phaser.GameObjects.Graphics;
type Project = (p:Cell)=>Cell;
const poly=(g:G,points:number[][],color:number)=>g.fillStyle(color).fillPoints(points.map(([x,y])=>new Phaser.Math.Vector2(x,y)),true);
// A small reusable, code-drawn art kit. Shapes share the same ground grid as movement.
function box(g:G,x:number,y:number,w:number,d:number,h:number,top:number,left:number,right:number){
 const a=[x,y],b=[x+w*32,y+w*16],c=[x+(w-d)*32,y+(w+d)*16],e=[x-d*32,y+d*16];
 poly(g,[[e[0],e[1]-h],[c[0],c[1]-h],c,e],left);
 poly(g,[[c[0],c[1]-h],[b[0],b[1]-h],b,c],right);
 poly(g,[[a[0],a[1]-h],[b[0],b[1]-h],[c[0],c[1]-h],[e[0],e[1]-h]],top);
 g.lineStyle(1,0x31291f,.55).strokePoints([a,b,c,e].map(([px,py])=>new Phaser.Math.Vector2(px,py-h)),true);
}
function topPoint(x:number,y:number,u:number,v:number,z:number){return{x:x+(u-v)*32,y:y+(u+v)*16-z};}
function windowPane(g:G,x:number,y:number,side:'x'|'y',width=76){
 const dx=side==='x'?width:-width,dy=width/2;
 poly(g,[[x,y],[x+dx,y+dy],[x+dx,y+dy+64],[x,y+64]],0x5b4a36);
 poly(g,[[x+(side==='x'?4:-4),y+5],[x+dx+(side==='x'?-4:4),y+dy+5],[x+dx+(side==='x'?-4:4),y+dy+58],[x+(side==='x'?4:-4),y+58]],0xb6d0c8);
 g.lineStyle(4,0xe9dbc0).lineBetween(x+dx/2,y+dy/2+3,x+dx/2,y+dy/2+62).lineBetween(x,y+32,x+dx,y+dy+32);
 g.lineStyle(3,0xeadfc6).strokePoints([[x,y],[x+dx,y+dy],[x+dx,y+dy+64],[x,y+64]].map(([px,py])=>new Phaser.Math.Vector2(px,py)),true);
}
export function workshopShell(scene:Phaser.Scene,world:Project){
 const floor=scene.add.graphics().setDepth(-1000);
 for(let x=0;x<SIZE;x++)for(let y=0;y<SIZE;y++){
  if(!onFloor({x,y}))continue;const p=world({x,y});
  // Fine warm floor boards with deterministic wear; no runtime noise or photo textures.
  poly(floor,[[p.x,p.y-16],[p.x+32,p.y],[p.x,p.y+16],[p.x-32,p.y]],(x+y)%2?0x99846a:0xa48d70);
  floor.lineStyle(1,0x675847,.65).strokePoints([[p.x,p.y-16],[p.x+32,p.y],[p.x,p.y+16],[p.x-32,p.y]].map(([a,b])=>new Phaser.Math.Vector2(a,b)),true);
  for(let k=0;k<3;k++){const p1=topPoint(p.x,p.y-14,.12+k*.25,.1,0),p2=topPoint(p.x,p.y-14,.12+k*.25,.75,0);floor.lineStyle(1,0xc5aa83,.35).lineBetween(p1.x,p1.y,p2.x,p2.y);}
  if((x*13+y*7)%5===0)floor.fillStyle(0x6f604c,.3).fillRect(p.x-5,p.y,5,1);
 }
 const walls=scene.add.graphics().setDepth(-900);
 // Open-front cutaway: stock room behind the workshop, CNC/laser in the left annex.
 function wall(a:Cell,b:Cell,color:number){const p=world(a),q=world(b);poly(walls,[[p.x,p.y],[q.x,q.y],[q.x,q.y-86],[p.x,p.y-86]],color);walls.lineStyle(5,0xc9b998).lineBetween(p.x,p.y-86,q.x,q.y-86);walls.lineStyle(6,0x756249).lineBetween(p.x,p.y-3,q.x,q.y-3);}
 wall({x:3.5,y:-.5},{x:11.5,y:-.5},0xc9c1a7);
 wall({x:3.5,y:-.5},{x:3.5,y:6.5},0xd9cdb0);
 wall({x:-.5,y:6.5},{x:3.5,y:6.5},0xc9c1a7);
 wall({x:-.5,y:6.5},{x:-.5,y:11.5},0xd9cdb0);
 // Partition retained as a low wall so the route through the door remains visible.
 const partition=scene.add.graphics().setDepth(180);
 for(const [x,y,w,d] of [[4,3,4,.22],[9,3,3,.22],[4,7,.22,2],[4,10,.22,2]]){const p=world({x,y});box(partition,p.x,p.y-14,w,d,24,0xd4c7aa,0xaa997d,0xb7a78c);}
 const p=world({x:3.5,y:3.8});windowPane(walls,p.x,p.y-76,'y',62);
 const w=world({x:3.5,y:5.8});windowPane(walls,w.x,w.y-76,'y',62);
 const c=world({x:-.5,y:8});windowPane(walls,c.x,c.y-76,'y',58);
 const sign=world({x:5.1,y:-.5});
 const plaque=scene.add.graphics().setDepth(-800);box(plaque,sign.x,sign.y-48,1.8,.12,24,0x8c593b,0x845137,0x68412e);
 scene.add.text(sign.x+12,sign.y-69,'WERK',{fontFamily:'monospace',fontStyle:'bold',fontSize:'15px',color:'#f3dfac',resolution:2}).setDepth(-790).setRotation(.15);
 // Upper timber racks and extraction pipe; clutter is intentionally left out.
 const rack=world({x:4,y:5});const detail=scene.add.graphics().setDepth(-750);
 for(let i=0;i<3;i++)box(detail,rack.x+24+i*9,rack.y-110+i*3,2.4,.14,7,0xd9b077,0xa87948,0x8d623a);
 const duct=world({x:1.5,y:9});detail.lineStyle(9,0x5b605c).lineBetween(duct.x+12,duct.y-50,duct.x+12,duct.y-108).lineBetween(duct.x+12,duct.y-108,duct.x+125,duct.y-160);detail.lineStyle(5,0xc0ba9e).lineBetween(duct.x+10,duct.y-50,duct.x+10,duct.y-108).lineBetween(duct.x+10,duct.y-108,duct.x+125,duct.y-160);
}
export function workshopObject(scene:Phaser.Scene,o:RoomObject,world:Project):G{
 const p=world(o),w=o.w??1,d=o.d??1,g=scene.add.graphics().setDepth(p.y+(w+d-2)*16+13);
 const x=p.x,y=p.y-14;
 g.fillStyle(0x30291c,.24).fillEllipse(p.x+(w-d)*16,p.y+(w+d-2)*8+5,(w+d)*27,20);
 if(o.kind==='bench'||o.kind==='cut'){
  for(const [u,v] of [[.05,.05],[w-.22,.05],[.05,d-.22],[w-.22,d-.22]]){const q=topPoint(x,y,u,v,0);box(g,q.x,q.y,.16,.16,25,0xb4874e,0x785331,0x66462d);}
  box(g,x,y,w,d,30,0xcda672,0x9d7548,0x876039);
  const a=topPoint(x,y,.1,.1,31),b=topPoint(x,y,w-.1,.1,31);g.lineStyle(1,0xf0cd91).lineBetween(a.x,a.y,b.x,b.y);
  for(let i=0;i<5;i++){const q=topPoint(x,y,.2+i*.25,.7,31);g.fillStyle(0x624631).fillRect(q.x,q.y,3,2);}
  const vise=topPoint(x,y,.5,d-.1,26);box(g,vise.x,vise.y,.4,.15,9,0x825d39,0x654830,0x503a29);g.lineStyle(2,0xb8b7aa).lineBetween(vise.x-8,vise.y+7,vise.x+5,vise.y+13);
  const sheet=topPoint(x,y,w*.45,.4,32);poly(g,[[sheet.x-13,sheet.y],[sheet.x+8,sheet.y-9],[sheet.x+27,sheet.y],[sheet.x+5,sheet.y+9]],0xf0dfb7);g.lineStyle(1,0x70858a).strokeRect(sheet.x+3,sheet.y-4,8,8);
  const tool=topPoint(x,y,.15,.25,32);g.lineStyle(3,0x6c4c30).lineBetween(tool.x,tool.y,tool.x+12,tool.y+6).lineStyle(4,0x7c8581).lineBetween(tool.x+8,tool.y+1,tool.x+15,tool.y+5);
 }else if(o.kind==='cnc'){
  box(g,x,y,w,d,24,0x535b5a,0x343c3c,0x232b2c);box(g,x+1,y-25,w-.12,d-.12,3,0xb79a70,0x7b6c52,0x665740);
  for(const u of [.05,w-.2]){const q=topPoint(x,y,u,.12,26);box(g,q.x,q.y,.12,d-.2,5,0xadb4ad,0x697573,0x454f51);}
  const a=topPoint(x,y,.12,.8,28);box(g,a.x,a.y,w-.25,.16,23,0x273d3c,0x16312e,0x102b29);const head=topPoint(x,y,1,.8,47);box(g,head.x,head.y,.3,.32,15,0xe98037,0xbf4f26,0x9e3c25);g.lineStyle(3,0xbfc6b3).lineBetween(head.x,head.y+12,head.x,head.y+27);
 }else if(o.kind==='laser'){
  box(g,x,y,w,d,22,0x5977a0,0x31567e,0x254566);const q=topPoint(x,y,.16,.13,24);poly(g,[[q.x,q.y],[q.x+40,q.y+20],[q.x+17,q.y+31],[q.x-23,q.y+11]],0x9bc1c5);g.lineStyle(2,0xe7dcb6).lineBetween(q.x,q.y,q.x+40,q.y+20);g.fillStyle(0xd4d9cb).fillRect(p.x+25,p.y+4,12,3);
 }else if(o.kind==='timber'){
  for(let i=0;i<4;i++){const q=topPoint(x,y,i*.8,.8,0);box(g,q.x,q.y,.12,.14,67,0xc39862,0x91653f,0x6e4a31);}
  for(let h=16;h<65;h+=19){const q=topPoint(x,y,0,.65,h);box(g,q.x,q.y,3,.5,5,0xd6ae79,0x9f7649,0x805a36);for(let i=0;i<6;i++){const v=topPoint(q.x,q.y,.1+i*.4,.1,7);box(g,v.x,v.y,.27,.35,5+(i%2)*5,0xbc8f59,0x93633a,0x80532f);}}
 }else if(o.kind==='cabinet'){
  box(g,x,y,1,1,50,0xb88a52,0x8d663d,0x785231);g.lineStyle(2,0x534d3d).strokeRect(p.x-23,p.y-34,18,28).strokeRect(p.x-1,p.y-23,18,24);g.fillStyle(0x8fa8a0,.7).fillRect(p.x-21,p.y-32,14,23);g.fillStyle(0xe2b96e).fillRect(p.x-5,p.y-22,2,4);
 }else if(o.kind==='coffee'){
  box(g,x,y,.7,.7,18,0x9e784b,0x785535,0x62422c);const q=topPoint(x,y,.3,.3,20);g.fillStyle(0xf0dba7).fillRect(q.x-6,q.y-12,11,12).lineStyle(2,0xf0dba7).strokeCircle(q.x+7,q.y-6,4);g.fillStyle(0x694a32).fillRect(q.x-4,q.y-12,7,3);
 }else if(o.kind==='sample'){
  box(g,x,y,.85,.85,12,o.color,0xa17a4d,0x8d6843);
  for(let i=0;i<4;i++){if(o.id==='multiplex')g.lineStyle(1,0xe3cba0).lineBetween(p.x-24,p.y-9+i*2,p.x,p.y+3+i*2);else if(o.id==='osb')g.lineStyle(2,i%2?0x9b6c3c:0xe0b978).lineBetween(p.x-15+i*7,p.y-17,p.x-8+i*7,p.y-13);}
 }
 return g;
}
export function workshopPerson(scene:Phaser.Scene,x:number,y:number,jonas:boolean){
 const g=scene.add.graphics(),shirt=scene.add.graphics();
 g.fillStyle(0x332c23,.35).fillEllipse(0,0,25,10);
 g.fillStyle(0x242d33).fillRect(-9,-16,8,15).fillRect(3,-16,8,15).fillStyle(0x4d4540).fillRect(-11,-4,10,5).fillRect(2,-4,11,5);
 shirt.fillStyle(jonas?0x38669d:0x8dbdb4).fillRect(-10,-33,20,22);
 g.fillStyle(0x252e35).fillRect(-4,-32,8,19).fillStyle(0xd7a57a).fillRect(-14,-22,5,9).fillRect(10,-22,5,9);
 g.fillStyle(0x593e2e).fillRect(-10,-51,20,20).fillStyle(0xf0c694).fillRect(-8,-48,16,15).fillStyle(0xd39a70).fillRect(5,-43,4,10);
 g.fillStyle(0x382e28).fillRect(-6,-43,2,2).fillRect(3,-43,2,2).fillRect(-2,-36,5,1);
 if(jonas){g.fillStyle(0x315b93).fillRect(-11,-55,21,10).fillStyle(0xddbc68).fillRect(-12,-47,27,3);g.lineStyle(1,0x433e32).strokeRect(-7,-43,6,5).strokeRect(2,-43,6,5).lineBetween(-1,-41,2,-41);g.fillStyle(0xe9c278).fillRect(-8,-29,2,2).fillRect(-8,-20,2,2);}
 else g.fillStyle(0x604130).fillRect(-9,-51,18,7).fillRect(-10,-46,3,7);
 return {container:scene.add.container(x,y,[shirt,g]).setDepth(y),shirt};
}
