import Phaser from 'phaser';
import frames from '../../content/art/woodshop-v2-frames.json';
import { onFloor, roomConfig, SIZE, type Cell, type RoomObject } from './domain';
type Project = (p:Cell)=>Cell;
type G = Phaser.GameObjects.Graphics;
const polygon=(g:G,p:Cell[],color:number)=>g.fillStyle(color).fillPoints(p.map(v=>new Phaser.Math.Vector2(v.x,v.y)),true);
const outline=(g:G,p:Cell[],color:number,width=2)=>g.lineStyle(width,color).strokePoints(p.map(v=>new Phaser.Math.Vector2(v.x,v.y)),true);
export function preloadWorkshop(scene:Phaser.Scene){for(const key of ['machines','characters','materials','extra','finish'])scene.load.image('wood-'+key,`./art/woodshop-v2/${key==='machines'?'machines-v2':key}.png`);}
function registerFrames(scene:Phaser.Scene){
 for(const [sheet,items] of Object.entries(frames)){
  const texture=scene.textures.get('wood-'+sheet);
  for(const [name,rect] of Object.entries(items)){const [x,y,w,h]=rect;if(!texture.has(name))texture.add(name,0,x,y,w,h);}
 }
}
function textureSurface(scene:Phaser.Scene,key:string,width:number,height:number,side:1|-1,wall:boolean,shade=false){
 const texture=scene.textures.createCanvas(key,width+2,height+Math.ceil(width/2)+2)!;
 const ctx=texture.context,materials=scene.textures.get('wood-materials').getSourceImage() as HTMLImageElement;
 const half=materials.width/2;
 ctx.imageSmoothingEnabled=true;
 ctx.setTransform(side,.5,0,1,side===1?1:width+1,1);
 ctx.drawImage(materials,wall?half:0,shade?half:0,half,half,0,0,width,height);
 if(wall){ctx.fillStyle=side===1?'rgba(58,42,23,.13)':'rgba(255,244,214,.09)';ctx.fillRect(0,0,width,height);}
 texture.refresh();return texture;
}
function drawWindow(scene:Phaser.Scene,world:Project,from:Cell,to:Cell,w:{start:number;length:number;sill:number;height:number}){
 const length=Math.hypot(to.x-from.x,to.y-from.y),dx=(to.x-from.x)/length,dy=(to.y-from.y)/length;
 const a=world({x:from.x+dx*w.start,y:from.y+dy*w.start}),b=world({x:from.x+dx*(w.start+w.length),y:from.y+dy*(w.start+w.length)});
 const p=[{x:a.x,y:a.y-w.sill-w.height},{x:b.x,y:b.y-w.sill-w.height},{x:b.x,y:b.y-w.sill},{x:a.x,y:a.y-w.sill}];
 const g=scene.add.graphics().setDepth(-680);polygon(g,p,0xc7dbd4);outline(g,p,0x716956,7);outline(g,p,0xece3cf,3);
 const midTop={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2},midBottom={x:(p[2].x+p[3].x)/2,y:(p[2].y+p[3].y)/2};
 g.lineStyle(3,0xf7efde).lineBetween(midTop.x,midTop.y,midBottom.x,midBottom.y).lineBetween(a.x,a.y-w.sill-w.height*.48,b.x,b.y-w.sill-w.height*.48);
 g.lineStyle(1,0xffffff,.65).lineBetween(p[0].x+4,p[0].y+6,p[1].x-4,p[1].y+6);
 g.lineStyle(5,0xbaa78b).lineBetween(a.x,a.y-w.sill+3,b.x,b.y-w.sill+3);
}
function wall(scene:Phaser.Scene,world:Project,s:NonNullable<typeof roomConfig>['walls'][number],index:number){
 const a=world(s.from),b=world(s.to),width=Math.round(Math.abs(b.x-a.x)),side=b.x>=a.x?1:-1;
 const key='wall-surface-'+index;
 textureSurface(scene,key,width,s.height,side,true);
 scene.add.image(side===1?a.x-1:a.x-width-1,a.y-s.height-1,key).setOrigin(0).setDepth(-700);
 const edge=scene.add.graphics().setDepth(-690);
 edge.lineStyle(5,0xb6a17d).lineBetween(a.x,a.y-s.height,b.x,b.y-s.height);
 edge.lineStyle(4,0x695847).lineBetween(a.x,a.y-3,b.x,b.y-3);
 edge.lineStyle(1,0xe4d2ac).lineBetween(a.x,a.y-s.height-2,b.x,b.y-s.height-2);
 for(const w of s.windows)drawWindow(scene,world,s.from,s.to,w);
}
function floorTexture(scene:Phaser.Scene,key:string,dark:boolean){
 const texture=scene.textures.createCanvas(key,128,64)!;
 const ctx=texture.context,im=scene.textures.get('wood-materials').getSourceImage() as HTMLImageElement;
 const h=im.width/2;ctx.imageSmoothingEnabled=true;ctx.setTransform(1,.5,-1,.5,64,0);
 ctx.drawImage(im,0,dark?h:0,h/2,h/2,0,0,64,64);texture.refresh();
}
export function workshopShell(scene:Phaser.Scene,world:Project){
 registerFrames(scene);floorTexture(scene,'wood-floor',false);floorTexture(scene,'wood-floor-dark',true);
 for(let x=0;x<SIZE;x++)for(let y=0;y<SIZE;y++)if(onFloor({x,y})){
  const p=world({x,y});scene.add.image(p.x,p.y,(x<6?'wood-floor-dark':'wood-floor')).setDisplaySize(64,32).setDepth(-1000);
 }
 roomConfig!.walls.forEach((s,i)=>wall(scene,world,s,i));
 // Photo B: high timber storage on the retained west wall of the CNC room.
 const rackPoint=world({x:-.5,y:19.2});
 scene.add.image(rackPoint.x,rackPoint.y-38,'wood-extra','overhead').setOrigin(.5,1).setDisplaySize(140,60).setFlipX(true).setDepth(-650);
 const sign=world({x:8,y:8.5});scene.add.text(sign.x-22,sign.y-94,'WERK',{fontFamily:'monospace',fontStyle:'bold',fontSize:'13px',color:'#65563f'}).setDepth(-650).setResolution(4);
 // Clear entrance frame at F. No windows are ever generated outside wall data.
 const entry=scene.add.graphics().setDepth(-640);
 for(const x of [9.5,11.5]){const p=world({x,y:8.5});entry.lineStyle(5,0x977c56).lineBetween(p.x,p.y,p.x,p.y-102);}
 const da=world({x:9.5,y:8.5}),db=world({x:11.5,y:8.5});entry.lineStyle(6,0xab8b60).lineBetween(da.x,da.y-102,db.x,db.y-102);
}
export function workshopObject(scene:Phaser.Scene,o:RoomObject,world:Project):G{
 const p=world(o),w=o.w??1,d=o.d??1,foot={x:p.x+(w-d)*16,y:p.y+(w+d-1)*16};
 const g=scene.add.graphics().setDepth(foot.y-.1);g.fillStyle(0x2a241a,.22).fillEllipse(foot.x,foot.y-5,(w+d)*24,(w+d)*10);
 const sheet=['bandsaw','drill'].includes(o.kind)?'extra':'machines';
 const name=o.kind==='cut'?'mitre':o.kind;
 const texture=scene.textures.get('wood-'+sheet);
 if(texture.has(name)){
  const image=scene.add.image(foot.x,foot.y,'wood-'+sheet,name).setOrigin(.5,1).setDepth(foot.y);
  const target=(w+d)*32*(name==='timber'?.88:.95);image.setScale(Math.min(target/image.width,name==='bandsaw'?100/image.height:Infinity));if(o.id==='plate_stock')image.setFlipX(true);
 }else if(o.kind==='sample'){
  const q=[{x:p.x,y:p.y-14},{x:p.x+25,y:p.y-2},{x:p.x,y:p.y+10},{x:p.x-25,y:p.y-2}];
  polygon(g,q,o.color);outline(g,q,0x765b3c,1);g.fillStyle(0x886440).fillRect(p.x-1,p.y+10,3,9);
  for(let i=0;i<5;i++){g.lineStyle(1,i%2?0xe5ca91:0x9d7846).lineBetween(p.x-22,p.y-1+i,p.x,p.y+9+i);}
 }else if(o.kind==='coffee'){
  g.fillStyle(0x9c7044).fillRect(p.x-14,p.y-10,28,12).fillRect(p.x-12,p.y,4,14).fillRect(p.x+8,p.y,4,14);
  g.fillStyle(0xe7dcc1).fillRect(p.x-5,p.y-23,11,13).lineStyle(2,0xe7dcc1).strokeCircle(p.x+8,p.y-17,4).fillStyle(0x64412b).fillRect(p.x-3,p.y-23,7,3);
 }
 return g;
}
export function workshopPerson(scene:Phaser.Scene,x:number,y:number,jonas:boolean){
 const shadow=scene.add.graphics().fillStyle(0x1a1d1c,.35).fillEllipse(0,0,24,9);
 const body=scene.add.image(0,1,'wood-characters',jonas?'jonas':'player').setOrigin(.5,1).setName('body');body.setScale(78/body.height);
 const shirt=scene.add.graphics();return{container:scene.add.container(x,y,[shadow,body,shirt]).setDepth(y),shirt};
}
