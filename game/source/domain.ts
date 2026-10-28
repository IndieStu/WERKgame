import room from '../../content/rooms/prototype-room.json' with { type: 'json' };
import demoRoom from '../../content/rooms/workshop-demo.json' with { type: 'json' };
import questData from '../../content/quests/shelf-problem.json' with { type: 'json' };
import { initialProgress, validProgress, type Progress, type Quest } from './quest.ts';

export type Cell = { x: number; y: number };
export const visitDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'visit';
export const quest:Quest = visitDemo ? structuredClone(questData) as Quest : questData as Quest;
if(visitDemo){
 const material=quest.steps.find(s=>s.id==='material')!;material.blockedText='Vergleiche erst zwei Proben. Zwei findest du im Holzlager hinten, eine rechts in der Werkstatt.';
 material.hints=['Schau ins Holzlager hinter dem Durchgang.','Zwei Proben liegen hinten im Lager, die OSB-Probe rechts im Werkstattraum.','Untersuche mindestens zwei und kehre zu Jonas zurück.'];
 const process=quest.steps.find(s=>s.id==='process')!;process.hints=['Die CNC steht links im Nebenraum. Die Zuschnittplanung liegt vorn auf der Bank.','Untersuche beide Möglichkeiten und achte auf Form und Vorbereitung.','Rechtecke lassen sich einfach zuschneiden; CNC braucht ein Programm.'];
}
export type RoomObject = { id:string; label:string; x:number; y:number; height:number; color:number; kind:string; shortLabel:string; description:string; detail:string; w?:number; d?:number };
export const roomConfig = visitDemo ? demoRoom : null;
export const SIZE = roomConfig?.size ?? 9;
export const objects: RoomObject[] = visitDemo ? demoRoom.objects : room.objects;
export function onFloor(p:Cell) { return !roomConfig || roomConfig.floorRegions.some(r=>p.x>=r.x && p.x<r.x+r.w && p.y>=r.y && p.y<r.y+r.d); }
export const footprint = (o: RoomObject) => Array.from({length:(o.w??1)*(o.d??1)},(_,i)=>({x:o.x+i%(o.w??1),y:o.y+Math.floor(i/(o.w??1))}));
export const iso = ({ x, y }: Cell): Cell => ({ x: (x - y) * 32, y: (x + y) * 16 });
export const unproject = ({ x, y }: Cell): Cell => ({ x: x / 64 + y / 32, y: y / 32 - x / 64 });
export const walkable = (p: Cell, completed = false) => Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < SIZE && p.y < SIZE && onFloor(p) && !roomConfig?.barriers.some(b=>b.x===p.x&&b.y===p.y) && !objects.some(o => footprint(o).some(c=>c.x===p.x&&c.y===p.y) && !(o.id === 'crates' && completed));
const key = (p: Cell) => `${p.x},${p.y}`;
export const adjacent = (p: Cell, completed = false): Cell[] => [{ x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y }, { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 }].filter(p => walkable(p, completed));
export function path(start: Cell, goal: Cell, completed = false): Cell[] | null {
  if (!walkable(start, completed) || !walkable(goal, completed)) return null;
  const open = [start], cost = new Map([[key(start), 0]]), previous = new Map<string, Cell>();
  const distance = (p: Cell) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);
  while (open.length) {
    open.sort((a, b) => cost.get(key(a))! + distance(a) - cost.get(key(b))! - distance(b));
    const current = open.shift()!;
    if (key(current) === key(goal)) {
      const result: Cell[] = []; let step = current;
      while (key(step) !== key(start)) { result.unshift(step); step = previous.get(key(step))!; }
      return result;
    }
    for (const next of adjacent(current, completed)) {
      const candidate = cost.get(key(current))! + 1;
      if (candidate < (cost.get(key(next)) ?? Infinity)) {
        cost.set(key(next), candidate); previous.set(key(next), current);
        if (!open.some(p => key(p) === key(next))) open.push(next);
      }
    }
  }
  return null;
}
export function measurement(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 && value <= 300 ? value : null;
}
export type Save = {
  version: 3; cell: Cell; mode: 'tap' | 'direct'; width: number | null;
  avatar: 'mint' | 'orange'; help: 'normal' | 'more'; quest: Progress;
  legacy?: { version: 1 | 2; completed: boolean };
};
export const fresh = (): Save => ({ version: 3, cell: roomConfig ? {...roomConfig.spawn} : { x: 2, y: 7 }, mode: 'tap', width: null, avatar: 'mint', help: 'normal', quest: initialProgress(quest) });
function oldCell(p: Cell): boolean {
  return !!p && Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < SIZE && p.y < SIZE;
}
export function decode(raw: unknown): Save {
  if (!raw || typeof raw !== 'object') throw Error('Ungültiger Spielstand');
  const old = raw as { version?: number; cell: Cell; mode: Save['mode']; width: unknown; avatar: Save['avatar']; help: Save['help']; quest?: { revision: number; completed: boolean } };
  if (old.version === 1 || old.version === 2) {
    if (!oldCell(old.cell) || !['tap', 'direct'].includes(old.mode) || !(old.width === null || typeof old.width === 'number' && Number.isFinite(old.width) && old.width > 0 && old.width <= 300)) throw Error('Beschädigter früherer Spielstand');
    if (old.version === 2 && (!['mint', 'orange'].includes(old.avatar) || !['normal', 'more'].includes(old.help) || old.quest?.revision !== 1 || typeof old.quest.completed !== 'boolean')) throw Error('Unbekannter früherer Queststand');
    const next = fresh();
    return { ...next, mode: old.mode, avatar: old.version === 2 ? old.avatar : next.avatar, help: old.version === 2 ? old.help : next.help, cell: walkable(old.cell) ? { ...old.cell } : next.cell, legacy: { version: old.version, completed: old.version === 2 && old.quest!.completed } };
  }
  const s = raw as Save;
  if (s.version !== 3) throw Error('Unbekannte Saveversion. Vorhandener Stand bleibt unverändert.');
  if (!s.cell || !validProgress(quest, s.quest) || !walkable(s.cell, s.quest.completed) || !['tap', 'direct'].includes(s.mode) || !['mint', 'orange'].includes(s.avatar) || !['normal', 'more'].includes(s.help) || !(s.width === null || typeof s.width === 'number' && Number.isFinite(s.width) && Math.abs(s.width - 90) <= 1)) throw Error('Beschädigter oder inkompatibler Spielstand. Bitte vor einem Reset exportieren.');
  if (s.legacy && (![1, 2].includes(s.legacy.version) || typeof s.legacy.completed !== 'boolean')) throw Error('Ungültige Migrationsnotiz');
  return { version: 3, cell: { ...s.cell }, mode: s.mode, width: s.width, avatar: s.avatar, help: s.help, quest: structuredClone(s.quest), ...(s.legacy ? { legacy: { ...s.legacy } } : {}) };
}
