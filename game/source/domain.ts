export type Cell = { x: number; y: number };
export const SIZE = 9;
export const objects = [
  { id: 'shelf', label: 'Hoher Regalblock', x: 4, y: 4, height: 90, color: 0x747d87 },
  { id: 'bench', label: 'Werkbankblock', x: 2, y: 3, height: 32, color: 0x96918a },
  { id: 'machine', label: 'Maschinenblock', x: 6, y: 3, height: 57, color: 0x87959b },
];
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
export type Save = { version: 1; cell: Cell; mode: 'tap' | 'direct'; width: number | null };
export const fresh = (): Save => ({ version: 1, cell: { x: 1, y: 6 }, mode: 'tap', width: null });
export function decode(raw: unknown): Save {
  if (!raw || typeof raw !== 'object') throw Error('Ungültiger Teststand');
  const s = raw as Save;
  if (s.version !== 1) throw Error('Unbekannte Saveversion. Vorhandenen Stand nicht überschreiben.');
  if (!s.cell || !walkable(s.cell) || !['tap', 'direct'].includes(s.mode) || !(s.width === null || typeof s.width === 'number' && Number.isFinite(s.width) && s.width > 0 && s.width <= 300)) throw Error('Beschädigter Teststand');
  return { version: 1, cell: { ...s.cell }, mode: s.mode, width: s.width };
}
