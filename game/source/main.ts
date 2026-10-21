import Phaser from 'phaser';
import './style.css';
import { adjacent, decode, fresh, iso, measurement, objects, path, SIZE, unproject, walkable, type Cell } from './domain';
import { Store } from './storage';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const dialog = $<HTMLDialogElement>('dialog');
const mode = $<HTMLSelectElement>('mode');
const input = $<HTMLInputElement>('width');
const store = new Store();
let state = fresh(), canSave = true, ready = false;
let saveQueue = Promise.resolve();
const say = (text: string) => { $('message').textContent = text; };
const persist = () => {
  if (!canSave) return;
  const snapshot = decode(state);
  saveQueue = saveQueue.then(() => store.save(snapshot)).then(() => { $('save-status').textContent = 'Lokal gespeichert (IndexedDB)'; }).catch(() => { $('save-status').textContent = 'Speichern fehlgeschlagen. Teststand bleibt nur bis zum Neuladen verfügbar.'; });
};
try {
  state = await store.open() ?? fresh();
  $('save-status').textContent = 'Lokaler Speicher bereit';
} catch (error) {
  canSave = false;
  $('save-status').textContent = `Ohne Speicherung: ${error instanceof Error ? error.message : 'Speicherzugriff fehlgeschlagen'}`;
}
mode.value = state.mode;
input.value = state.width === null ? '' : String(state.width);
let scene: Lab;
let lastFocus: HTMLElement | null = null;
function openDialog() {
  if (dialog.open) return;
  scene?.stop(); lastFocus = document.activeElement as HTMLElement;
  dialog.showModal(); input.focus();
}
dialog.addEventListener('close', () => { lastFocus?.focus(); });
$('open-dialog').onclick = openDialog;
$('close-dialog').onclick = () => dialog.close();
$('measurement').onsubmit = event => {
  event.preventDefault();
  const value = measurement(input.value);
  if (value === null) { $('feedback').textContent = 'Bitte eine Zahl über 0 bis 300 cm eingeben. Komma oder Punkt ist möglich.'; input.setAttribute('aria-invalid', 'true'); return; }
  input.removeAttribute('aria-invalid'); state.width = value; persist();
  $('feedback').textContent = `${value.toLocaleString('de-DE')} cm übernommen. Testwert bleibt lokal.`;
};
function applyMode() {
  $('pad').hidden = state.mode !== 'direct';
  $('instruction').textContent = state.mode === 'tap' ? 'A: Tippe auf freie Felder oder einen Objektblock. Objektliste als Alternative.' : 'B: Halte eine Richtungstaste gedrückt. Die Pfeile folgen den schrägen Raumachsen. Tippe Objekte zum Untersuchen.';
}
mode.onchange = () => { state.mode = mode.value === 'direct' ? 'direct' : 'tap'; scene?.stop(); applyMode(); persist(); };
applyMode();
$('reset').onclick = async () => {
  if (!confirm('Gespeicherte Position und Testwert dieser Runde löschen?')) return;
  scene?.stop();
  await saveQueue;
  try { await store.clear(); state = fresh(); canSave = true; input.value = ''; mode.value = state.mode; scene?.resetPosition(); applyMode(); persist(); say('Teststand zurückgesetzt.'); }
  catch { say('Zurücksetzen fehlgeschlagen. Der gespeicherte Stand wurde nicht als gelöscht bestätigt.'); }
};
const offsets: Record<string, Cell> = { up: { x: -1, y: 0 }, right: { x: 0, y: -1 }, down: { x: 1, y: 0 }, left: { x: 0, y: 1 } };
let held: string | null = null;
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-dir]')) {
  const direction = button.dataset.dir!;
  button.textContent = ({ up: '↖', right: '↗', down: '↘', left: '↙' } as Record<string, string>)[direction];
  button.onpointerdown = event => { event.preventDefault(); button.setPointerCapture(event.pointerId); held = direction; scene?.cancelRoute(); };
  button.onpointerup = button.onpointercancel = button.onlostpointercapture = () => { held = null; };
}
window.addEventListener('blur', () => { held = null; scene?.stop(); });
document.addEventListener('visibilitychange', () => { held = null; scene?.stop(); });

class Lab extends Phaser.Scene {
  cell = { ...state.cell };
  route: Cell[] = [];
  target: Cell | null = null;
  pending: string | null = null;
  actor!: Phaser.GameObjects.Container;
  origin = { x: 400, y: 90 };
  keys = new Set<string>();
  frames = 0; sampleStart = performance.now(); fps = 0;
  constructor() { super('lab'); }
  stop() { this.route = []; this.pending = null; this.keys.clear(); held = null; }
  cancelRoute() { this.route = []; this.pending = null; }
  resetPosition() { this.target = null; this.cell = { ...state.cell }; const p = this.screen(this.cell); this.actor.setPosition(p.x, p.y); this.actor.setDepth(p.y); $('position').textContent=`${this.cell.x}, ${this.cell.y}`; }
  screen(p: Cell) { const q = iso(p); return { x: q.x + this.origin.x, y: q.y + this.origin.y }; }
  create() {
    scene = this;
    const floor = this.add.graphics();
    for (let x = 0; x < SIZE; x++) for (let y = 0; y < SIZE; y++) {
      const p = this.screen({ x, y });
      floor.fillStyle((x + y) % 2 ? 0x394750 : 0x414f58); floor.lineStyle(1, 0x63727b);
      floor.fillPoints([new Phaser.Math.Vector2(p.x,p.y-16),new Phaser.Math.Vector2(p.x+32,p.y),new Phaser.Math.Vector2(p.x,p.y+16),new Phaser.Math.Vector2(p.x-32,p.y)], true);
      floor.strokePoints([new Phaser.Math.Vector2(p.x,p.y-16),new Phaser.Math.Vector2(p.x+32,p.y),new Phaser.Math.Vector2(p.x,p.y+16),new Phaser.Math.Vector2(p.x-32,p.y)], true);
    }
    const walls = this.add.graphics().setDepth(-1);
    walls.fillStyle(0x52616c); walls.fillPoints([new Phaser.Math.Vector2(112,218),new Phaser.Math.Vector2(400,74),new Phaser.Math.Vector2(400,24),new Phaser.Math.Vector2(112,168)],true);
    walls.fillStyle(0x626e77); walls.fillPoints([new Phaser.Math.Vector2(400,74),new Phaser.Math.Vector2(688,218),new Phaser.Math.Vector2(688,168),new Phaser.Math.Vector2(400,24)],true);
    this.add.text(365, 38, 'TÜR', { fontSize: '15px', color: '#ffffff', backgroundColor: '#354049' }).setDepth(0);
    for (const o of objects) {
      const p = this.screen(o); const g = this.add.graphics().setDepth(p.y);
      g.fillStyle(o.color); g.fillPoints([new Phaser.Math.Vector2(p.x-29,p.y-o.height),new Phaser.Math.Vector2(p.x,p.y-o.height+14),new Phaser.Math.Vector2(p.x,p.y+14),new Phaser.Math.Vector2(p.x-29,p.y)],true);
      g.fillStyle(o.color - 0x161616); g.fillPoints([new Phaser.Math.Vector2(p.x,p.y-o.height+14),new Phaser.Math.Vector2(p.x+29,p.y-o.height),new Phaser.Math.Vector2(p.x+29,p.y),new Phaser.Math.Vector2(p.x,p.y+14)],true);
      g.fillStyle(o.color + 0x171717); g.fillPoints([new Phaser.Math.Vector2(p.x-29,p.y-o.height),new Phaser.Math.Vector2(p.x,p.y-o.height-14),new Phaser.Math.Vector2(p.x+29,p.y-o.height),new Phaser.Math.Vector2(p.x,p.y-o.height+14)],true);
      const zone = this.add.zone(p.x,p.y-o.height/2,58,o.height+28).setDepth(1000+p.y).setInteractive();
      zone.on('pointerdown', (_p: Phaser.Input.Pointer, _x:number, _y:number, event:Phaser.Types.Input.EventData) => { event.stopPropagation(); this.visit(o.id); });
      const button = document.createElement('button'); button.textContent = o.label; button.onclick = () => this.visit(o.id); $('objects').append(button);
    }
    const body = this.add.graphics();
    body.fillStyle(0x101a21,0.45); body.fillEllipse(0,0,22,10);
    body.fillStyle(0xe9cf87); body.fillRect(-8,-45,16,14);
    body.fillStyle(0x8dbdb4); body.fillRect(-10,-31,20,21);
    body.fillStyle(0x1d252b); body.fillRect(-8,-10,6,10); body.fillRect(2,-10,6,10);
    this.actor = this.add.container(0,0,[body]); this.resetPosition();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (dialog.open || state.mode !== 'tap') return;
      const local = { x: pointer.worldX - this.origin.x, y: pointer.worldY - this.origin.y };
      const raw = unproject(local); const destination = { x: Math.round(raw.x), y: Math.round(raw.y) };
      const from = this.target ?? this.cell;
      const route = path(from,destination);
      if (!route) { say('Dieses Feld ist blockiert oder liegt außerhalb des Raums.'); return; }
      this.route = route; this.pending = null; say('Ziel gewählt.');
    });
    window.addEventListener('keydown', event => {
      if (dialog.open || ['INPUT','SELECT','TEXTAREA','BUTTON'].includes((event.target as HTMLElement)?.tagName)) return;
      const map: Record<string,string> = { ArrowUp:'up',w:'up',ArrowRight:'right',d:'right',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left' };
      if (map[event.key]) { event.preventDefault(); this.keys.add(map[event.key]); this.cancelRoute(); }
      if (event.key.toLowerCase() === 'e') openDialog();
    });
    window.addEventListener('keyup', event => {
      const map: Record<string,string> = { ArrowUp:'up',w:'up',ArrowRight:'right',d:'right',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left' };
      if(map[event.key]) this.keys.delete(map[event.key]);
    });
    this.game.canvas.addEventListener('webglcontextlost', () => { this.stop(); say('Grafikkontext verloren. Nach Wiederherstellung prüfen oder Seite neu laden.'); });
    this.game.canvas.addEventListener('webglcontextrestored', () => say('Grafikkontext wiederhergestellt. Darstellung und Eingaben bitte prüfen.'));
    ready = true; say('Testraum bereit. Beide Steuerungen ausprobieren.');
    performance.mark('werk-ready');
    $('metrics').textContent = `Start ${Math.round(performance.now())} ms · FPS-Messung läuft`;
  }
  visit(id: string) {
    if(dialog.open) return;
    const object = objects.find(o => o.id === id)!;
    const from = this.target ?? this.cell;
    const routes = adjacent(object).map(goal => path(from,goal)).filter((p): p is Cell[] => p !== null).sort((a,b) => a.length-b.length);
    if (!routes.length) return say('Kein Weg zum Objekt.');
    this.route = routes[0]; this.pending = id;
    say(`Unterwegs: ${object.label}`);
  }
  update(_time: number, delta: number) {
    this.frames++; const sampleDuration = performance.now() - this.sampleStart;
    if (sampleDuration >= 1000) {
      this.fps = Math.round(this.frames * 1000 / sampleDuration); this.frames=0; this.sampleStart=performance.now();
      $('metrics').textContent = `${this.fps} fps · Start ${Math.round(performance.getEntriesByName('werk-ready')[0]?.startTime ?? 0)} ms · ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`;
    }
    if(!this.actor || dialog.open || document.hidden) return;
    if (!this.target) {
      const direction = held ?? this.keys.values().next().value;
      if(direction) {
        const offset = offsets[direction]; const next = { x:this.cell.x+offset.x,y:this.cell.y+offset.y };
        if(walkable(next)) this.target=next;
      } else if(this.route.length) this.target=this.route.shift()!;
      else if(this.pending) { const name=objects.find(o=>o.id===this.pending)!.label; this.pending=null; say(`${name} erreicht. HTML-Testdialog geöffnet.`); openDialog(); return; }
    }
    if(this.target) {
      const goal=this.screen(this.target), dx=goal.x-this.actor.x, dy=goal.y-this.actor.y, distance=Math.hypot(dx,dy), step=150*Math.min(delta,50)/1000;
      if(distance<=step) {
        this.actor.setPosition(goal.x,goal.y); this.cell={...this.target}; this.target=null; state.cell={...this.cell}; persist();
        $('position').textContent=`${this.cell.x}, ${this.cell.y}`;
      } else this.actor.setPosition(this.actor.x+dx/distance*step,this.actor.y+dy/distance*step);
      this.actor.setDepth(this.actor.y);
    }
  }
}
new Phaser.Game({ type:Phaser.AUTO,parent:'game',width:800,height:500,backgroundColor:'#222e38',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Lab });

let offlineReady=false;
if(import.meta.env.PROD && 'serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    const refresh = async () => {
      const active = registration.active;
      if (!active) return;
      const channel = new MessageChannel();
      channel.port1.onmessage = event => { offlineReady=event.data.ready===true; $('offline-status').textContent=offlineReady ? 'Offlinepaket vollständig · Wiederstart testen' : 'Offlinepaket unvollständig'; };
      active.postMessage('status',[channel.port2]);
    };
    await navigator.serviceWorker.ready; await refresh();
    if(registration.waiting) $('offline-status').textContent='Update vorhanden. Nach beendetem Test alle Spieltabs schließen und erneut öffnen.';
    registration.addEventListener('updatefound',()=> { const worker=registration.installing; worker?.addEventListener('statechange',()=>{ if(worker.state==='installed' && navigator.serviceWorker.controller) $('offline-status').textContent='Update bereit: nach Test alle Spieltabs schließen.'; else void refresh(); }); });
  } catch { $('offline-status').textContent='Offlineinstallation fehlgeschlagen. Online weitertesten; HTTPS und Speicher prüfen.'; }
}
$('export').onclick=()=>{
  const report={phase:1,date:new Date().toISOString(),userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},ready,offlineReady,mode:state.mode,state,saveStatus:$('save-status').textContent,metrics:$('metrics').textContent,resources:performance.getEntriesByType('resource').map(e=>{const r=e as PerformanceResourceTiming;return {name:new URL(r.name).pathname,transferSize:r.transferSize,duration:Math.round(r.duration)};}),note:'Lokaler Messbericht. Kein Nachweis eines realen iPadtests; Gerät und Bedingungen manuell ergänzen.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='werk-phase1-test.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
