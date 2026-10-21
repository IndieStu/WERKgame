import room from '../../content/rooms/prototype-room.json' with { type: 'json' };
import questData from '../../content/quests/shelf-problem.json' with { type: 'json' };
import { initialProgress, validProgress, type Progress, type Quest } from './quest.ts';
export const quest = questData as Quest;
export type Cell = { x: number; y: number };
export const SIZE = 9;
export const objects = room.objects;
export const iso = ({ x, y }: Cell): Cell => ({ x: (x - y) * 32, y: (x + y) * 16 });
export const unproject = ({ x, y }: Cell): Cell => ({ x: x / 64 + y / 32, y: y / 32 - x / 64 });
export const walkable = (p: Cell) => Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < SIZE && p.y < SIZE && !objects.some(o => o.x === p.x && o.y === p.y);
const key = (p: Cell) => `${p.x},${p.y}`;
export const adjacent = (p: Cell): Cell[] => [{ x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y }, { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 }].filter(walkable);
export function path(start: Cell, goal: Cell): Cell[] | null {
  if (!walkable(start) || !walkable(goal)) return null;
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
    for (const next of adjacent(current)) {
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
  version: 2; cell: Cell; mode: 'tap' | 'direct'; width: number | null;
  avatar: 'mint' | 'orange'; help: 'normal' | 'more'; quest: Progress;
};
export const fresh = (): Save => ({ version: 2, cell: { x: 1, y: 6 }, mode: 'tap', width: null, avatar: 'mint', help: 'normal', quest: initialProgress(quest) });
export function decode(raw: unknown): Save {
  if (!raw || typeof raw !== 'object') throw Error('Ungültiger Spielstand');
  const s = raw as Save;
  // Phase-1 saves retain their valid settings; the quest always starts fresh.
  if ((s as { version: number }).version === 1) {
    if (!s.cell || !Number.isInteger(s.cell.x) || !Number.isInteger(s.cell.y) || s.cell.x < 0 || s.cell.y < 0 || s.cell.x >= SIZE || s.cell.y >= SIZE || !['tap', 'direct'].includes(s.mode) || !(s.width === null || typeof s.width === 'number' && Number.isFinite(s.width) && s.width > 0 && s.width <= 300)) throw Error('Beschädigter Phase-1-Spielstand');
    return { ...fresh(), cell: walkable(s.cell) ? { ...s.cell } : fresh().cell, mode: s.mode, width: s.width };
  }
  if (s.version !== 2) throw Error('Unbekannte Saveversion. Vorhandenen Stand nicht überschreiben.');
  if (!s.cell || !walkable(s.cell) || !['tap', 'direct'].includes(s.mode) || !['mint', 'orange'].includes(s.avatar) || !['normal', 'more'].includes(s.help) || !(s.width === null || typeof s.width === 'number' && Number.isFinite(s.width) && s.width > 0 && s.width <= 300) || !validProgress(quest, s.quest)) throw Error('Beschädigter oder inkompatibler Queststand. Bitte vor einem Reset prüfen.');
  return { version: 2, cell: { ...s.cell }, mode: s.mode, width: s.width, avatar: s.avatar, help: s.help, quest: structuredClone(s.quest) };
}
