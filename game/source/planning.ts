// Deliberately small spatial puzzle, not a construction or load-bearing simulation.
export type BoxId = 'small' | 'tall';
export type Layout = { boards: [number | null, number | null]; boxes: Record<BoxId, number | null> };
export const HEIGHT = 80;
export const LEVELS = [10, 20, 30, 40, 50, 60, 70];
export const BOXES: Record<BoxId, { label: string; height: number }> = {
  small: { label: 'Kleine Kiste', height: 24 }, tall: { label: 'Hohe Kiste', height: 34 },
};
export const emptyLayout = (): Layout => ({ boards: [null, null], boxes: { small: null, tall: null } });
export function compartments(layout: Layout): number[] | null {
  const [a, b] = layout.boards;
  if (a === null || b === null || a === b || !LEVELS.includes(a) || !LEVELS.includes(b)) return null;
  const [low, high] = [a, b].sort((x, y) => x - y);
  return [low, high - low, HEIGHT - high];
}
export function placeBoard(layout: Layout, index: number, level: number): Layout {
  if (![0, 1].includes(index) || !LEVELS.includes(level)) return layout;
  const boards: Layout['boards'] = [...layout.boards]; boards[index] = level;
  return { boards, boxes: { small: null, tall: null } };
}
export function placeBox(layout: Layout, box: BoxId, slot: number): { layout: Layout; feedback: string } {
  const gaps = compartments(layout);
  if (!gaps || ![0, 1, 2].includes(slot)) return { layout, feedback: 'Setze zuerst zwei Böden auf verschiedene Höhen.' };
  if (gaps[slot] < BOXES[box].height + 2) return { layout, feedback: 'Die Kiste stößt oben an. Versetze einen Boden oder nimm ein anderes Fach.' };
  const other: BoxId = box === 'small' ? 'tall' : 'small';
  if (layout.boxes[other] === slot) return { layout, feedback: 'Hier steht schon eine Kiste. Such für diese ein anderes Fach.' };
  return { layout: { boards: [...layout.boards], boxes: { ...layout.boxes, [box]: slot } }, feedback: 'Passt. Ein bisschen Luft ist auch noch da.' };
}
export function layoutReady(layout: Layout): boolean {
  const gaps = compartments(layout);
  return !!gaps && Object.entries(BOXES).every(([key, box]) => {
    const slot = layout.boxes[key as BoxId];
    return slot !== null && [0, 1, 2].includes(slot) && gaps[slot] >= box.height + 2;
  }) && layout.boxes.small !== layout.boxes.tall;
}
export function validLayout(raw: unknown): raw is Layout {
  if (!raw || typeof raw !== 'object') return false;
  const l = raw as Layout;
  if (!Array.isArray(l.boards) || l.boards.length !== 2 || !l.boards.every(v => v === null || LEVELS.includes(v)) || !l.boxes) return false;
  if (!['small', 'tall'].every(k => l.boxes[k as BoxId] === null || [0, 1, 2].includes(l.boxes[k as BoxId]!))) return false;
  const assigned = Object.values(l.boxes).some(v => v !== null);
  if (!assigned) return true;
  const gaps = compartments(l);
  return !!gaps && (l.boxes.small === null || l.boxes.tall === null || l.boxes.small !== l.boxes.tall)
    && (Object.keys(BOXES) as BoxId[]).every(k => l.boxes[k] === null || gaps[l.boxes[k]!] >= BOXES[k].height + 2);
}
