import Phaser from 'phaser';
import './style.css';
import { decode, fresh, objects, quest, type Cell } from './domain';
import { currentStep, nextHint, transition, type Action, type Step } from './quest';
import { Store } from './storage';
import { Room } from './room';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const dialog = $<HTMLDialogElement>('dialog');
const store = new Store();
let state = fresh(), canSave = true, saveQueue = Promise.resolve(), offlineReady = false;
let room: Room;
let lastFocus: HTMLElement | null = null;
const say = (text: string) => { $('message').textContent = text; };
function persist() {
  if (!canSave) return;
  const snapshot = decode(state);
  saveQueue = saveQueue.then(() => store.save(snapshot)).then(() => {
    $('save-status').textContent = 'Fortschritt lokal gespeichert';
  }).catch(() => { $('save-status').textContent = 'Speichern fehlgeschlagen. Vor dem Schließen erneut prüfen.'; });
}
try {
  state = await store.open() ?? fresh();
  $('save-status').textContent = 'Lokaler Speicher bereit';
} catch (error) {
  canSave = false;
  $('save-status').textContent = `Ohne Speicherung: ${error instanceof Error ? error.message : 'Speicherzugriff fehlgeschlagen'}`;
}
function settings() {
  $<HTMLSelectElement>('mode').value = state.mode;
  $<HTMLSelectElement>('avatar').value = state.avatar;
  $<HTMLSelectElement>('help').value = state.help;
  $('pad').hidden = state.mode !== 'direct';
  $('instruction').textContent = state.mode === 'tap'
    ? 'A: Tippe auf ein freies Feld oder auf ein Objekt. Beide Steuerungen sind weiterhin vorläufig.'
    : 'B: Halte eine schräge Richtungstaste gedrückt. Tippe Objekte zum Untersuchen an.';
}
function updateLog() {
  const step = currentStep(quest, state.quest);
  const index = quest.steps.findIndex(s => s.id === step.id);
  $('quest-title').textContent = quest.title;
  $('quest-progress').textContent = state.quest.completed ? 'Auftrag abgeschlossen' : `Schritt ${index + 1} von ${quest.steps.length}`;
  $<HTMLProgressElement>('progress').max = quest.steps.length;
  $<HTMLProgressElement>('progress').value = state.quest.completed ? quest.steps.length : index;
  $('step-title').textContent = step.title;
  $('objective').textContent = state.quest.completed ? 'Entdecke weitere Dinge im Raum oder starte eine neue Runde.' : step.objective;
  $('resume').textContent = state.quest.completed ? 'Ergebnis ansehen' : index === 0 ? 'Mit Jonas sprechen' : 'Auftrag fortsetzen';
  $('outcome').textContent = state.quest.completed && step.type === 'result' ? step.completedText : '';
  room?.refresh();
}
const body = () => $('dialog-body');
function paragraph(text: string, className = '') {
  const p = document.createElement('p'); p.textContent = text; p.className = className; body().append(p); return p;
}
function button(text: string, run: () => void) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.onclick = run; body().append(b); return b;
}
function beginDialog(title: string, speaker = 'JONAS') {
  room?.stop();
  if (!dialog.open) { lastFocus = document.activeElement as HTMLElement; dialog.showModal(); }
  $('dialog-title').textContent = title; $('speaker').textContent = speaker; body().replaceChildren();
}
function focusContent() {
  const target = body().querySelector<HTMLElement>('input:not([disabled]), button:not([disabled])');
  (target ?? $('close-dialog')).focus();
}
function hintSection(step: Step) {
  if (!step.hints || state.quest.completed) return;
  const shown = Math.max(state.quest.hints[step.id] ?? 0, state.help === 'more' ? 1 : 0);
  const section = document.createElement('section'); section.className = 'hints';
  const title = document.createElement('h3'); title.textContent = 'Hinweise – ohne Punktabzug'; section.append(title);
  for (const text of step.hints.slice(0, shown)) {
    const p = document.createElement('p'); p.textContent = text; section.append(p);
  }
  const b = document.createElement('button'); b.type = 'button';
  b.textContent = shown === 0 ? 'Ersten Hinweis zeigen' : shown < step.hints.length ? 'Nächsten Hinweis zeigen' : 'Alle Hinweise angezeigt';
  b.disabled = shown >= step.hints.length;
  b.onclick = () => {
    state.quest = { ...state.quest, hints: { ...state.quest.hints, [step.id]: shown } };
    state.quest = nextHint(quest, state.quest); persist(); renderQuest();
  };
  section.append(b); body().append(section);
}
function act(action: Action) {
  const result = transition(quest, state.quest, action);
  if (!result.changed) return;
  state.quest = result.progress;
  if (action.type === 'answer' && typeof state.quest.answers[action.stepId] === 'number') state.width = Number(state.quest.answers[action.stepId]);
  persist(); updateLog();
  if (result.feedback) {
    beginDialog('Jonas zu deiner Entscheidung');
    paragraph(result.feedback);
    if ((state.quest.attempts[action.stepId] ?? 0) >= 2 && state.quest.stepId === action.stepId) paragraph('Wenn du magst, nutze die Hinweise. Du kannst jederzeit ohne Nachteil weiterprobieren.');
    button('Weiter', renderQuest); focusContent();
  } else renderQuest();
}
function renderQuest() {
  const step = currentStep(quest, state.quest);
  beginDialog(step.title);
  paragraph(state.quest.completed && step.type === 'result' ? step.completedText : step.text);
  if (step.type === 'dialogue') button('Ich helfe mit', () => act({ type: 'continue', stepId: step.id }));
  if (step.type === 'real_world_task') {
    paragraph(step.safetyText, 'notice');
    const reveal = button('Messkarte ansehen', () => {
      reveal.disabled = true;
      // The card is a deliberate simulated observation, not a claim of real-world presence.
      paragraph(step.observation, 'observation');
      button('Breite gemerkt – zum Eingabeschritt', () => act({ type: 'continue', stepId: step.id }));
      focusContent();
    });
  }
  if (step.type === 'measurement') {
    const reveal = button('Messkarte erneut ansehen', () => {
      reveal.disabled = true;
      const observation = quest.steps.find(s => s.type === 'real_world_task');
      if (observation?.type === 'real_world_task') paragraph(observation.observation, 'observation');
    });
    const form = document.createElement('form');
    const label = document.createElement('label'); label.htmlFor = 'width'; label.textContent = `Breite in ${step.unit}`;
    const input = document.createElement('input'); input.id = 'width'; input.inputMode = 'decimal'; input.type = 'text'; input.maxLength = 12; input.autocomplete = 'off';
    input.setAttribute('aria-describedby', 'measure-help');
    const help = document.createElement('p'); help.id = 'measure-help'; help.textContent = 'Komma oder Punkt ist möglich. Die Eingabe ist kein Geschwindigkeitstest.';
    const submit = document.createElement('button'); submit.type = 'submit'; submit.textContent = 'Maß prüfen';
    form.append(label, input, help, submit); body().append(form);
    form.onsubmit = event => { event.preventDefault(); act({ type: 'answer', stepId: step.id, value: input.value }); };
  }
  if (step.type === 'choice') {
    if (step.context) paragraph(step.context, 'notice');
    const choices = document.createElement('div'); choices.className = 'choices'; body().append(choices);
    for (const option of step.options) {
      const b = document.createElement('button'); b.textContent = option.label; b.type = 'button';
      b.onclick = () => act({ type: 'answer', stepId: step.id, value: option.id }); choices.append(b);
    }
  }
  if (step.type === 'result') {
    if (!state.quest.completed) button('Regal virtuell fertigstellen', () => act({ type: 'finish', stepId: step.id }));
    else {
      paragraph('Dein Ergebnis im Raum bleibt nach dem Neuladen erhalten.', 'observation');
      const answers = Object.entries(state.quest.answers).map(([id, value]) => {
        const s = quest.steps.find(item => item.id === id);
        return s?.type === 'choice' ? s.options.find(o => o.id === value)?.label ?? String(value) : `${value} cm`;
      });
      paragraph(`Dein Plan: ${answers.join(' · ')}`);
      paragraph(`Diese Tätigkeiten begegnen dir unter anderem in: ${step.careerFields.join(', ')}.`);
      paragraph(step.reflection);
      button('Zurück in den Raum', () => dialog.close());
    }
  }
  hintSection(step); focusContent();
}
function inspect(id: string) {
  if (id === 'jonas') return renderQuest();
  const object = objects.find(o => o.id === id);
  if (!object) return;
  beginDialog(object.label, 'ENTDECKEN'); paragraph(object.description);
  if (id === 'shelf' && state.quest.completed) {
    const result = currentStep(quest, state.quest);
    if (result.type === 'result') paragraph(result.completedText, 'observation');
  }
  button('Zurück in den Raum', () => dialog.close());
  button('Auftrag fortsetzen', renderQuest); focusContent();
}
$('resume').onclick = renderQuest;
$('close-dialog').onclick = () => dialog.close();
dialog.addEventListener('close', () => { (lastFocus?.isConnected ? lastFocus : $('resume')).focus(); });
for (const id of ['mode', 'avatar', 'help'] as const) {
  $(id).onchange = () => {
    if (id === 'mode') state.mode = $<HTMLSelectElement>(id).value === 'direct' ? 'direct' : 'tap';
    if (id === 'avatar') state.avatar = $<HTMLSelectElement>(id).value === 'orange' ? 'orange' : 'mint';
    if (id === 'help') state.help = $<HTMLSelectElement>(id).value === 'more' ? 'more' : 'normal';
    room?.stop(); settings(); updateLog(); persist();
  };
}
$('reset').onclick = async () => {
  if (!confirm('Diese Runde mit Avatar, Antworten und Fortschritt wirklich zurücksetzen?')) return;
  room?.stop(); await saveQueue;
  try { await store.clear(); state = fresh(); canSave = true; room?.resetPosition(); settings(); updateLog(); persist(); say('Neue Runde bereit. Sprich mit Jonas.'); }
  catch { say('Zurücksetzen fehlgeschlagen. Der bisherige Stand ist nicht als gelöscht bestätigt.'); }
};
for (const b of document.querySelectorAll<HTMLButtonElement>('[data-dir]')) {
  b.onpointerdown = e => { e.preventDefault(); if (dialog.open) return; b.setPointerCapture(e.pointerId); room?.direct(b.dataset.dir!); };
  b.onpointerup = b.onpointercancel = b.onlostpointercapture = () => room?.direct(null);
}
const keymap: Record<string, string> = { ArrowUp: 'up', w: 'up', ArrowRight: 'right', d: 'right', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left' };
window.addEventListener('keydown', e => {
  if (dialog.open || ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement)?.tagName)) return;
  if (keymap[e.key]) { e.preventDefault(); room?.direct(keymap[e.key]); }
  if (e.key.toLowerCase() === 'e') renderQuest();
});
window.addEventListener('keyup', e => { if (keymap[e.key]) room?.direct(null); });
window.addEventListener('blur', () => room?.stop());
document.addEventListener('visibilitychange', () => room?.stop());
for (const object of objects) {
  const b = document.createElement('button'); b.textContent = object.label;
  // Direct HTML access intentionally does not require steering skill.
  b.onclick = () => room?.visit(object.id); $('objects').append(b);
}
settings(); updateLog();
room = new Room({ state: () => state, paused: () => dialog.open,
  moved: p => { state.cell = { ...p }; persist(); }, interact: inspect, say,
  metrics: text => { $('metrics').textContent = text; },
  position: (p: Cell) => { $('position').textContent = `${p.x}, ${p.y}`; },
  ready: () => { performance.mark('werk-ready'); say('Raum bereit. Sprich mit Jonas oder starte über den Auftrag.'); },
});
new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: 800, height: 440, backgroundColor: '#222e38', pixelArt: true, roundPixels: true, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: room });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    const refresh = () => {
      const active = registration.active;
      if (!active) return;
      const channel = new MessageChannel();
      channel.port1.onmessage = e => { offlineReady = e.data.ready === true; $('offline-status').textContent = offlineReady ? 'Offlinepaket vollständig' : 'Offlinepaket unvollständig'; };
      active.postMessage('status', [channel.port2]);
    };
    await navigator.serviceWorker.ready; refresh();
    const waiting = () => { if (registration.waiting) $('offline-status').textContent = 'Update bereit. Nach dieser Runde alle Spieltabs schließen und erneut öffnen.'; };
    waiting();
    registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) waiting(); else refresh(); }); });
  } catch { $('offline-status').textContent = 'Offlineinstallation fehlgeschlagen. HTTPS und Speicher prüfen.'; }
}
$('export').onclick = () => {
  const report = { phase: 2, date: new Date().toISOString(), userAgent: navigator.userAgent, offlineReady, state, metrics: $('metrics').textContent, saveStatus: $('save-status').textContent, note: 'Lokaler Bericht. Keine reale iPad-Abnahme.' };
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'werk-phase2-test.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
