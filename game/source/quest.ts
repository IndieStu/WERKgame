import { emptyLayout, layoutReady, placeBoard, placeBox, validLayout, type Layout, type BoxId } from './planning.ts';
export type Requirements = { all?: string[]; minOf?: { ids: string[]; count: number } };
export type Option = { id: string; label: string; feedback: string; next: string; requires?: Requirements };
type Common = { id: string; title: string; text: string; objective: string; hints?: string[]; requires?: Requirements; blockedText?: string };
export type Step = Common & (
  | { type: 'dialogue'; next: string }
  | { type: 'real_world_task'; next: string; stationId: string; mode: 'simulated'; safetyText: string; observation: string }
  | { type: 'measurement'; next: string; unit: string; expected: { value: number; tolerance: number }; retryFeedback: string; successFeedback: string }
  | { type: 'choice'; context?: string; options: Option[] }
  | { type: 'planning'; next: string }
  | { type: 'result'; completedText: string; outcomeId: string; careerFields: string[]; reflection: string }
);
export type Quest = { schemaVersion: 1; id: string; revision: number; title: string; roomId: string; npcId: string; startStepId: string; steps: Step[]; discoveries: string[] };
export type Progress = {
  revision: number; stepId: string; completed: boolean;
  answers: Record<string, string | number>; hints: Record<string, number>; attempts: Record<string, number>;
  discovered: string[]; layout: Layout;
};
export type Action =
  | { type: 'observe'; objectId: string }
  | ({ stepId: string } & (
    | { type: 'continue' } | { type: 'answer'; value: string } | { type: 'finish' }
    | { type: 'board'; index: number; level: number } | { type: 'box'; box: BoxId; slot: number }
    | { type: 'plan_complete' }
  ));
export type Transition = { progress: Progress; feedback: string; changed: boolean };
export const initialProgress = (q: Quest): Progress => ({ revision: q.revision, stepId: q.startStepId, completed: false, answers: {}, hints: {}, attempts: {}, discovered: [], layout: emptyLayout() });
export function currentStep(q: Quest, p: Progress): Step {
  const s = q.steps.find(s => s.id === p.stepId);
  if (!s) throw Error('Questschritt nicht gefunden');
  return s;
}
export function requirementsMet(p: Progress, required?: Requirements): boolean {
  return !required || (required.all ?? []).every(id => p.discovered.includes(id))
    && (!required.minOf || required.minOf.ids.filter(id => p.discovered.includes(id)).length >= required.minOf.count);
}
export function transition(q: Quest, previous: Progress, action: Action): Transition {
  const unchanged = (feedback = ''): Transition => ({ progress: previous, feedback, changed: false });
  if (action.type === 'observe') {
    if (!q.discoveries.includes(action.objectId) || previous.discovered.includes(action.objectId)) return unchanged();
    return { progress: { ...previous, discovered: [...previous.discovered, action.objectId] }, feedback: '', changed: true };
  }
  if (previous.completed || action.stepId !== previous.stepId) return unchanged();
  const step = currentStep(q, previous);
  if (!requirementsMet(previous, step.requires)) return unchanged(step.blockedText ?? 'Schau dich erst noch im Raum um.');
  const p = structuredClone(previous);
  let feedback = '';
  if (action.type === 'continue' && (step.type === 'dialogue' || step.type === 'real_world_task')) p.stepId = step.next;
  else if (action.type === 'answer' && step.type === 'measurement') {
    const value = /^\d+(\.\d+)?$/.test(action.value.trim().replace(',', '.')) ? Number(action.value.trim().replace(',', '.')) : NaN;
    p.attempts[step.id] = (p.attempts[step.id] ?? 0) + 1;
    if (!Number.isFinite(value) || Math.abs(value - step.expected.value) > step.expected.tolerance) feedback = step.retryFeedback;
    else { p.answers[step.id] = value; p.stepId = step.next; feedback = step.successFeedback; }
  } else if (action.type === 'answer' && step.type === 'choice') {
    const o = step.options.find(o => o.id === action.value);
    if (!o) return unchanged();
    if (!requirementsMet(p, o.requires)) return unchanged('Sieh dir diese Möglichkeit erst im Raum an.');
    p.answers[step.id] = o.id; p.stepId = o.next; feedback = o.feedback;
  } else if (action.type === 'board' && step.type === 'planning') {
    const layout = placeBoard(p.layout, action.index, action.level);
    if (layout === p.layout) return unchanged();
    p.layout = layout;
  } else if (action.type === 'box' && step.type === 'planning') {
    const result = placeBox(p.layout, action.box, action.slot); p.layout = result.layout; feedback = result.feedback;
  } else if (action.type === 'plan_complete' && step.type === 'planning') {
    if (!layoutReady(p.layout)) return unchanged('Beide Kisten brauchen ein passendes eigenes Fach.');
    p.stepId = step.next;
  } else if (action.type === 'finish' && step.type === 'result') {
    if (!layoutReady(p.layout)) return unchanged('Der Plan ist noch nicht fertig.');
    p.completed = true;
  } else return unchanged();
  return { progress: p, feedback, changed: true };
}
export function nextHint(q: Quest, p: Progress): Progress {
  const s = currentStep(q, p);
  if (p.completed || !s.hints?.length) return p;
  return { ...p, hints: { ...p.hints, [s.id]: Math.min(s.hints.length, (p.hints[s.id] ?? 0) + 1) } };
}
export function validProgress(q: Quest, raw: unknown): raw is Progress {
  if (!raw || typeof raw !== 'object') return false;
  const p = raw as Progress, s = q.steps.find(s => s.id === p.stepId);
  if (!validLayout(p.layout)) return false;
  if (p.revision !== q.revision || !s || typeof p.completed !== 'boolean' || p.completed && (s.type !== 'result' || !layoutReady(p.layout))) return false;
  if (!Array.isArray(p.discovered) || new Set(p.discovered).size !== p.discovered.length || !p.discovered.every(id => q.discoveries.includes(id)) || !validLayout(p.layout)) return false;
  for (const [name, record] of Object.entries({ answers: p.answers, hints: p.hints, attempts: p.attempts })) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
    for (const [id, value] of Object.entries(record)) {
      const step = q.steps.find(s => s.id === id); if (!step) return false;
      if (name !== 'answers' && (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 100000)) return false;
      if (name === 'hints' && Number(value) > (step.hints?.length ?? 0)) return false;
      if (name === 'answers') {
        if (step.type === 'measurement' && !(typeof value === 'number' && Number.isFinite(value) && Math.abs(value - step.expected.value) <= step.expected.tolerance)) return false;
        if (step.type === 'choice' && !step.options.some(o => o.id === value)) return false;
        if (step.type !== 'measurement' && step.type !== 'choice') return false;
      }
    }
  }
  return true;
}
