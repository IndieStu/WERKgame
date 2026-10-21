import Phaser from 'phaser';
import { adjacent, iso, objects, path, SIZE, unproject, walkable, type Cell, type Save } from './domain';
export type Hotspot = { id: string; x: number; y: number; label: string };
type RoomHooks = {
  state(): Save; paused(): boolean; moved(p: Cell): void; interact(id: string): void;
  say(text: string): void; metrics(text: string): void; ready(): void; hotspots(points: Hotspot[]): void;
};
const offsets: Record<string, Cell> = { up: { x: -1, y: 0 }, right: { x: 0, y: -1 }, down: { x: 1, y: 0 }, left: { x: 0, y: 1 } };
const vectors = (p: number[][]) => p.map(([x, y]) => new Phaser.Math.Vector2(x, y));
export class Room extends Phaser.Scene {
  private cell: Cell;
  private route: Cell[] = [];
  private target: Cell | null = null;
  private pending: string | null = null;
  private held: string | null = null;
  private actor!: Phaser.GameObjects.Container;
  private shirt!: Phaser.GameObjects.Graphics;
  private shelf!: Phaser.GameObjects.Graphics;
  private crates: Phaser.GameObjects.Graphics[] = [];
  private ruler!: Phaser.GameObjects.Graphics;
  private rulerText!: Phaser.GameObjects.Text;
  private jonasBubble!: Phaser.GameObjects.Text;
  private measuring = false;
  private lastCompleted: boolean | null = null;
  private origin = { x: 480, y: 155 };
  private frames = 0; private sampleStart = performance.now();
  private zoomFactor = 1;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  constructor(private hooks: RoomHooks) { super('werk-room'); this.cell = { ...hooks.state().cell }; }
  stop() {
    this.route = []; this.pending = null; this.held = null;
    if (this.actor && this.target) {
      const p = this.world(this.cell); this.actor.setPosition(p.x, p.y).setDepth(p.y); this.target = null;
    }
  }
  direct(direction: string | null) { if (direction) { this.route = []; this.pending = null; } this.held = direction; }
  private world(p: Cell) { const q = iso(p); return { x: q.x + this.origin.x, y: q.y + this.origin.y }; }
  private cameraSize = () => {
    if (!this.actor) return;
    const camera = this.cameras.main, w = this.scale.width, h = this.scale.height;
    camera.setZoom(Math.max(w < 650 ? 1 : .65, Math.min(1.8, Math.min(w / 780, h / 570))) * this.zoomFactor);
    if (w < 650 || this.zoomFactor > 1.25) camera.startFollow(this.actor, true, .12, .12);
    else { camera.stopFollow(); camera.centerOn(480, 275); }
  };
  zoom(amount: number) { this.zoomFactor = Math.max(.8, Math.min(1.6, this.zoomFactor + amount)); this.cameraSize(); }
  setMeasuring(value: boolean) { this.measuring = value; this.refresh(); }
  ping(id: string) {
    const o = objects.find(o => o.id === id); if (!o) return;
    const p = this.world(o), marker = this.add.graphics().setDepth(3000);
    marker.lineStyle(3, 0xf5d99e).strokeEllipse(p.x, p.y, 66, 32);
    this.time.delayedCall(3000, () => marker.destroy());
    this.hooks.say(`${o.label}: der markierte Ort.`);
  }
  refresh() {
    if (!this.actor) return;
    const state = this.hooks.state(), complete = state.quest.completed;
    this.shirt.clear().fillStyle(state.avatar === 'mint' ? 0x8dbdb4 : 0xd6a279).fillRect(-10, -31, 20, 21);
    this.jonasBubble.setVisible(state.quest.stepId === 'briefing');
    const site = this.world(objects.find(o => o.id === 'site')!);
    this.shelf.clear();
    if (!complete) {
      this.shelf.lineStyle(2, 0xc7bb94, .8).strokePoints(vectors([[site.x-40,site.y],[site.x,site.y+20],[site.x+40,site.y],[site.x,site.y-20]]), true);
    } else {
      const color = state.quest.answers.material === 'mdf' ? 0xc8c1a3 : state.quest.answers.material === 'osb' ? 0xb58c4e : 0xd8b17c;
      this.shelf.fillStyle(color).fillRect(site.x-34, site.y-90, 7, 94).fillRect(site.x+26, site.y-90, 7, 94);
      for (const level of state.quest.layout.boards) this.shelf.fillRect(site.x-34, site.y-Number(level), 67, 5);
      this.shelf.lineStyle(2, 0x645541).strokeRect(site.x-34,site.y-90,67,94);
    }
    const intervals = [0, ...state.quest.layout.boards.filter((n): n is number => n !== null).sort((a,b) => a-b)];
    const floor = this.world(objects.find(o => o.id === 'crates')!);
    this.crates.forEach((crate, i) => {
      const slot = state.quest.layout.boxes[i === 0 ? 'small' : 'tall'] ?? 0;
      const x = complete ? site.x-18 : floor.x+(i ? 18 : -18);
      const y = complete ? site.y-Number(intervals[slot] ?? 0)-3 : floor.y+(i ? -9 : 8);
      if (this.lastCompleted === false && complete && !this.reduced) {
        this.tweens.add({ targets: crate, x, y, duration: 650, delay: i*120, onComplete: () => crate.setDepth(site.y+1) });
      } else { this.tweens.killTweensOf(crate); crate.setPosition(x,y).setDepth(complete ? site.y+1 : floor.y+1); }
    });
    this.lastCompleted = complete;
    this.ruler.clear().setVisible(this.measuring);
    this.rulerText.setVisible(this.measuring && state.quest.discovered.includes('measure_end'));
    if (this.measuring) {
      const started = state.quest.discovered.includes('measure_start');
      this.ruler.lineStyle(3, 0xf5d99e).lineBetween(site.x-55,site.y+28,started ? site.x+55 : site.x-35,site.y+28);
      if (started) for(let i=0;i<=9;i++) this.ruler.lineBetween(site.x-55+i*110/9,site.y+22,site.x-55+i*110/9,site.y+34);
    }
  }
  resetPosition() {
    this.stop(); this.cell = { ...this.hooks.state().cell };
    const p = this.world(this.cell); this.actor.setPosition(p.x,p.y).setDepth(p.y);
    this.lastCompleted = null; this.measuring = false; this.refresh(); this.cameraSize();
  }
  private figure(x: number, y: number, jonas: boolean) {
    const body = this.add.graphics().fillStyle(0x101a21,.4).fillEllipse(0,0,22,10);
    body.fillStyle(0xe8c68d).fillRect(-8,-45,16,14).fillStyle(0x202c35).fillRect(-8,-10,6,10).fillRect(2,-10,6,10);
    const shirt = this.add.graphics().fillStyle(jonas ? 0x4279bd : 0x8dbdb4).fillRect(-10,-31,20,21);
    if (jonas) {
      body.fillStyle(0x3262a0).fillRect(-10,-49,19,7).fillStyle(0xe5ce7b).fillRect(-10,-43,25,3);
      body.lineStyle(1,0x202830).strokeRect(-7,-39,6,4).strokeRect(1,-39,6,4);
    } else this.shirt = shirt;
    return this.add.container(x,y,[shirt,body]).setDepth(y);
  }
  create() {
    const floor = this.add.graphics();
    for (let x=0;x<SIZE;x++) for(let y=0;y<SIZE;y++) {
      const p=this.world({x,y}), diamond=vectors([[p.x,p.y-16],[p.x+32,p.y],[p.x,p.y+16],[p.x-32,p.y]]);
      floor.fillStyle((x+y)%2 ? 0x505653 : 0x575b55).fillPoints(diamond,true).lineStyle(1,0x68716a,.5).strokePoints(diamond,true);
    }
    const walls=this.add.graphics().setDepth(-1);
    walls.fillStyle(0x696f66).fillPoints(vectors([[192,283],[480,139],[480,59],[192,203]]),true);
    walls.fillStyle(0x75796b).fillPoints(vectors([[480,139],[768,283],[768,203],[480,59]]),true);
    this.add.text(290,180,'WERK',{fontSize:'22px',color:'#e6d5b5'}).setDepth(0);
    for(const o of objects) {
      const p=this.world(o);
      if(o.kind==='npc') this.figure(p.x,p.y,true);
      else if(o.id==='site') this.shelf=this.add.graphics().setDepth(p.y);
      else if(o.id==='crates') {
        for(let i=0;i<2;i++) {
          const c=this.add.graphics().fillStyle(i?0xba9b6e:0xd2b789).fillRect(0,-(i?30:21),34,i?30:21);
          c.lineStyle(2,0x776143).strokeRect(0,-(i?30:21),34,i?30:21).lineBetween(0,-10,34,-10);
          this.crates.push(c);
        }
      } else if(o.kind==='coffee') {
        const g=this.add.graphics().setDepth(p.y);
        g.fillStyle(0xdcd9ba).fillRoundedRect(p.x-8,p.y-20,16,18,3).lineStyle(2,0xdcd9ba).strokeCircle(p.x+10,p.y-12,5);
      } else {
        const g=this.add.graphics().setDepth(p.y);
        g.fillStyle(o.color).fillPoints(vectors([[p.x-26,p.y-o.height],[p.x,p.y-o.height+13],[p.x,p.y+13],[p.x-26,p.y]]),true);
        g.fillStyle(o.color-0x151515).fillPoints(vectors([[p.x,p.y-o.height+13],[p.x+26,p.y-o.height],[p.x+26,p.y],[p.x,p.y+13]]),true);
        g.fillStyle(o.color+0x121212).fillPoints(vectors([[p.x-26,p.y-o.height],[p.x,p.y-o.height-13],[p.x+26,p.y-o.height],[p.x,p.y-o.height+13]]),true);
        if(o.kind==='sample') {
          g.lineStyle(2,0x675748);
          if(o.id==='multiplex') for(let i=0;i<3;i++)g.lineBetween(p.x-24,p.y-10+i*3,p.x-2,p.y+2+i*3);
          if(o.id==='osb') for(let i=0;i<4;i++)g.lineBetween(p.x-16+i*7,p.y-16,p.x-10+i*7,p.y-11);
        }
      }
    }
    const site=this.world(objects.find(o=>o.id==='site')!);
    this.ruler=this.add.graphics().setDepth(2500);
    this.rulerText=this.add.text(site.x,site.y+48,'90 cm',{fontSize:'18px',color:'#ffe0a3',backgroundColor:'#21323c'}).setOrigin(.5).setDepth(2500);
    const jonas=this.world(objects.find(o=>o.id==='jonas')!);
    this.jonasBubble=this.add.text(jonas.x+18,jonas.y-70,'Wohin nur mit den Kisten …',{fontSize:'13px',color:'#f0e5cd',backgroundColor:'#24353be8',padding:{x:8,y:5}}).setDepth(3000);
    this.actor=this.figure(0,0,false);this.resetPosition();
    this.scale.on('resize',this.cameraSize);
    this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{
      if(this.hooks.paused() || this.hooks.state().mode!=='tap')return;
      const p=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
      const q=unproject({x:p.x-this.origin.x,y:p.y-this.origin.y});
      const route=path(this.target??this.cell,{x:Math.round(q.x),y:Math.round(q.y)},this.hooks.state().quest.completed);
      if(!route)return this.hooks.say('Da kommst du nicht hin.');
      this.route=route;this.pending=null;this.held=null;
    });
    this.game.canvas.addEventListener('webglcontextlost',()=>{this.stop();this.hooks.say('Die Grafik wurde unterbrochen. Du kannst neu laden; prüfe vorher den Speicherstatus im Menü.');});
    this.game.canvas.tabIndex = 0;
    this.game.canvas.setAttribute('aria-label', 'Spielraum. Pfeile oder WASD zum Gehen, E zum Untersuchen. Tab erreicht Personen und Dinge.');
    this.hooks.ready();
  }
  nearby() {
    const o=objects.filter(o=>!(o.id==='crates'&&this.hooks.state().quest.completed)).map(o=>({o,d:Math.abs(o.x-this.cell.x)+Math.abs(o.y-this.cell.y)})).filter(v=>v.d<=1).sort((a,b)=>a.d-b.d)[0]?.o;
    if(o)this.hooks.interact(o.id);else this.hooks.say('Geh näher an eine Person oder einen Gegenstand.');
  }
  visit(id:string) {
    if(this.hooks.paused())return;
    const o=objects.find(o=>o.id===id);if(!o)return;
    const done=this.hooks.state().quest.completed;
    const routes=adjacent(o,done).map(goal=>path(this.target??this.cell,goal,done)).filter((r):r is Cell[]=>r!==null).sort((a,b)=>a.length-b.length);
    if(!routes.length)return this.hooks.say('Hier ist gerade kein Weg frei.');
    this.route=routes[0];this.pending=id;this.held=null;
  }
  update(time:number,delta:number) {
    if(!this.actor)return;
    this.frames++;const elapsed=performance.now()-this.sampleStart;
    if(elapsed>=1000){this.hooks.metrics(`${Math.round(this.frames*1000/elapsed)} fps`);this.frames=0;this.sampleStart=performance.now();}
    const cam=this.cameras.main;
    const points:Hotspot[]=objects.filter(o=>!(o.id==='crates'&&this.hooks.state().quest.completed)).map(o=>{
      const p=this.world(o);return{id:o.id,label:o.label,x:(p.x-cam.worldView.x)*cam.zoom,y:(p.y-Math.min(o.height/2,25)-cam.worldView.y)*cam.zoom};
    });
    if(this.measuring){const p=this.world(objects.find(o=>o.id==='site')!);for(const [id,offset]of [['measure_start',-55],['measure_end',55]] as const)points.push({id,label:id==='measure_start'?'Anfang des Maßbands':'Ende des Maßbands',x:(p.x+offset-cam.worldView.x)*cam.zoom,y:(p.y+28-cam.worldView.y)*cam.zoom});}
    this.hooks.hotspots(points);
    if(this.hooks.paused()||document.hidden)return;
    if(!this.target){
      if(this.held){const d=offsets[this.held];if(d){const n={x:this.cell.x+d.x,y:this.cell.y+d.y};if(walkable(n,this.hooks.state().quest.completed))this.target=n;}}
      else if(this.route.length)this.target=this.route.shift()!;
      else if(this.pending){const id=this.pending;this.pending=null;this.hooks.interact(id);return;}
    }
    if(this.target){
      const p=this.world(this.target),dx=p.x-this.actor.x,dy=p.y-this.actor.y,distance=Math.hypot(dx,dy),step=150*Math.min(delta,50)/1000;
      if(distance<=step){this.actor.setPosition(p.x,p.y);this.cell={...this.target};this.target=null;this.hooks.moved(this.cell);}
      else this.actor.setPosition(this.actor.x+dx/distance*step,this.actor.y+dy/distance*step);
      this.actor.setDepth(this.actor.y);
      if(!this.reduced)this.actor.setScale(1,1+Math.sin(time/70)*.025);
    }else this.actor.setScale(1);
  }
}
