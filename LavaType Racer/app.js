/* LavaType Racer - app.js
   Vanilla JS single-page typing race game with:
   - Human player vs configurable bots (High/Medium/Low difficulty)
   - Real-time WPM, accuracy, position, minimap
   - 2.5D track animations, lava background
   - On-screen keyboard (mobile/desktop), key highlights
   - Countdown, sound, vibration
   - LocalStorage persistence (settings, leaderboard, history)
   - Accessibility (ARIA live regions, keyboard navigation, high contrast, large fonts)
   No frameworks, no external assets.
*/

/* -------------------------
   Global State / Constants
------------------------- */
const q = s => document.querySelector(s);
const qa = s => Array.from(document.querySelectorAll(s));

const SCREENS = {
  LOBBY: 'screen-lobby',
  RACE: 'screen-race',
  RESULTS: 'screen-results',
};

const STORAGE_KEYS = {
  SETTINGS: 'ltr_settings_v1',
  HISTORY: 'ltr_history_v1',
  LEADERBOARD: 'ltr_leaderboard_v1',
  BEST: 'ltr_best_v1'
};

const DEFAULT_SETTINGS = {
  playerName: 'You',
  theme: 'dark',
  highContrast: false,
  largeFont: false,
  sound: true,
  showKB: 'auto', // auto | on | off
  sentenceLength: 'medium',
  botCount: 3,
  bots: [] // filled dynamically
};

const DIFFICULTY_PRESETS = {
  High: {
    wpmMean: 65, wpmStd: 8, errRate: 0.02, correctionDelayMs: [80, 180], microPause: [0.05, 180, 280],
  },
  Medium: {
    wpmMean: 45, wpmStd: 7, errRate: 0.035, correctionDelayMs: [120, 240], microPause: [0.08, 180, 350],
  },
  Low: {
    wpmMean: 28, wpmStd: 6, errRate: 0.06, correctionDelayMs: [160, 320], microPause: [0.11, 240, 420],
  },
};

const COLORS = ['#7cf8a9','#ffd166','#ff5a7a','#70d6ff','#d086ff','#ffb86b','#9ae66e','#ffa6c1'];

/* -------------------------
   Utility helpers
------------------------- */
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const lerp = (a, b, t) => a + (b - a) * t;
const msNow = () => performance.now();

function formatTime(ms) {
  if (!isFinite(ms) || ms <= 0) return '0.0s';
  const s = ms / 1000;
  if (s >= 60) {
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toFixed(1).padStart(4,'0')}`;
  }
  return `${s.toFixed(1)}s`;
}

function randRange(a, b) {
  return a + Math.random() * (b - a);
}

// Approx normal using Box-Muller
function randNormal(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * std;
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* -------------------------
   Sentences generator
------------------------- */
const WORDS = `
time year people way day man thing child world school state family student group country problem hand part place case week company system program question work night point home water room mother area money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force education foot boy age policy process music market sense service race table window phone science winter summer spring fall ocean river green blue red yellow purple quick brown fox jumps over the lazy dog hello type fast practice build focus calm gentle breeze lava fire molten glow crackle ignite base core
`.trim().split(/\s+/);

function generateSentence(kind='medium') {
  let targetChars = 55;
  if (kind === 'short') targetChars = 30;
  if (kind === 'long') targetChars = 100;

  const words = [];
  let len = 0;
  while (len < targetChars) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    words.push(w);
    len += w.length + 1;
  }
  // Add a punctuation at end occasionally
  const punct = Math.random() < 0.5 ? '.' : '!';
  let s = words.join(' ');
  s = s.charAt(0).toLowerCase() + s.slice(1);
  s = s.slice(0, targetChars + Math.floor(Math.random()*10));
  if (/[a-zA-Z]$/.test(s)) s += punct;
  return s;
}

/* -------------------------
   Audio (WebAudio)
------------------------- */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
  }
}
function beep({freq=600, duration=120, volume=0.05, type='sine'}={}) {
  if (!state.settings.sound) return;
  ensureAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration/1000);
  osc.stop(now + duration/1000 + 0.05);
}

/* -------------------------
   Bot AI
------------------------- */
/**
 * Bot simulates human typing:
 * - Chooses a per-race WPM around difficulty mean (normal distribution)
 * - Types characters with dt accumulation
 * - Makes mistakes with given error rate; when in error, pauses then backspaces to last correct index
 * - Micro-pauses occasionally
 */
class Bot {
  constructor({name, color, difficulty, target}) {
    this.name = name;
    this.color = color;
    this.diff = difficulty;
    this.target = target;
    const preset = DIFFICULTY_PRESETS[difficulty];
    this.wpmBase = Math.max(10, randNormal(preset.wpmMean, preset.wpmStd));
    this.charPerSec = (this.wpmBase * 5) / 60;
    this.errRate = preset.errRate;
    this.correctionDelayMs = preset.correctionDelayMs;
    this.microPause = preset.microPause; // [prob, min, max]
    this.correctIndex = 0;
    this.typedIndex = 0;
    this.mistakes = 0;
    this._accum = 0;
    this._inError = false;
    this._pauseUntil = 0; // ms timestamp
    this.finished = false;
    this.finishTime = null;
    this.place = null;
    this.timeToNextKey = 0;
  }

  update(dtMs, nowMs) {
    if (this.finished) return;

    // Micro-pause
    if (nowMs < this._pauseUntil) return;

    // Random short pause to feel human
    if (Math.random() < this.microPause[0] * dtMs/1000) {
      this._pauseUntil = nowMs + randRange(this.microPause[1], this.microPause[2]);
      return;
    }

    const cps = this.charPerSec * lerp(0.9, 1.1, Math.random()); // slight jitter
    this._accum += cps * (dtMs / 1000);

    while (this._accum >= 1) {
      this._accum -= 1;

      if (this._inError) {
        // backspace towards correctIndex
        this.typedIndex--;
        if (this.typedIndex <= this.correctIndex) {
          this._inError = false;
        }
        // small delay after backspace
        this._pauseUntil = nowMs + randRange(this.correctionDelayMs[0], this.correctionDelayMs[1]);
        break;
      } else {
        // decide if type correct or wrong
        const willError = Math.random() < this.errRate;
        if (willError) {
          this.mistakes++;
          this.typedIndex++;
          // enter error state: pause then correct
          this._inError = true;
          this._pauseUntil = nowMs + randRange(this.correctionDelayMs[0], this.correctionDelayMs[1]);
          break;
        } else {
          this.typedIndex++;
          this.correctIndex++; // progress advances only with correct chars
          if (this.correctIndex >= this.target.length) {
            this.correctIndex = this.target.length;
            this.finished = true;
            break;
          }
        }
      }
    }
  }

  progress() {
    return this.correctIndex / this.target.length;
  }
}

/* -------------------------
   Player typing model
------------------------- */
class Player {
  constructor(name, color, target) {
    this.name = name || 'You';
    this.color = color;
    this.target = target;
    this.correctIndex = 0;
    this.typedIndex = 0;
    this.mistakes = 0;
    this.wrongStreak = 0;
    this.keypresses = 0;
    this.historyMistakes = []; // {i, t}
    this.finished = false;
    this.finishTime = null;
    this.place = null;
    this.startTime = null;
  }

  handleKeyInput(k, t) {
    if (this.finished) return;

    if (k === 'Backspace') {
      // Allow backspacing only within the mistake region (typedIndex > correctIndex)
      if (this.typedIndex > this.correctIndex) {
        this.typedIndex--;
        this.wrongStreak = Math.max(0, this.wrongStreak - 1);
      }
      return;
    }

    if (k.length !== 1) return; // ignore non-printable besides backspace

    // Accept normal characters
    this.keypresses++;

    const expected = this.target[this.typedIndex] || '';
    if (this.typedIndex === this.correctIndex && k === expected) {
      // correct next char, progress
      this.correctIndex++;
      this.typedIndex++;
      this.wrongStreak = 0;
      // optional word-completion feedback
      if (expected === ' ' || this.correctIndex === this.target.length) {
        vibrate(10);
      }
      if (this.correctIndex >= this.target.length) {
        this.correctIndex = this.target.length;
        this.finished = true;
        this.finishTime = t;
      }
    } else {
      // wrong char; increase typedIndex but don't progress
      this.typedIndex++;
      this.mistakes++;
      this.wrongStreak++;
      this.historyMistakes.push({ i: this.typedIndex - 1, t });
    }
  }

  accuracy() {
    const total = this.keypresses || 1;
    return 1 - (this.mistakes / total);
  }

  wpm(elapsedMs) {
    const minutes = Math.max(0.001, elapsedMs / 1000 / 60);
    const correct = this.correctIndex;
    return (correct / 5) / minutes;
  }

  progress() {
    return this.correctIndex / this.target.length;
  }
}

/* -------------------------
   UI Elements
------------------------- */
const el = {
  screens: {
    lobby: q('#screen-lobby'),
    race: q('#screen-race'),
    results: q('#screen-results')
  },
  lobby: {
    playerName: q('#playerName'),
    sentenceLength: q('#sentenceLength'),
    botCount: q('#botCount'),
    botCountValue: q('#botCountValue'),
    botList: q('#botList'),
    btnStart: q('#btnStart'),
    btnHowTo: q('#btnHowTo')
  },
  race: {
    track3d: q('#track3d'),
    hudWpm: q('#hudWpm'),
    hudAcc: q('#hudAcc'),
    hudTime: q('#hudTime'),
    hudPos: q('#hudPos'),
    miniTrack: q('#miniTrack'),
    btnPause: q('#btnPause'),
    btnRestart: q('#btnRestart'),
    btnQuit: q('#btnQuit'),
    sentenceView: q('#sentenceView'),
    hiddenInput: q('#hiddenInput'),
    countdown: q('#countdown'),
    btnToggleKB: q('#btnToggleKB'),
    onScreenKB: q('#onScreenKB'),
  },
  results: {
    resPosition: q('#resPosition'),
    resWpm: q('#resWpm'),
    resAcc: q('#resAcc'),
    resTime: q('#resTime'),
    resList: q('#resList'),
    resSentence: q('#resSentence'),
    btnExportPng: q('#btnExportPng'),
    btnCopyJson: q('#btnCopyJson'),
    btnPlayAgain: q('#btnPlayAgain'),
    btnBackLobby: q('#btnBackLobby'),
    exportCanvas: q('#exportCanvas')
  },
  header: {
    btnTheme: q('#btnTheme'),
    btnHighContrast: q('#btnHighContrast'),
    btnFontSize: q('#btnFontSize'),
    btnSound: q('#btnSound'),
    btnSettings: q('#btnSettings'),
    btnLeaderboard: q('#btnLeaderboard'),
  },
  modals: {
    settings: q('#settingsPanel'),
    leaderboard: q('#leaderboardPanel'),
    howto: q('#howtoPanel'),
    themeSelect: q('#themeSelect'),
    showKBSelect: q('#showKBSelect'),
    soundSelect: q('#soundSelect'),
    contrastSelect: q('#contrastSelect'),
    fontSelect: q('#fontSelect'),
    leaderboardList: q('#leaderboardList'),
    btnClearLeaderboard: q('#btnClearLeaderboard'),
  },
  footer: q('.app-footer')
};

/* -------------------------
   State
------------------------- */
const state = {
  settings: { ...DEFAULT_SETTINGS },
  bots: [],
  participants: [], // [ Player, ...bots ]
  player: null,
  target: '',
  game: {
    running: false,
    paused: false,
    startedAt: 0,
    lastTick: 0,
    endedAt: 0,
    placeCounter: 0
  },
  ui: {
    showKB: false
  }
};

/* -------------------------
   Storage
------------------------- */
function loadSettings() {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (data) {
    try {
      const s = JSON.parse(data);
      Object.assign(state.settings, DEFAULT_SETTINGS, s);
    } catch {}
  }
  // fill bots config
  if (!state.settings.bots || !state.settings.bots.length) {
    state.settings.bots = defaultBots(state.settings.botCount);
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
}

function defaultBots(count) {
  const result = [];
  for (let i=0;i<count;i++) {
    result.push({ name: `BOT_${String.fromCharCode(65 + i)}`, difficulty: i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low' });
  }
  return result;
}

function loadLeaderboard() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || '[]');
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}

function saveLeaderboard(list) {
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
}

function addToLeaderboard(entry) {
  const list = loadLeaderboard();
  list.push(entry);
  list.sort((a,b) => b.wpm - a.wpm || b.acc - a.acc);
  const top = list.slice(0, 20);
  saveLeaderboard(top);
  return top;
}

function addToHistory(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list.slice(0, 50)));
  } catch {}
}

/* -------------------------
   Screen management
------------------------- */
function showScreen(id) {
  Object.values(el.screens).forEach(s => s.setAttribute('hidden', 'true'));
  q('#' + id).removeAttribute('hidden');

  // focus management
  if (id === SCREENS.RACE) {
    setTimeout(() => {
      el.race.hiddenInput.focus({ preventScroll: true });
    }, 0);
  }
}

/* -------------------------
   Lobby UI
------------------------- */
function renderBotsConfig() {
  const count = Number(el.lobby.botCount.value);
  state.settings.botCount = count;
  el.lobby.botCountValue.textContent = String(count);
  if (!state.settings.bots || state.settings.bots.length !== count) {
    state.settings.bots = defaultBots(count);
  }
  el.lobby.botList.innerHTML = '';
  state.settings.bots.forEach((b, idx) => {
    const color = COLORS[idx % COLORS.length];
    const row = document.createElement('div');
    row.className = 'bot-row';
    row.innerHTML = `
      <span class="bot-dot" style="background:${color}"></span>
      <div class="bot-name">${b.name}</div>
      <select aria-label="Difficulty for ${b.name}">
        <option ${b.difficulty==='High'?'selected':''}>High</option>
        <option ${b.difficulty==='Medium'?'selected':''}>Medium</option>
        <option ${b.difficulty==='Low'?'selected':''}>Low</option>
      </select>
    `;
    const sel = row.querySelector('select');
    sel.addEventListener('change', () => {
      state.settings.bots[idx].difficulty = sel.value;
      saveSettings();
    });
    el.lobby.botList.appendChild(row);
  });
  saveSettings();
}

/* -------------------------
   Track rendering
------------------------- */
function createLanes() {
  el.race.track3d.innerHTML = '';
  const players = state.participants;

  players.forEach((p, i) => {
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.setAttribute('role', 'group');
    lane.setAttribute('aria-label', `${p.name}'s lane`);

    const label = document.createElement('div');
    label.className = 'lane-label';
    label.textContent = `${p.name}`;
    lane.appendChild(label);

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.setProperty('--color', p.color);
    avatar.innerHTML = `<div class="eyes"><div class="eye"></div><div class="eye"></div></div>`;
    lane.appendChild(avatar);

    const finishFlag = document.createElement('div');
    finishFlag.className = 'flag';
    lane.appendChild(finishFlag);

    el.race.track3d.appendChild(lane);

    p._laneEl = lane;
    p._avatarEl = avatar;
  });
}

/* -------------------------
   Sentence view
------------------------- */
function renderSentenceView() {
  const target = state.target;
  const player = state.player;
  const container = el.race.sentenceView;
  container.innerHTML = '';
  for (let i=0;i<target.length;i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = target[i];
    if (i < player.correctIndex) {
      span.classList.add('correct');
    } else if (i < player.typedIndex) {
      span.classList.add('wrong');
    }
    if (i === player.typedIndex) {
      const caret = document.createElement('span');
      caret.className = 'caret';
      caret.ariaHidden = 'true';
      caret.innerHTML = '&nbsp;';
      span.appendChild(caret);
    }
    container.appendChild(span);
  }
  // caret at end
  if (player.typedIndex >= target.length) {
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.innerHTML = '&nbsp;';
    container.appendChild(caret);
  }
}

/* -------------------------
   Mini map
------------------------- */
function renderMiniMap() {
  const mini = el.race.miniTrack;
  mini.innerHTML = '';
  const width = mini.clientWidth || 300;
  const height = mini.clientHeight || 28;
  const topY = 6;

  state.participants.forEach((p, idx) => {
    const dot = document.createElement('div');
    dot.className = 'mini-dot' + (p === state.player ? ' me' : '');
    dot.style.left = `${clamp(p.progress(), 0, 1) * (width - 18)}px`;
    dot.style.top = `${topY + idx * 0}px`;
    dot.style.borderColor = '#00000033';
    dot.style.background = p === state.player ? 'var(--primary)' : p.color;
    mini.appendChild(dot);
  });
}

/* -------------------------
   HUD
------------------------- */
function updateHUD(elapsedMs) {
  const p = state.player;
  el.race.hudWpm.textContent = Math.round(p.wpm(elapsedMs));
  el.race.hudAcc.textContent = `${Math.max(0, Math.round(p.accuracy()*100))}%`;
  el.race.hudTime.textContent = formatTime(elapsedMs);

  // Position calculation
  const sorted = [...state.participants].sort((a,b) => b.correctIndex - a.correctIndex);
  const pos = sorted.indexOf(p) + 1;
  el.race.hudPos.textContent = `${pos}/${state.participants.length}`;
}

/* -------------------------
   Keyboard (on-screen + key highlights)
------------------------- */
const KEY_LAYOUT = [
  ['1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l',';','\''],
  ['Shift','z','x','c','v','b','n','m',',','.','/','Back'],
  ['Space']
];

let kbShift = false;
function renderKeyboard() {
  const kb = el.race.onScreenKB;
  kb.innerHTML = '';
  KEY_LAYOUT.forEach(row => {
    const r = document.createElement('div');
    r.className = 'kb-row';
    row.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'key';
      let label = k;
      if (k === 'Space') {
        btn.classList.add('space','wide');
        label = '';
      } else if (k === 'Shift' || k === 'Back') {
        btn.classList.add('wide');
      }
      btn.setAttribute('type','button');
      btn.setAttribute('data-key', k);
      btn.textContent = label;
      btn.addEventListener('click', () => {
        onVirtualKey(k);
      });
      r.appendChild(btn);
    });
    kb.appendChild(r);
  });
}

function setKeyboardVisibility(show) {
  state.ui.showKB = show;
  el.race.onScreenKB.hidden = !show;
  el.race.btnToggleKB.setAttribute('aria-pressed', show ? 'true' : 'false');
}

function onVirtualKey(k) {
  ensureAudio(); // iOS unlock
  if (k === 'Shift') {
    kbShift = !kbShift;
    highlightShiftKey(kbShift);
    return;
  }
  if (k === 'Back') {
    handleInput({ key: 'Backspace' });
    return;
  }
  if (k === 'Space') {
    handleInput({ key: ' ' });
    return;
  }
  const ch = kbShift ? k.toUpperCase() : k;
  handleInput({ key: ch });
  kbShift = false; // single-use shift
  highlightShiftKey(false);
}

function highlightShiftKey(on) {
  qa('.key[data-key="Shift"]').forEach(k => k.classList.toggle('active', on));
}

function highlightKeyVisual(key, active=true) {
  const label = key === ' ' ? 'Space' : key === 'Backspace' ? 'Back' : key.length === 1 ? key.toLowerCase() : key;
  const elKey = qa(`.key[data-key="${CSS.escape(label)}"]`)[0];
  if (elKey) {
    elKey.classList.toggle('active', active);
    setTimeout(() => elKey.classList.remove('active'), 120);
  }
}

/* -------------------------
   Game Flow
------------------------- */
function setupRace() {
  // Generate target text
  state.target = generateSentence(state.settings.sentenceLength);

  // Create player and bots
  const playerColor = COLORS[0];
  const player = new Player(state.settings.playerName || 'You', playerColor, state.target);
  state.player = player;

  state.bots = state.settings.bots.map((b, idx) => {
    return new Bot({ name: `${b.name} (${b.difficulty})`, color: COLORS[(idx+1)%COLORS.length], difficulty: b.difficulty, target: state.target });
  });

  state.participants = [player, ...state.bots];

  // Render lanes and sentence
  createLanes();
  renderSentenceView();
  renderMiniMap();

  // HUD
  updateHUD(0);
}

function startCountdownAndRace() {
  showScreen(SCREENS.RACE);
  ensureAudio();

  // Settings-driven keyboard visibility
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const autoKB = state.settings.showKB;
  setKeyboardVisibility(autoKB === 'on' || (autoKB === 'auto' && isMobile));

  kbShift = false;
  renderKeyboard();

  // Countdown 3,2,1,Go
  const c = el.race.countdown;
  c.innerHTML = '';
  let count = 3;
  const tick = () => {
    c.innerHTML = `<div class="bubble">${count > 0 ? count : 'Go!'}</div>`;
    c.style.display = 'grid';
    if (state.settings.sound) {
      beep({ freq: count > 0 ? 500 + (3-count)*120 : 800, duration: 120, volume: 0.06 });
    }
    vibrate(15);
    if (count <= 0) {
      setTimeout(() => {
        c.style.display = 'none';
        beginRace();
      }, 500);
    } else {
      setTimeout(() => { count--; tick(); }, 800);
    }
  };
  tick();
}

function beginRace() {
  state.game.running = true;
  state.game.paused = false;
  state.game.startedAt = msNow();
  state.game.lastTick = state.game.startedAt;
  state.game.placeCounter = 0;
  loop();
}

function endRace(winner) {
  if (!state.game.running) return;
  state.game.running = false;
  state.game.endedAt = msNow();
  // Finalize places
  const finishedOrder = [...state.participants].sort((a,b) => (b.correctIndex - a.correctIndex) || (a.finishTime||Infinity) - (b.finishTime||Infinity));
  finishedOrder.forEach((p, idx) => p.place = idx + 1);
  renderResults();
}

function restartRace() {
  setupRace();
  startCountdownAndRace();
}

function quitToLobby() {
  state.game.running = false;
  showScreen(SCREENS.LOBBY);
}

/* -------------------------
   Main Loop
------------------------- */
function loop() {
  if (!state.game.running) return;
  const now = msNow();
  const dt = now - state.game.lastTick;
  state.game.lastTick = now;

  if (!state.game.paused) {
    // Update bots
    state.bots.forEach(b => {
      if (!b.finished) {
        b.update(dt, now);
        if (b.finished && b.finishTime == null) {
          b.finishTime = now;
        }
      }
    });

    // Check finish
    const someoneFinished = state.participants.some(p => p.correctIndex >= state.target.length);
    if (someoneFinished) {
      endRace();
      return;
    }

    // Update UI
    renderSentenceView();
    renderMiniMap();
    updateAvatarPositions();
    updateHUD(now - state.game.startedAt);
  }

  requestAnimationFrame(loop);
}

function updateAvatarPositions() {
  const trackWidth = el.race.track3d.clientWidth;
  const rightPadding = 56; // flag area
  const leftPadding = 16;

  state.participants.forEach(p => {
    const progress = clamp(p.progress(), 0, 1);
    const x = leftPadding + progress * (trackWidth - rightPadding - leftPadding);
    p._avatarEl.style.transform = `translateX(${x}px) translateY(${Math.sin(progress * Math.PI*2) * 1.5}px)`;
  });
}

/* -------------------------
   Input handling
------------------------- */
function handleInput(e) {
  if (!state.game.running || state.game.paused) return;

  const k = e.key || '';
  const now = msNow();

  // Prevent default for some keys to avoid scrolling
  if ([' ', 'Spacebar'].includes(k) || k === 'Tab') {
    e.preventDefault();
  }

  // Accept printable chars and backspace only
  if (k === 'Backspace') {
    state.player.handleKeyInput('Backspace', now - state.game.startedAt);
    highlightKeyVisual('Backspace');
  } else if (k.length === 1) {
    // Only accept exact char case for now; we want precise typing
    state.player.handleKeyInput(k, now - state.game.startedAt);
    highlightKeyVisual(k);
  }

  // Update after each input
  renderSentenceView();
  renderMiniMap();
  updateAvatarPositions();
  updateHUD(now - state.game.startedAt);

  // Check end
  if (state.player.finished) {
    if (state.settings.sound) beep({ freq: 900, duration: 160, volume: 0.07, type: 'triangle' });
    endRace();
  }
}

function focusInput() {
  el.race.hiddenInput.focus({ preventScroll: true });
}

/* -------------------------
   Results
------------------------- */
function renderResults() {
  const elapsed = (state.game.endedAt || msNow()) - state.game.startedAt;
  const order = [...state.participants].sort((a,b) => a.place - b.place);

  const me = state.player;
  const position = order.indexOf(me) + 1;

  el.results.resPosition.textContent = `${position}/${state.participants.length}`;
  el.results.resWpm.textContent = `${Math.round(me.wpm(elapsed))}`;
  el.results.resAcc.textContent = `${Math.round(me.accuracy()*100)}%`;
  el.results.resTime.textContent = formatTime(elapsed);

  el.results.resList.innerHTML = '';
  order.forEach((p, idx) => {
    const li = document.createElement('li');
    li.className = 'res-item';
    li.innerHTML = `
      <span class="badge">#${idx+1}</span>
      <strong style="color:${p===me?'var(--primary)':'inherit'}">${p.name}</strong>
      <span class="muted">${p instanceof Player ? 'Human' : 'Bot'}</span>
      <span class="badge">${Math.round((p.correctIndex/5) / Math.max(0.001, ((p.finishTime||state.game.endedAt) - state.game.startedAt) / 1000 / 60))} WPM</span>
    `;
    el.results.resList.appendChild(li);
  });

  // Show sentence with mistakes marked
  el.results.resSentence.innerHTML = '';
  state.target.split('').forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch;
    if (i < me.correctIndex) s.classList.add('correct');
    const wasMistake = me.historyMistakes.some(m => m.i === i);
    if (wasMistake) s.classList.add('wrong');
    el.results.resSentence.appendChild(s);
  });

  // Persist leaderboard + history
  const entry = {
    name: state.settings.playerName || 'You',
    wpm: Math.round(me.wpm(elapsed)),
    acc: Math.round(me.accuracy()*100),
    date: new Date().toISOString(),
    pos: position,
    bots: state.bots.length,
    text: state.target
  };
  const top = addToLeaderboard(entry);
  addToHistory({ ...entry, participants: state.participants.map(p => ({ name: p.name, place: p.place })) });

  renderLeaderboard(top);

  showScreen(SCREENS.RESULTS);
}

/* -------------------------
   Leaderboard
------------------------- */
function renderLeaderboard(list = null) {
  const lb = list || loadLeaderboard();
  el.modals.leaderboardList.innerHTML = '';
  if (!lb.length) {
    const li = document.createElement('li');
    li.textContent = 'No entries yet — finish a race to claim a spot!';
    el.modals.leaderboardList.appendChild(li);
    return;
  }
  lb.forEach((e, i) => {
    const li = document.createElement('li');
    li.className = 'res-item';
    const date = new Date(e.date);
    li.innerHTML = `
      <span class="badge">#${i+1}</span>
      <strong>${escapeHtml(e.name)}</strong>
      <span class="muted">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
      <span class="badge">${e.wpm} WPM • ${e.acc}%</span>
    `;
    el.modals.leaderboardList.appendChild(li);
  });
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* -------------------------
   Export PNG / Copy JSON
------------------------- */
function exportPNG() {
  const canvas = el.results.exportCanvas;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0b0f14');
  grad.addColorStop(1, '#1a1f2b');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  // Title
  ctx.fillStyle = '#7cf8a9';
  ctx.font = 'bold 36px system-ui, -apple-system, Segoe UI, Inter';
  ctx.fillText('LavaType Racer — Results', 28, 56);

  // Stats Panel
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#1d2233';
  roundRect(ctx, 24, 70, w-48, 160, 16, true, false);
  ctx.globalAlpha = 1;

  const player = state.player;
  const elapsed = (state.game.endedAt || msNow()) - state.game.startedAt;
  const wpm = Math.round(player.wpm(elapsed));
  const acc = Math.round(player.accuracy()*100);
  const pos = [...state.participants].sort((a,b) => a.place - b.place).indexOf(player) + 1;

  ctx.fillStyle = '#e9ecf1';
  ctx.font = 'bold 28px system-ui, -apple-system, Segoe UI, Inter';
  ctx.fillText(`${state.settings.playerName || 'You'}`, 50, 110);

  ctx.font = '16px system-ui, -apple-system, Segoe UI, Inter';
  ctx.fillStyle = '#9aa3b2';
  ctx.fillText(`Position`, 50, 140);
  ctx.fillText(`WPM`, 220, 140);
  ctx.fillText(`Accuracy`, 390, 140);
  ctx.fillText(`Time`, 580, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px system-ui, -apple-system, Segoe UI, Inter';
  ctx.fillText(`${pos}/${state.participants.length}`, 50, 172);
  ctx.fillText(`${wpm}`, 220, 172);
  ctx.fillText(`${acc}%`, 390, 172);
  ctx.fillText(`${formatTime(elapsed)}`, 580, 172);

  // Sentence area
  const sPanelY = 250;
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#1d2233';
  roundRect(ctx, 24, sPanelY, w-48, 180, 16, true, false);
  ctx.globalAlpha = 1;

  // Sentence text
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, 30, sPanelY+10, w-60, 160, 12, false, false);
  ctx.clip();

  const line = state.target;
  const maxWidth = w - 80;
  ctx.font = '18px system-ui, -apple-system, Segoe UI, Inter';
  let x = 36, y = sPanelY + 40;
  for (let i=0;i<line.length;i++) {
    const ch = line[i];
    const wasMistake = state.player.historyMistakes.some(m => m.i === i);
    ctx.fillStyle = i < state.player.correctIndex ? '#77f2a6' : wasMistake ? '#ff99aa' : '#e3e7f2';
    if (x > maxWidth) { x = 36; y += 26; }
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + 1;
  }
  ctx.restore();

  // Footer
  ctx.fillStyle = '#9aa3b2';
  ctx.font = '14px system-ui, -apple-system, Segoe UI, Inter';
  ctx.fillText(`Bots: ${state.bots.length} • ${new Date().toLocaleString()} • Last Developed by SANTHOSH_A`, 28, h - 24);

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `LavaType_${wpm}WPM_${Date.now()}.png`;
  a.click();
}
function roundRect(ctx, x, y, w, h, r, fill, stroke=true) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

async function copyJSON() {
  const elapsed = (state.game.endedAt || msNow()) - state.game.startedAt;
  const me = state.player;
  const payload = {
    game: 'LavaType Racer',
    when: new Date().toISOString(),
    player: { name: state.settings.playerName, wpm: Math.round(me.wpm(elapsed)), accuracy: Math.round(me.accuracy()*100) },
    position: [...state.participants].sort((a,b) => a.place - b.place).indexOf(me) + 1,
    bots: state.bots.map(b => ({ name: b.name, difficulty: b.diff })),
    text: state.target
  };
  const str = JSON.stringify(payload, null, 2);
  try {
    await navigator.clipboard.writeText(str);
    alert('Summary copied to clipboard!');
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = str; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
    alert('Summary copied to clipboard.');
  }
}

/* -------------------------
   Settings / Theming
------------------------- */
function applySettingsToDOM() {
  document.documentElement.setAttribute('data-theme', state.settings.theme);
  document.documentElement.setAttribute('data-contrast', state.settings.highContrast ? 'high' : 'normal');
  document.documentElement.setAttribute('data-font', state.settings.largeFont ? 'large' : 'normal');

  el.header.btnTheme.setAttribute('aria-pressed', state.settings.theme === 'dark');
  el.header.btnHighContrast.setAttribute('aria-pressed', state.settings.highContrast ? 'true' : 'false');
  el.header.btnFontSize.setAttribute('aria-pressed', state.settings.largeFont ? 'true' : 'false');
  el.header.btnSound.setAttribute('aria-pressed', state.settings.sound ? 'true' : 'false');

  // Modal selects
  el.modals.themeSelect.value = state.settings.theme;
  el.modals.showKBSelect.value = state.settings.showKB;
  el.modals.soundSelect.value = state.settings.sound ? 'on' : 'off';
  el.modals.contrastSelect.value = state.settings.highContrast ? 'high' : 'normal';
  el.modals.fontSelect.value = state.settings.largeFont ? 'large' : 'normal';
}

function bindSettingsUI() {
  // Header quick toggles
  el.header.btnTheme.addEventListener('click', () => {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings(); applySettingsToDOM();
  });
  el.header.btnHighContrast.addEventListener('click', () => {
    state.settings.highContrast = !state.settings.highContrast;
    saveSettings(); applySettingsToDOM();
  });
  el.header.btnFontSize.addEventListener('click', () => {
    state.settings.largeFont = !state.settings.largeFont;
    saveSettings(); applySettingsToDOM();
  });
  el.header.btnSound.addEventListener('click', () => {
    state.settings.sound = !state.settings.sound;
    saveSettings(); applySettingsToDOM();
  });

  // Settings modal
  el.header.btnSettings.addEventListener('click', () => openModal(el.modals.settings));
  el.modals.themeSelect.addEventListener('change', () => {
    state.settings.theme = el.modals.themeSelect.value; saveSettings(); applySettingsToDOM();
  });
  el.modals.showKBSelect.addEventListener('change', () => {
    state.settings.showKB = el.modals.showKBSelect.value; saveSettings();
  });
  el.modals.soundSelect.addEventListener('change', () => {
    state.settings.sound = el.modals.soundSelect.value === 'on'; saveSettings(); applySettingsToDOM();
  });
  el.modals.contrastSelect.addEventListener('change', () => {
    state.settings.highContrast = el.modals.contrastSelect.value === 'high'; saveSettings(); applySettingsToDOM();
  });
  el.modals.fontSelect.addEventListener('change', () => {
    state.settings.largeFont = el.modals.fontSelect.value === 'large'; saveSettings(); applySettingsToDOM();
  });

  // Leaderboard modal
  el.header.btnLeaderboard.addEventListener('click', () => {
    renderLeaderboard();
    openModal(el.modals.leaderboard);
  });
  el.modals.btnClearLeaderboard.addEventListener('click', () => {
    if (confirm('Clear local leaderboard?')) {
      saveLeaderboard([]);
      renderLeaderboard([]);
    }
  });

  // How to
  el.lobby.btnHowTo.addEventListener('click', () => openModal(el.modals.howto));
}

function openModal(m) {
  m.removeAttribute('hidden');
  const closeEls = m.querySelectorAll('[data-close-modal]');
  closeEls.forEach(btn => btn.addEventListener('click', () => closeModal(m), { once: true }));
  function onEsc(e) { if (e.key === 'Escape') { closeModal(m); document.removeEventListener('keydown', onEsc); } }
  document.addEventListener('keydown', onEsc);
}
function closeModal(m) { if (m) m.setAttribute('hidden', 'true'); }

/* -------------------------
   Event bindings
------------------------- */
function bindEvents() {
  // Lobby controls
  el.lobby.playerName.addEventListener('input', () => { state.settings.playerName = el.lobby.playerName.value.trim().slice(0,18); saveSettings(); });
  el.lobby.sentenceLength.addEventListener('change', () => { state.settings.sentenceLength = el.lobby.sentenceLength.value; saveSettings(); });
  el.lobby.botCount.addEventListener('input', () => renderBotsConfig());
  el.lobby.btnStart.addEventListener('click', () => {
    setupRace();
    startCountdownAndRace();
  });

  // Race controls
  el.race.btnPause.addEventListener('click', () => {
    if (!state.game.running) return;
    state.game.paused = !state.game.paused;
    el.race.btnPause.textContent = state.game.paused ? 'Resume' : 'Pause';
    if (!state.game.paused) {
      // resume
      state.game.lastTick = msNow();
      loop();
      focusInput();
    }
  });
  el.race.btnRestart.addEventListener('click', () => restartRace());
  el.race.btnQuit.addEventListener('click', () => quitToLobby());

  el.race.hiddenInput.addEventListener('keydown', (e) => handleInput(e));
  // Also capture on document to highlight keys for physical keyboard
  document.addEventListener('keydown', (e) => {
    if (document.activeElement !== el.race.hiddenInput && state.game.running && !state.game.paused) {
      // Keep focus on hidden input
      focusInput();
    }
    if (!state.game.running) return;
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
      highlightKeyVisual(e.key === ' ' ? ' ' : e.key);
    }
  });

  // On-screen keyboard toggle
  el.race.btnToggleKB.addEventListener('click', () => {
    setKeyboardVisibility(!state.ui.showKB);
  });

  // Results controls
  el.results.btnExportPng.addEventListener('click', exportPNG);
  el.results.btnCopyJson.addEventListener('click', copyJSON);
  el.results.btnPlayAgain.addEventListener('click', () => restartRace());
  el.results.btnBackLobby.addEventListener('click', () => quitToLobby());

  // Focus typing area on click
  el.race.sentenceView.addEventListener('click', focusInput);
  el.race.track3d.addEventListener('click', focusInput);

  // Unlock audio on first interaction
  ['click','keydown','touchstart'].forEach(evt => {
    window.addEventListener(evt, ensureAudio, { once: true, passive: true });
  });

  // Resize updates for minimap and avatars
  window.addEventListener('resize', () => {
    renderMiniMap();
    updateAvatarPositions();
  });
}

/* -------------------------
   Boot
------------------------- */
function boot() {
  loadSettings();
  applySettingsToDOM();

  // Bind settings to UI
  el.lobby.playerName.value = state.settings.playerName;
  el.lobby.sentenceLength.value = state.settings.sentenceLength;
  el.lobby.botCount.value = state.settings.botCount;
  renderBotsConfig();
  bindSettingsUI();
  bindEvents();

  // Pre-render keyboard so it exists for highlight mapping
  renderKeyboard();

  // Show lobby
  showScreen(SCREENS.LOBBY);
}
boot();

/* -------------------------
   Extra UX polish
------------------------- */
// Simple celebration confetti on finish
(function setupFinishEffects(){
  const banner = q('.finish-glow');
  if (!banner) return;
  // Optionally add mild particle shimmer via CSS only (already animated)
})();

/* -------------------------
   Accept common shortcuts
------------------------- */
// Space toggles pause in race
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && state.game.running) {
    e.preventDefault();
    el.race.btnPause.click();
  }
});