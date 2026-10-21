import Phaser from 'phaser';
import './style.css';
import { decode, fresh, objects, quest, type Save } from './domain';
import { currentStep, nextHint, requirementsMet, transition, type Action, type Transition } from './quest';
import { BOXES, compartments, HEIGHT, LEVELS, layoutReady, type BoxId } from './planning';
import { Store } from './storage';
import { Room, type Hotspot } from './room';
import words from '../../content/rooms/experience.json';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const talk = $<HTMLDialogElement>('talk'), panel = $<HTMLDialogElement>('panel'), planner = $<HTMLDialogElement>('planner');
const store = new Store();
let state = fresh(), canSave = true, hasSave = false, started = false, room: Room;
let saveQueue = Promise.resolve(), offlineReady = false, offlineText = 'Noch nicht offline bereit', metrics = 'Start …', saveText = 'Lokal bereit';
let toastTimer: ReturnType<typeof setTimeout>, focusBeforeDialog: HTMLElement | null = null;
let measuring = false, planSelection: 'board0' | 'board1' | BoxId = 'board0';
let debugEnabled = new URLSearchParams(location.search).get('debug') === '1';
function say(text: string) {
  $('toast').textContent = text; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 5500);
}
function warn(text: string) { $('notice').hidden = false; $('notice').textContent = text; }
function persist() {
  if (!canSave) return;
  const snapshot = decode(state);
  saveQueue = saveQueue.then(() => store.save(snapshot)).then(() => {
    hasSave = true; saveText = 'Lokal gespeichert'; updateDebug();
  }).catch(() => { saveText = 'Speichern fehlgeschlagen'; warn('Dein Fortschritt konnte nicht gespeichert werden. Lass die Seite offen und prüfe im Menü den Speicherstatus.'); updateDebug(); });
}
try {
  const saved = await store.open(); hasSave = !!saved; if (saved) state = saved;
} catch (error) {
  canSave = false; saveText = error instanceof Error ? error.message : 'Speicher nicht erreichbar';
  warn(`${saveText} Diese Sitzung wird nicht gespeichert. Im Menü kannst du den vorhandenen Stand exportieren.`);
}
$<HTMLButtonElement>('continue').disabled = !hasSave;
$('migration-note').hidden = !state.legacy;
function apply(action: Action): Transition {
  const result = transition(quest, state.quest, action);
  if (result.changed) {
    state.quest = result.progress;
    if (typeof state.quest.answers.measure === 'number') state.width = state.quest.answers.measure;
    room?.refresh(); persist(); updateDebug();
  }
  return result;
}
function paused() { return !started || talk.open || panel.open || planner.open; }
function applySettings() { $('pad').hidden = !started || state.mode !== 'direct'; }
function enterWorld() {
  started = true; $('start').hidden = true; $('hud').hidden = false; $('world-controls').hidden = false;
  applySettings(); persist();
  say(state.quest.completed ? 'Willkommen zurück. Die Kisten sind schon eingeräumt.' : 'Tippe auf einen Ort zum Gehen oder auf eine Person zum Sprechen.');
  document.querySelector('canvas')?.focus();
}
$('continue').onclick = enterWorld;
$('new-game').onclick = async () => {
  if ((hasSave || !canSave) && !confirm('Eine neue Runde beginnen? Der aktuelle Fortschritt dieser Runde wird ersetzt.')) return;
  room?.stop(); await saveQueue;
  try { await store.clear(); canSave = true; $('notice').hidden = true; }
  catch { canSave = false; warn('Ohne lokalen Speicher: Die neue Runde bleibt nur für diese Sitzung.'); }
  state = fresh(); room?.resetPosition();
  openPanel('Deine Figur', body => {
    appendText(body, 'Mit wem möchtest du ins WERK?');
    const group = document.createElement('div'); group.className = 'actions'; body.append(group);
    for (const [id, label] of [['mint', 'Mint'], ['orange', 'Ocker']] as const) {
      const b = addButton(group, label, () => { state.avatar = id; group.querySelectorAll('button').forEach(v => v.setAttribute('aria-pressed', String(v === b))); room?.refresh(); });
      b.setAttribute('aria-pressed', String(state.avatar === id));
    }
    addButton(body, 'Los geht’s', () => { panel.close(); enterWorld(); });
  });
};
function appendText(parent: HTMLElement, text: string, className = '') {
  const p = document.createElement('p'); p.textContent = text; p.className = className; parent.append(p); return p;
}
function addButton(parent: HTMLElement, label: string, action: () => void) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.onclick = action; parent.append(b); return b;
}
function beginModal(d: HTMLDialogElement) {
  room?.stop();
  if (!d.open) { focusBeforeDialog = document.activeElement as HTMLElement; d.showModal(); }
}
function focusFirst(parent: HTMLElement) { parent.querySelector<HTMLElement>('input, button:not([disabled]), select')?.focus(); }
function speak(speaker: string, text: string, choices: { label: string; action: () => void }[], extra?: (body: HTMLElement) => void) {
  beginModal(talk); $('speaker').textContent = speaker; const body = $('talk-body'); body.replaceChildren();
  appendText(body, text); extra?.(body);
  const actions = document.createElement('div'); actions.className = 'actions'; body.append(actions);
  for (const choice of choices) addButton(actions, choice.label, choice.action);
  focusFirst(body);
}
function openPanel(title: string, draw: (body: HTMLElement) => void) {
  if (talk.open) talk.close();
  beginModal(panel); $('panel-title').textContent = title; const body = $('panel-body'); body.replaceChildren(); draw(body); focusFirst(body);
}
for (const d of [talk, panel, planner]) d.addEventListener('close', () => {
  if (focusBeforeDialog?.isConnected) focusBeforeDialog.focus(); else $('menu-button').focus();
});
$('close-talk').onclick = () => talk.close(); $('close-panel').onclick = () => panel.close(); $('close-plan').onclick = () => planner.close();
function feedback(text: string) { speak('JONAS', text, [{ label: 'Alles klar.', action: () => talk.close() }]); }
function askJonas() {
  const step = currentStep(quest, state.quest);
  if (state.quest.completed) {
    speak('JONAS', words.jonas.after, [
      { label: 'Was machen die da eigentlich?', action: () => speak('JONAS', words.jonas.careers, [{ label: 'Ich schau mich noch um.', action: () => talk.close() }]) },
      { label: 'Ich schau mich noch um.', action: () => talk.close() },
    ]); return;
  }
  if (step.id === 'briefing') {
    speak('JONAS', step.text, [
      { label: 'Was brauchst du?', action: () => speak('JONAS', words.jonas.ask, [
        { label: 'Ich schau nach.', action: () => { apply({ type: 'continue', stepId: step.id }); talk.close(); say('Notiert: Ein Regal fürs Fest. Schau nach dem Platz an der Rückwand.'); room.ping('site'); } },
        { label: 'Ich komme gleich wieder.', action: () => talk.close() },
      ]) },
      { label: 'Bis gleich.', action: () => talk.close() },
    ]); return;
  }
  if (step.id === 'report_measure') {
    speak('JONAS', words.jonas.report, [{ label: 'Ich sehe mir die Proben an.', action: () => { apply({ type: 'continue', stepId: step.id }); talk.close(); } }]); return;
  }
  if (step.type === 'choice') {
    if (!requirementsMet(state.quest, step.requires)) {
      speak('JONAS', step.blockedText ?? step.text, [{ label: 'Ich schau mich um.', action: () => talk.close() }, { label: 'Hast du eine Idee?', action: () => showHint(true) }]); return;
    }
    speak('JONAS', step.text, step.options.filter(o => requirementsMet(state.quest, o.requires)).map(o => ({ label: o.label, action: () => {
      const result = apply({ type: 'answer', stepId: step.id, value: o.id }); feedback(result.feedback);
    } }))); return;
  }
  if (step.type === 'planning') { feedback(words.jonas.planning); return; }
  if (step.type === 'result') {
    speak('JONAS', words.jonas.finish, [
      { label: 'Bauen wir’s.', action: () => { const result = apply({ type: 'finish', stepId: step.id }); if (result.changed) { talk.close(); say(step.completedText); } } },
      { label: 'Ich schau noch mal.', action: () => talk.close() },
    ]); return;
  }
  speak('JONAS', step.text, [{ label: 'Ich schau nach.', action: () => { talk.close(); room.ping('site'); } }, { label: 'Hast du eine Idee?', action: () => showHint(true) }]);
}
function showHint(inConversation = false) {
  const step = currentStep(quest, state.quest);
  if (!step.hints?.length) return say('Schau dich um oder sprich mit Jonas.');
  state.quest = nextHint(quest, state.quest); persist();
  const index = Math.max(0, (state.quest.hints[step.id] ?? 1) - 1);
  const text = step.hints[index];
  if (inConversation) feedback(text); else openPanel('Eine Idee', body => {
    appendText(body, text);
    addButton(body, 'Zurück in den Raum', () => panel.close());
    if (index < step.hints!.length - 1) addButton(body, 'Noch ein Hinweis', () => showHint());
  });
}
function inspect(id: string) {
  if (id === 'jonas') return askJonas();
  const object = objects.find(o => o.id === id); if (!object) return;
  if (id === 'site') {
    if (state.quest.completed) return speak('AM REGAL', words.notebook.finished, [{ label: 'Weiter umsehen', action: () => talk.close() }]);
    const step = currentStep(quest, state.quest);
    if (step.id === 'observe') { apply({ type: 'observe', objectId: 'site' }); apply({ type: 'continue', stepId: step.id }); }
    if (currentStep(quest, state.quest).id === 'measure') {
      measuring = true; room.setMeasuring(true); say(words.site.start); return;
    }
    return speak('AM PLATZ', state.quest.stepId === 'briefing' ? words.site.before : words.site.measured, [{ label: 'Weiter umsehen', action: () => talk.close() }]);
  }
  if (id === 'bench' && currentStep(quest, state.quest).type === 'planning') return openPlanner();
  apply({ type: 'observe', objectId: id });
  const choices = [{ label: 'Weiter umsehen', action: () => talk.close() }];
  if (object.detail) choices.push({ label: 'Mehr erfahren', action: () => speak(object.label.toLocaleUpperCase('de-DE'), object.detail, [{ label: 'Zurück', action: () => inspect(id) }]) });
  speak(object.label.toLocaleUpperCase('de-DE'), object.description, choices);
}
function endpoint(id: string) {
  if (!measuring || currentStep(quest, state.quest).id !== 'measure' || paused()) return;
  if (id === 'measure_end' && !state.quest.discovered.includes('measure_start')) return say(words.site.endFirst);
  apply({ type: 'observe', objectId: id });
  if (id === 'measure_start') say('Anfang sitzt. Jetzt das rechte Ende.'); else measurementInput();
}
function measurementInput() {
  const step = currentStep(quest, state.quest); if (step.type !== 'measurement') return;
  speak('AM MASSBAND', words.site.prompt, [], body => {
    const form = document.createElement('form');
    const label = document.createElement('label'); label.textContent = 'Dein Maß in cm'; label.htmlFor = 'width';
    const input = document.createElement('input'); input.id = 'width'; input.inputMode = 'decimal'; input.autocomplete = 'off'; input.maxLength = 10;
    const submit = document.createElement('button'); submit.type = 'submit'; submit.textContent = 'Maß mitnehmen';
    form.append(label, input, submit); body.append(form);
    form.onsubmit = e => {
      e.preventDefault(); const result = apply({ type: 'answer', stepId: step.id, value: input.value });
      if (state.quest.stepId !== 'measure') {
        measuring = false; room.setMeasuring(false); talk.close(); say(words.site.measured);
      } else speak('AM MASSBAND', result.feedback || step.retryFeedback, [
        { label: 'Noch mal eingeben', action: measurementInput }, { label: 'Noch mal hinschauen', action: () => talk.close() },
      ]);
    };
  });
}
function notes() {
  openPanel('Notizen', body => {
    appendText(body, 'Ein Regal fürs Fest');
    const step = currentStep(quest, state.quest);
    let text = state.quest.completed ? words.notebook.finished : step.objective;
    if (step.id === 'material' && requirementsMet(state.quest, step.requires)) text = words.notebook.materialsReady;
    if (step.id === 'process' && requirementsMet(state.quest, step.requires)) text = words.notebook.processReady;
    appendText(body, text);
    const known = objects.filter(o => state.quest.discovered.includes(o.id));
    if (known.length) {
      const details = document.createElement('details'), summary = document.createElement('summary'); summary.textContent = 'Was ich gesehen habe'; details.append(summary);
      for (const o of known) appendText(details, `${o.label}: ${o.description}`); body.append(details);
    }
    if (typeof state.quest.answers.measure === 'number') appendText(body, `Platz an der Wand: ${state.quest.answers.measure} cm`);
    addButton(body, 'Eine Idee?', () => showHint());
    addButton(body, 'Wo ist Jonas?', () => { panel.close(); room.ping('jonas'); });
    if (state.help === 'more' && step.hints?.length && !state.quest.completed) appendText(body, step.hints[0], 'secondary');
  });
}
$('notebook-button').onclick = notes;
function selectSetting(body: HTMLElement, id: string, label: string, choices: [string, string][], value: string, change: (v: string) => void) {
  const l = document.createElement('label'); l.textContent = label; l.htmlFor = id;
  const s = document.createElement('select'); s.id = id;
  for (const [v, text] of choices) { const o = document.createElement('option'); o.value = v; o.textContent = text; s.append(o); }
  s.value = value; s.onchange = () => { change(s.value); applySettings(); room?.stop(); room?.refresh(); if (started) persist(); };
  l.append(s); body.append(l);
}
function settingsPanel() {
  openPanel('Einstellungen & Zugänglichkeit', body => {
    selectSetting(body, 'mode', 'Bewegung', [['tap', 'Auf den Boden tippen'], ['direct', 'Richtungstasten halten']], state.mode, v => { state.mode = v === 'direct' ? 'direct' : 'tap'; });
    selectSetting(body, 'help', 'Hinweise', [['normal', 'Wenn ich danach frage'], ['more', 'Erste Ideen in meinen Notizen zeigen']], state.help, v => { state.help = v === 'more' ? 'more' : 'normal'; });
    selectSetting(body, 'text-size', 'Schrift', [['normal', 'Normal'], ['large', 'Größer']], document.documentElement.dataset.textSize ?? 'normal', v => { document.documentElement.dataset.textSize = v; localStorageSafe('werk-text', v); });
    appendText(body, 'Die Einstellung für reduzierte Bewegung deines Geräts wird übernommen.', 'secondary');
  });
}
function localStorageSafe(key: string, value?: string) {
  try { if (value !== undefined) localStorage.setItem(key, value); return localStorage.getItem(key); } catch { return null; }
}
document.documentElement.dataset.textSize = localStorageSafe('werk-text') ?? 'normal';
$('start-settings').onclick = settingsPanel;
function menu() {
  openPanel('Pause', body => {
    addButton(body, 'Weiter im Raum', () => panel.close());
    addButton(body, 'Einstellungen & Zugänglichkeit', settingsPanel);
    addButton(body, 'Orte und Dinge', () => openPanel('Orte und Dinge', parent => {
      appendText(parent, 'Wähle einen Ort. Deine Figur geht hin und untersucht ihn.');
      const list = document.createElement('div'); list.className = 'object-list'; parent.append(list);
      for (const o of objects.filter(o => !(o.id === 'crates' && state.quest.completed))) addButton(list, o.label, () => { panel.close(); room.visit(o.id); });
    }));
    addButton(body, 'Ansicht näher', () => room.zoom(.2)); addButton(body, 'Ansicht weiter', () => room.zoom(-.2));
    addButton(body, 'Vollbild', async () => {
      try { await $('play').requestFullscreen(); panel.close(); } catch { appendText(body, 'Dein Browser bleibt in der Fensteransicht. Du kannst trotzdem weiterspielen.'); }
    });
    appendText(body, `${saveText} · ${offlineText}`, 'secondary');
    if (debugEnabled) addButton(body, 'Developer UI', debugPanel);
    addButton(body, 'Spielstand exportieren', () => void exportState());
    addButton(body, 'Zum Start', () => { panel.close(); started = false; room.stop(); $('start').hidden = false; $('hud').hidden = true; $('world-controls').hidden = true; $<HTMLButtonElement>('continue').disabled = !hasSave; applySettings(); });
  });
}
$('menu-button').onclick = menu;
async function exportState(previous = false) {
  let raw: unknown; try { raw = previous ? await store.backup() : await store.raw(); } catch { raw = null; }
  const data = previous ? raw : { phase: '2B', state, stored: raw, offlineReady, saveText, metrics, userAgent: navigator.userAgent };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = previous ? 'werk-vorheriger-teststand.json' : 'werk-2b-testbericht.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function updateDebug() {
  const pre = $('debug-state'); if (pre) pre.textContent = JSON.stringify({ step: state.quest.stepId, metrics, saveText, offlineText, state }, null, 2);
}
function debugPanel() {
  openPanel('Developer UI · ausdrücklich Testmodus', body => {
    selectSetting(body, 'mode', 'Bewegungsvariante', [['tap', 'A · Tap-to-Move'], ['direct', 'B · Direkt']], state.mode, v => { state.mode = v === 'direct' ? 'direct' : 'tap'; });
    selectSetting(body, 'avatar', 'Avatarpreset', [['mint', 'Mint'], ['orange', 'Ocker']], state.avatar, v => { state.avatar = v === 'orange' ? 'orange' : 'mint'; });
    selectSetting(body, 'help', 'Unterstützung', [['normal', 'Auf Anfrage'], ['more', 'Mehr Hinweise']], state.help, v => { state.help = v === 'more' ? 'more' : 'normal'; });
    const pre = document.createElement('pre'); pre.id = 'debug-state'; body.append(pre); updateDebug();
    addButton(body, 'Testbericht herunterladen', () => void exportState());
    addButton(body, 'Vorherigen Teststand exportieren', () => void exportState(true));
    addButton(body, 'Neue Runde', () => { panel.close(); $('new-game').click(); });
    addButton(body, 'Debug-Modus verlassen', () => { debugEnabled = false; panel.close(); });
  });
}
// One spatial puzzle: select a component, then a height or compartment.
function openPlanner() {
  beginModal(planner); renderPlan();
}
function renderPlan(focusId?: string) {
  const layout = state.quest.layout, board = $('blueprint'), parts = $('plan-parts'); board.replaceChildren(); parts.replaceChildren();
  $('plan-instruction').textContent = planSelection.startsWith('board') ? 'Wähle eine Höhe für den markierten Boden.' : 'Wähle ein Fach für die markierte Kiste.';
  for (const [id, label] of [['board0', 'Boden A'], ['board1', 'Boden B'], ['small', `${BOXES.small.label} · ${BOXES.small.height} cm`], ['tall', `${BOXES.tall.label} · ${BOXES.tall.height} cm`]] as const) {
    const b = addButton(parts, label, () => { planSelection = id; renderPlan(`part-${id}`); }); b.id = `part-${id}`; b.setAttribute('aria-pressed', String(planSelection === id));
  }
  for (const level of LEVELS) {
    const b = addButton(board, `${level}`, () => {
      if (!planSelection.startsWith('board')) { $('plan-feedback').textContent = 'Wähle zum Versetzen zuerst Boden A oder B.'; return; }
      apply({ type: 'board', stepId: state.quest.stepId, index: planSelection === 'board0' ? 0 : 1, level });
      $('plan-feedback').textContent = 'Boden versetzt. Probiere danach beide Kisten aus.'; renderPlan(`level-${level}`);
    });
    b.id = `level-${level}`; b.className = 'height-target'; b.style.bottom = `${level / HEIGHT * 100}%`; b.setAttribute('aria-label', `Boden auf ${level} cm setzen`);
  }
  for (const level of layout.boards) if (level !== null) { const line = document.createElement('div'); line.className = 'plan-board'; line.style.bottom = `${level / HEIGHT * 100}%`; board.append(line); }
  const gaps = compartments(layout);
  if (gaps) {
    let bottom = 0;
    for (let i = 0; i < 3; i++) {
      const b = addButton(board, ['Unten', 'Mitte', 'Oben'][i], () => {
        if (planSelection !== 'small' && planSelection !== 'tall') { $('plan-feedback').textContent = 'Wähle zuerst eine Kiste.'; return; }
        const result = apply({ type: 'box', stepId: state.quest.stepId, box: planSelection, slot: i }); $('plan-feedback').textContent = result.feedback;
        renderPlan(`gap-${i}`);
      });
      b.id = `gap-${i}`; b.className = 'gap-target'; b.style.bottom = `${bottom / HEIGHT * 100}%`; b.style.height = `${gaps[i] / HEIGHT * 100}%`;
      b.setAttribute('aria-label', `Kiste ins ${['untere', 'mittlere', 'obere'][i]} Fach stellen`); bottom += gaps[i];
    }
    for (const box of ['small', 'tall'] as BoxId[]) {
      const slot = layout.boxes[box]; if (slot === null) continue;
      const bottom = gaps.slice(0, slot).reduce((sum, n) => sum + n, 0);
      const crate = document.createElement('div'); crate.className = 'plan-crate'; crate.style.bottom = `${bottom / HEIGHT * 100}%`; crate.style.height = `${BOXES[box].height / HEIGHT * 100}%`; crate.textContent = box === 'small' ? 'Klein' : 'Hoch'; board.append(crate);
    }
  }
  $<HTMLButtonElement>('confirm-plan').disabled = !layoutReady(layout);
  if (focusId) $(focusId)?.focus(); else $('part-board0').focus();
}
$('confirm-plan').onclick = () => {
  const result = apply({ type: 'plan_complete', stepId: state.quest.stepId });
  if (result.changed) { planner.close(); say('Der Plan passt. Zeig ihn Jonas.'); } else $('plan-feedback').textContent = result.feedback;
};
const hotspotButtons = new Map<string, HTMLButtonElement>();
function hotspots(points: Hotspot[]) {
  const active = new Set(points.map(p => p.id));
  for (const [id, b] of hotspotButtons) if (!active.has(id)) { b.remove(); hotspotButtons.delete(id); }
  for (const p of points) {
    let b = hotspotButtons.get(p.id);
    if (!b) {
      b = document.createElement('button'); b.className = 'world-hotspot'; b.dataset.object = p.id;
      if (p.id.startsWith('measure_')) { b.classList.add('measure-point'); b.textContent = p.id === 'measure_start' ? '1' : '2'; }
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = p.label; b.append(tag);
      b.setAttribute('aria-label', p.id === 'jonas' ? 'Mit Jonas sprechen' : p.label);
      b.onclick = () => { if (p.id.startsWith('measure_')) endpoint(p.id); else if (started && !paused()) room.visit(p.id); };
      hotspotButtons.set(p.id, b); $('world-controls').append(b);
    }
    b.style.left = `${p.x}px`; b.style.top = `${p.y}px`;
    b.hidden = !started || p.x < 10 || p.x > innerWidth - 10 || p.y < 10 || p.y > innerHeight - 10;
  }
}
$('world-controls').hidden = true;
room = new Room({ state: () => state, paused, interact: inspect, say, hotspots,
  moved: cell => {
    state.cell = { ...cell }; persist();
    const site = objects.find(o => o.id === 'site')!;
    if (measuring && Math.abs(cell.x - site.x) + Math.abs(cell.y - site.y) > 2) { measuring = false; room.setMeasuring(false); }
  },
  metrics: text => { metrics = text; updateDebug(); },
  ready: () => { performance.mark('werk-ready'); document.body.dataset.ready = 'true'; },
});
new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: innerWidth, height: innerHeight, backgroundColor: '#19232b', pixelArt: true, roundPixels: true, scale: { mode: Phaser.Scale.RESIZE }, scene: room });
const keymap: Record<string, string> = { ArrowUp: 'up', w: 'up', ArrowRight: 'right', d: 'right', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left' };
window.addEventListener('keydown', e => {
  if (e.key === 'F2') { e.preventDefault(); debugEnabled = true; debugPanel(); return; }
  if (e.key === 'Escape' && !paused()) { menu(); return; }
  if (paused() || ['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
  if (keymap[e.key]) { e.preventDefault(); room.direct(keymap[e.key]); }
  if ((e.key.toLowerCase() === 'e' || e.key === 'Enter') && (e.target as HTMLElement)?.tagName !== 'BUTTON') room.nearby();
});
window.addEventListener('keyup', e => { if (keymap[e.key]) room?.direct(null); });
window.addEventListener('blur', () => room?.stop()); document.addEventListener('visibilitychange', () => room?.stop());
for (const b of document.querySelectorAll<HTMLButtonElement>('[data-dir]')) {
  b.onpointerdown = e => { e.preventDefault(); if (paused()) return; b.setPointerCapture(e.pointerId); room.direct(b.dataset.dir!); };
  b.onpointerup = b.onpointercancel = b.onlostpointercapture = () => room?.direct(null);
}
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    const refresh = () => {
      const active = registration.active; if (!active) return;
      const c = new MessageChannel(); c.port1.onmessage = e => { offlineReady = e.data.ready === true; offlineText = offlineReady ? 'Offline bereit' : 'Offlinepaket unvollständig'; updateDebug(); }; active.postMessage('status', [c.port2]);
    };
    await navigator.serviceWorker.ready; refresh();
    const waiting = () => { if (registration.waiting) { offlineText = 'Update bereit – nach der Runde alle Spieltabs schließen'; updateDebug(); } };
    waiting(); registration.addEventListener('updatefound', () => { const w = registration.installing; w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) waiting(); else refresh(); }); });
  } catch { offlineText = 'Offlinepaket nicht verfügbar'; }
}
