// Pure quest transitions: no DOM, Phaser, storage or executable content expressions.
export type Option = { id: string; label: string; feedback: string; next: string };
type Common = { id: string; title: string; text: string; objective: string; hints?: string[] };
export type Step = Common & (
  | { type: 'dialogue'; next: string }
  | { type: 'real_world_task'; next: string; stationId: string; mode: 'simulated'; safetyText: string; observation: string }
  | { type: 'measurement'; next: string; unit: string; expected: { value: number; tolerance: number }; retryFeedback: string; successFeedback: string }
  | { type: 'choice'; context?: string; options: Option[] }
  | { type: 'result'; completedText: string; outcomeId: string; careerFields: string[]; reflection: string }
);
export type Quest = { schemaVersion: 1; id: string; revision: number; title: string; roomId: string; npcId: string; startStepId: string; steps: Step[] };
export type Progress = {
  revision: number; stepId: string; completed: boolean;
  answers: Record<string, string | number>; hints: Record<string, number>; attempts: Record<string, number>;
};
export type Action = { stepId: string } & ({ type: 'continue' } | { type: 'answer'; value: string } | { type: 'finish' });
export type Transition = { progress: Progress; feedback: string; changed: boolean };
export const initialProgress = (q: Quest): Progress => ({ revision: q.revision, stepId: q.startStepId, completed: false, answers: {}, hints: {}, attempts: {} });
export function currentStep(q: Quest, p: Progress): Step {
  const step = q.steps.find(s => s.id === p.stepId);
  if (!step) throw Error('Questschritt nicht gefunden');
  return step;
}
export function transition(q: Quest, previous: Progress, action: Action): Transition {
  // Old button events cannot advance a newly rendered step or duplicate completion.
  if (previous.completed || action.stepId !== previous.stepId) return { progress: previous, feedback: '', changed: false };
  const step = currentStep(q, previous);
  const p: Progress = structuredClone(previous);
  const unchanged = () => ({ progress: previous, feedback: '', changed: false });
  let feedback = '';
  if (action.type === 'continue' && (step.type === 'dialogue' || step.type === 'real_world_task')) p.stepId = step.next;
  else if (action.type === 'answer' && step.type === 'measurement') {
    const normalized = action.value.trim().replace(',', '.');
    const value = /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
    p.attempts[step.id] = (p.attempts[step.id] ?? 0) + 1;
    if (!Number.isFinite(value) || value <= 0 || value > 300 || Math.abs(value - step.expected.value) > step.expected.tolerance) feedback = step.retryFeedback;
    else { p.answers[step.id] = value; p.stepId = step.next; feedback = step.successFeedback; }
  } else if (action.type === 'answer' && step.type === 'choice') {
    const option = step.options.find(o => o.id === action.value);
    if (!option) return unchanged();
    p.attempts[step.id] = (p.attempts[step.id] ?? 0) + 1;
    p.answers[step.id] = option.id; p.stepId = option.next; feedback = option.feedback;
  } else if (action.type === 'finish' && step.type === 'result') p.completed = true;
  else return unchanged();
  return { progress: p, feedback, changed: true };
}
export function nextHint(q: Quest, previous: Progress): Progress {
  const step = currentStep(q, previous);
  if (previous.completed || !step.hints?.length) return previous;
  return { ...previous, hints: { ...previous.hints, [step.id]: Math.min(step.hints.length, (previous.hints[step.id] ?? 0) + 1) } };
}
export function validProgress(q: Quest, raw: unknown): raw is Progress {
  if (!raw || typeof raw !== 'object') return false;
  const p = raw as Progress;
  const step = q.steps.find(s => s.id === p.stepId);
  if (p.revision !== q.revision || !step || typeof p.completed !== 'boolean' || (p.completed && step.type !== 'result')) return false;
  for (const [name, record] of Object.entries({ answers: p.answers, hints: p.hints, attempts: p.attempts })) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
    for (const [id, value] of Object.entries(record)) {
      const s = q.steps.find(item => item.id === id);
      if (!s) return false;
      if (name !== 'answers' && (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 100000)) return false;
      if (name === 'hints' && Number(value) > (s.hints?.length ?? 0)) return false;
      if (name === 'answers') {
        if (s.type === 'measurement' && !(typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 300)) return false;
        if (s.type === 'choice' && !s.options.some(o => o.id === value)) return false;
        if (s.type !== 'measurement' && s.type !== 'choice') return false;
      }
    }
  }
  return true;
}
