import Phaser from 'phaser';
import { adjacent, iso, objects, path, SIZE, unproject, walkable, type Cell, type Save } from './domain';

type RoomHooks = {
  state(): Save; paused(): boolean; moved(p: Cell): void;
  interact(id: string): void; say(text: string): void;
  metrics(text: string): void; position(p: Cell): void; ready(): void;
};
const offsets: Record<string, Cell> = {
  up: { x: -1, y: 0 }, right: { x: 0, y: -1 },
  down: { x: 1, y: 0 }, left: { x: 0, y: 1 },
};
const vectors = (points: number[][]) => points.map(([x, y]) => new Phaser.Math.Vector2(x, y));

export class Room extends Phaser.Scene {
  private cell: Cell;
  private route: Cell[] = [];
  private target: Cell | null = null;
  private pending: string | null = null;
  private held: string | null = null;
  private actor!: Phaser.GameObjects.Container;
  private shirt!: Phaser.GameObjects.Graphics;
  private shelfResult!: Phaser.GameObjects.Graphics;
  private origin = { x: 400, y: 70 };
  private frames = 0;
  private sampleStart = performance.now();
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private hooks: RoomHooks) {
    super('werk-room');
    this.cell = { ...hooks.state().cell };
  }
  stop() { this.route = []; this.pending = null; this.held = null; }
  direct(direction: string | null) {
    if (direction) { this.route = []; this.pending = null; }
    this.held = direction;
  }
  private screen(p: Cell) {
    const q = iso(p);
    return { x: q.x + this.origin.x, y: q.y + this.origin.y };
  }
  refresh() {
    if (!this.actor) return;
    this.shirt.clear().fillStyle(this.hooks.state().avatar === 'mint' ? 0x8dbdb4 : 0xd6a279).fillRect(-10, -31, 20, 21);
    this.shelfResult.setVisible(this.hooks.state().quest.completed);
  }
  resetPosition() {
    this.stop(); this.target = null; this.cell = { ...this.hooks.state().cell };
    const p = this.screen(this.cell);
    this.actor.setPosition(p.x, p.y).setDepth(p.y);
    this.hooks.position(this.cell); this.refresh();
  }
  private figure(x: number, y: number, jonas: boolean) {
    const body = this.add.graphics();
    body.fillStyle(0x101a21, 0.45).fillEllipse(0, 0, 22, 10);
    body.fillStyle(0xe9cf87).fillRect(-8, -45, 16, 14);
    body.fillStyle(0x26343e).fillRect(-8, -10, 6, 10).fillRect(2, -10, 6, 10);
    const shirt = this.add.graphics().fillStyle(jonas ? 0x4279bd : 0x8dbdb4).fillRect(-10, -31, 20, 21);
    if (jonas) {
      body.fillStyle(0x3262a0).fillRect(-10, -49, 19, 7);
      body.fillStyle(0xe5ce7b).fillRect(-10, -43, 25, 3);
      body.lineStyle(1, 0x202830).strokeRect(-7, -39, 6, 4).strokeRect(1, -39, 6, 4);
    } else this.shirt = shirt;
    return this.add.container(x, y, [shirt, body]).setDepth(y);
  }
  create() {
    const floor = this.add.graphics();
    for (let x = 0; x < SIZE; x++) for (let y = 0; y < SIZE; y++) {
      const p = this.screen({ x, y });
      const diamond = vectors([[p.x, p.y - 16], [p.x + 32, p.y], [p.x, p.y + 16], [p.x - 32, p.y]]);
      floor.fillStyle((x + y) % 2 ? 0x394750 : 0x414f58).fillPoints(diamond, true);
      floor.lineStyle(1, 0x63727b).strokePoints(diamond, true);
    }
    const walls = this.add.graphics().setDepth(-1);
    walls.fillStyle(0x52616c).fillPoints(vectors([[112, 198], [400, 54], [400, 4], [112, 148]]), true);
    walls.fillStyle(0x626e77).fillPoints(vectors([[400, 54], [688, 198], [688, 148], [400, 4]]), true);
    this.add.text(365, 20, 'TÜR', { fontSize: '15px', color: '#ffffff', backgroundColor: '#354049' }).setDepth(0);
    for (const o of objects) {
      const p = this.screen(o);
      if (o.id === 'jonas') this.figure(p.x, p.y, true);
      else {
        const g = this.add.graphics().setDepth(p.y);
        g.fillStyle(o.color).fillPoints(vectors([[p.x - 29, p.y - o.height], [p.x, p.y - o.height + 14], [p.x, p.y + 14], [p.x - 29, p.y]]), true);
        g.fillStyle(o.color - 0x161616).fillPoints(vectors([[p.x, p.y - o.height + 14], [p.x + 29, p.y - o.height], [p.x + 29, p.y], [p.x, p.y + 14]]), true);
        g.fillStyle(o.color + 0x171717).fillPoints(vectors([[p.x - 29, p.y - o.height], [p.x, p.y - o.height - 14], [p.x + 29, p.y - o.height], [p.x, p.y - o.height + 14]]), true);
        if (o.id === 'shelf') {
          g.lineStyle(2, 0xb7c4cc);
          for (const offset of [20, 48, 74]) g.lineBetween(p.x - 27, p.y - offset, p.x, p.y - offset + 14);
          this.shelfResult = this.add.graphics().setDepth(p.y + 0.1);
          for (const offset of [30, 58]) this.shelfResult.fillStyle(0x83bca8).fillRect(p.x - 23, p.y - offset, 18, 13);
        }
      }
      this.add.zone(p.x, p.y - o.height / 2, 58, o.height + 28).setDepth(1000 + p.y).setInteractive()
        .on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
          event.stopPropagation(); this.visit(o.id);
        });
      // Labels are HTML-independent visual orientation, not required for keyboard access.
      this.add.text(p.x, p.y + 18, o.shortLabel, { fontSize: '12px', color: '#dbe6eb', backgroundColor: '#26333e' }).setOrigin(0.5, 0).setDepth(2000);
    }
    this.actor = this.figure(0, 0, false);
    this.resetPosition();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.hooks.paused() || this.hooks.state().mode !== 'tap') return;
      const q = unproject({ x: pointer.worldX - this.origin.x, y: pointer.worldY - this.origin.y });
      const route = path(this.target ?? this.cell, { x: Math.round(q.x), y: Math.round(q.y) });
      if (!route) return this.hooks.say('Dieses Feld ist blockiert oder liegt außerhalb des Raums.');
      this.route = route; this.pending = null; this.held = null;
    });
    this.game.canvas.addEventListener('webglcontextlost', () => { this.stop(); this.hooks.say('Grafikkontext verloren. Gegebenenfalls neu laden; der Fortschritt bleibt lokal.'); });
    this.hooks.ready();
  }
  visit(id: string) {
    if (this.hooks.paused()) return;
    const object = objects.find(o => o.id === id);
    if (!object) return;
    const routes = adjacent(object).map(goal => path(this.target ?? this.cell, goal)).filter((p): p is Cell[] => p !== null).sort((a, b) => a.length - b.length);
    if (!routes.length) return this.hooks.say('Kein Weg zum Objekt.');
    this.route = routes[0]; this.pending = id; this.held = null;
    this.hooks.say(`Unterwegs: ${object.label}`);
  }
  update(time: number, delta: number) {
    this.frames++;
    const elapsed = performance.now() - this.sampleStart;
    if (elapsed >= 1000) {
      this.hooks.metrics(`${Math.round(this.frames * 1000 / elapsed)} fps · ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`);
      this.frames = 0; this.sampleStart = performance.now();
    }
    if (!this.actor || this.hooks.paused() || document.hidden) return;
    if (!this.target) {
      if (this.held) {
        const offset = offsets[this.held];
        if (offset) { const next = { x: this.cell.x + offset.x, y: this.cell.y + offset.y }; if (walkable(next)) this.target = next; }
      } else if (this.route.length) this.target = this.route.shift()!;
      else if (this.pending) { const id = this.pending; this.pending = null; this.hooks.interact(id); return; }
    }
    if (this.target) {
      const goal = this.screen(this.target), dx = goal.x - this.actor.x, dy = goal.y - this.actor.y;
      const distance = Math.hypot(dx, dy), step = 150 * Math.min(delta, 50) / 1000;
      if (distance <= step) {
        this.actor.setPosition(goal.x, goal.y); this.cell = { ...this.target }; this.target = null;
        this.hooks.moved(this.cell); this.hooks.position(this.cell);
      } else this.actor.setPosition(this.actor.x + dx / distance * step, this.actor.y + dy / distance * step);
      this.actor.setDepth(this.actor.y);
      // Cheap placeholder walk pose; no production sprite commitments.
      if (!this.reduced) this.actor.setScale(1, 1 + Math.sin(time / 70) * 0.025);
    } else this.actor.setScale(1);
  }
}
