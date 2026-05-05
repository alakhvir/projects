const PROGRAM = [
  {
    key: 'mon', name: 'Mon', dayIdx: 1,
    title: 'Lower Body', subtitle: 'Strength · ~60 min',
    sections: [
      { label: 'Primer', name: 'Core wake-up · 6 min', exercises: [
        { name: 'Dead Bug', sets: 2, prescription: '2 × 10/side' },
        { name: 'Bird Dog', sets: 2, prescription: '2 × 10/side' },
        { name: 'Plank', sets: 1, prescription: '1 × 30 sec' },
      ]},
      { label: 'Main', name: 'Strength block', exercises: [
        { name: 'Goblet Squat', sets: 4, prescription: '4 × 10' },
        { name: 'Leg Press', sets: 3, prescription: '3 × 12' },
        { name: 'Step-ups', sets: 3, prescription: '3 × 10/leg' },
        { name: 'Seated Leg Curl', sets: 3, prescription: '3 × 12' },
        { name: 'Calf Raises', sets: 4, prescription: '4 × 15' },
      ]},
    ]
  },
  {
    key: 'tue', name: 'Tue', dayIdx: 2,
    title: 'Upper Push', subtitle: 'Shoulder-safe · ~50 min',
    sections: [
      { label: 'Primer', name: 'Core wake-up · 6 min', exercises: [
        { name: 'Dead Bug', sets: 2, prescription: '2 × 10/side' },
        { name: 'Bird Dog', sets: 2, prescription: '2 × 10/side' },
        { name: 'Plank', sets: 1, prescription: '1 × 30 sec' },
      ]},
      { label: 'Main', name: 'Push block', exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, prescription: '4 × 8–10' },
        { name: 'Machine Chest Press', sets: 3, prescription: '3 × 10' },
        { name: 'Dumbbell or Cable Flye', added: true, sets: 3, prescription: '3 × 12', note: 'Deep stretch at the bottom — this is the chest-developer your push day was missing.' },
        { name: 'Lateral Raises', sets: 3, prescription: '3 × 15' },
        { name: 'Triceps Pushdown', sets: 3, prescription: '3 × 12' },
      ]},
    ]
  },
  {
    key: 'wed', name: 'Wed', dayIdx: 3,
    title: 'Core + Cardio', subtitle: 'Conditioning · ~40 min',
    sections: [
      { label: 'Abs', name: 'Direct core work', exercises: [
        { name: 'Hanging Knee Raise', added: true, sets: 3, prescription: '3 × 10–12', note: "If grip fails, switch to captain's chair." },
        { name: 'Pallof Press', added: true, sets: 3, prescription: '3 × 10/side', note: 'Anti-rotation — huge for obliques and a tight midsection.' },
        { name: 'Plank', sets: 3, prescription: '3 × 30–45 sec' },
      ]},
      { label: 'Cardio', name: 'Alternate weekly', cardio: true },
    ]
  },
  {
    key: 'thu', name: 'Thu', dayIdx: 4,
    title: 'Active Recovery', subtitle: 'Move easy',
    rest: { label: 'Walk it off', detail: '8–10k steps. Light walking, 5–10 min mobility/stretching if anything feels tight.' }
  },
  {
    key: 'fri', name: 'Fri', dayIdx: 5,
    title: 'Lower Body', subtitle: 'Hypertrophy · ~60 min',
    sections: [
      { label: 'Primer', name: 'Core wake-up · 6 min', exercises: [
        { name: 'Dead Bug', sets: 2, prescription: '2 × 10/side' },
        { name: 'Bird Dog', sets: 2, prescription: '2 × 10/side' },
        { name: 'Plank', sets: 1, prescription: '1 × 30 sec' },
      ]},
      { label: 'Main', name: 'Hypertrophy block', exercises: [
        { name: 'Bulgarian Split Squat', sets: 3, prescription: '3 × 10/leg' },
        { name: 'Hip Thrust', sets: 4, prescription: '4 × 12' },
        { name: 'Leg Extension', sets: 3, prescription: '3 × 15' },
        { name: 'Hamstring Curl', sets: 3, prescription: '3 × 12' },
        { name: 'Calf Raises', added: true, sets: 3, prescription: '3 × 15', note: 'Different variation from Monday.' },
        { name: 'Side Plank', added: true, sets: 3, prescription: '3 × 30 sec/side' },
      ]},
    ]
  },
  {
    key: 'sat', name: 'Sat', dayIdx: 6,
    title: 'Upper Pull', subtitle: 'Back + biceps · ~55 min',
    sections: [
      { label: 'Primer', name: 'Core wake-up · 6 min', exercises: [
        { name: 'Dead Bug', sets: 2, prescription: '2 × 10/side' },
        { name: 'Bird Dog', sets: 2, prescription: '2 × 10/side' },
        { name: 'Plank', sets: 1, prescription: '1 × 30 sec' },
      ]},
      { label: 'Main', name: 'Pull block', exercises: [
        { name: 'Lat Pulldown', sets: 4, prescription: '4 × 10' },
        { name: 'Chest-Supported Row or 1-Arm DB Row', added: true, sets: 3, prescription: '3 × 10', note: 'Thick mid-back — what makes your waist look smaller.' },
        { name: 'Seated Row', sets: 4, prescription: '4 × 10' },
        { name: 'Face Pull', sets: 3, prescription: '3 × 15' },
        { name: 'Dumbbell Curls', sets: 3, prescription: '3 × 12' },
      ]},
    ]
  },
  {
    key: 'sun', name: 'Sun', dayIdx: 0,
    title: 'Rest', subtitle: 'Full recovery',
    rest: { label: 'Off the gym floor', detail: '8–10k steps. Light walking, sauna or stretching if available. Sleep 7+ hours — this is when you actually build.' }
  }
];

// ---------- Storage ----------
const STORAGE_KEY = 'training-plan-state-v3';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Migrate from v2 if present
  try {
    const v2 = localStorage.getItem('training-plan-state-v2');
    if (v2) {
      const old = JSON.parse(v2);
      const fresh = { v: 3, sessions: {} };
      const today = formatDate(new Date());
      fresh.sessions[today] = {};
      for (const [k, val] of Object.entries(old)) {
        if (typeof val === 'object' && val !== null) {
          fresh.sessions[today][k] = val;
        }
      }
      return fresh;
    }
  } catch {}
  return { v: 3, sessions: {} };
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

let state = loadState();

// ---------- Date utilities ----------
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDate(a, b) { return formatDate(a) === formatDate(b); }

function dayKeyFromDate(d) {
  const idx = d.getDay();
  return PROGRAM.find(p => p.dayIdx === idx).key;
}

function dayFromDate(d) {
  return PROGRAM.find(p => p.dayIdx === d.getDay());
}

function formatDateLong(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatMonthYear(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ---------- Set data accessors (date-keyed) ----------
function getSet(date, dayKey, sIdx, eIdx, setIdx) {
  const ds = state.sessions[date];
  if (!ds) return { done: false, weight: '', reps: '' };
  const k = `${dayKey}-${sIdx}-${eIdx}-${setIdx}`;
  return ds[k] || { done: false, weight: '', reps: '' };
}

function updateSet(date, dayKey, sIdx, eIdx, setIdx, patch) {
  if (!state.sessions[date]) state.sessions[date] = {};
  const k = `${dayKey}-${sIdx}-${eIdx}-${setIdx}`;
  const cur = state.sessions[date][k] || { done: false, weight: '', reps: '' };
  state.sessions[date][k] = { ...cur, ...patch };
  saveState();
}

function exerciseDoneOnDate(date, dayKey, sIdx, eIdx, totalSets) {
  for (let s = 0; s < totalSets; s++) {
    if (!getSet(date, dayKey, sIdx, eIdx, s).done) return false;
  }
  return true;
}

// "Has any data" = any check or any input filled
function dateHasAnyData(date) {
  const ds = state.sessions[date];
  if (!ds) return false;
  return Object.values(ds).some(v => v.done || v.weight || v.reps);
}

// "Workout completed" = at least 75% of working-set checks done across the day's plan
function dateIsCompleted(date) {
  const day = dayFromDate(parseDate(date));
  if (day.rest) return false;
  let total = 0, done = 0;
  day.sections.forEach((sec, sIdx) => {
    if (sec.cardio) return;
    sec.exercises.forEach((ex, eIdx) => {
      for (let s = 0; s < ex.sets; s++) {
        total++;
        if (getSet(date, day.key, sIdx, eIdx, s).done) done++;
      }
    });
  });
  return total > 0 && (done / total) >= 0.75;
}

function repTarget(prescription) {
  const m = prescription.match(/×\s*(.+)/);
  return m ? m[1].trim() : '';
}

// ---------- Today tab ----------
let currentDate = new Date();

function renderToday() {
  const dateStr = formatDate(currentDate);
  const today = new Date();
  const isToday = isSameDate(currentDate, today);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  // Header
  let eyebrow;
  if (isToday) eyebrow = 'Today';
  else if (isSameDate(currentDate, yesterday)) eyebrow = 'Yesterday';
  else if (isSameDate(currentDate, tomorrow)) eyebrow = 'Tomorrow';
  else eyebrow = currentDate.getFullYear() === today.getFullYear() ? '' : String(currentDate.getFullYear());

  document.getElementById('dateEyebrow').textContent = eyebrow;
  document.getElementById('dateFull').textContent = formatDateLong(currentDate);

  const day = dayFromDate(currentDate);
  const container = document.getElementById('todayContent');

  let html = `
    <div class="day-block">
      <h2 class="day-title">${day.title}</h2>
      <div class="day-subtitle">${day.subtitle}</div>
    </div>
  `;

  if (!isToday) {
    html = `
      <div class="day-block" style="padding-bottom: 0;">
        <button class="jump-today" id="jumpTodayBtn">↺ Jump to today</button>
        <h2 class="day-title" style="margin-top:14px;">${day.title}</h2>
        <div class="day-subtitle">${day.subtitle}</div>
      </div>
    `;
  }

  if (day.rest) {
    html += `
      <div class="rest-card">
        <div class="icon">~</div>
        <div class="label">${day.rest.label}</div>
        <div class="detail">${day.rest.detail}</div>
      </div>
    `;
  } else {
    day.sections.forEach((section, sIdx) => {
      html += `
        <div class="section">
          <div class="section-label">
            <div class="section-num">${section.label}</div>
            <div class="section-name">${section.name}</div>
          </div>
      `;

      if (section.cardio) {
        html += `
          <div class="cardio-block">
            <div class="cardio-row">
              <div class="cardio-label">Week A</div>
              <div class="cardio-detail">Incline Walk · 30–45 min<br><span style="color:var(--text-faint); font-size:12px;">3.0 mph @ 10–12% incline</span></div>
            </div>
            <div class="cardio-row">
              <div class="cardio-label">Week B</div>
              <div class="cardio-detail">Intervals · ~21 min<br><span style="color:var(--text-faint); font-size:12px;">1 min hard / 2 min easy × 7</span></div>
            </div>
          </div>
        `;
      } else {
        section.exercises.forEach((ex, eIdx) => {
          const done = exerciseDoneOnDate(dateStr, day.key, sIdx, eIdx, ex.sets);
          const isPrimer = section.label === 'Primer';
          const repHint = repTarget(ex.prescription);
          html += `
            <div class="exercise${done ? ' done' : ''}" data-section="${sIdx}" data-ex="${eIdx}">
              <div class="exercise-header">
                <div class="exercise-name">${ex.name}${ex.added ? '<span class="added">NEW</span>' : ''}</div>
                <div class="exercise-prescription">${ex.prescription}</div>
              </div>
              ${ex.note ? `<div class="exercise-note">${ex.note}</div>` : ''}
              <div class="sets${isPrimer ? ' primer' : ''}">
          `;
          if (isPrimer) {
            for (let s = 0; s < ex.sets; s++) {
              const data = getSet(dateStr, day.key, sIdx, eIdx, s);
              html += `<div class="set-box" data-set="${s}" data-checked="${data.done}">Set ${s + 1}</div>`;
            }
          } else {
            html += `<div class="sets-header"><div></div><div>Weight</div><div>Reps</div></div>`;
            for (let s = 0; s < ex.sets; s++) {
              const data = getSet(dateStr, day.key, sIdx, eIdx, s);
              const wHas = data.weight ? ' has-value' : '';
              const rHas = data.reps ? ' has-value' : '';
              html += `
                <div class="set-row">
                  <div class="set-box" data-set="${s}" data-checked="${data.done}">Set ${s + 1}</div>
                  <input class="set-input${wHas}" data-set="${s}" data-field="weight" type="text" inputmode="decimal" placeholder="lb" value="${data.weight}">
                  <input class="set-input${rHas}" data-set="${s}" data-field="reps" type="text" inputmode="numeric" placeholder="${repHint}" value="${data.reps}">
                </div>
              `;
            }
          }
          html += `</div></div>`;
        });
      }
      html += `</div>`;
    });
  }

  container.innerHTML = html;

  if (!isToday) {
    const jumpBtn = document.getElementById('jumpTodayBtn');
    if (jumpBtn) jumpBtn.addEventListener('click', () => { currentDate = new Date(); renderToday(); });
  }
}

// Today tab events (delegated to todayContent)
document.getElementById('todayContent').addEventListener('click', (e) => {
  const setBox = e.target.closest('.set-box');
  if (!setBox) return;
  const exEl = setBox.closest('.exercise');
  const sectionEl = setBox.closest('.section');
  const sIdx = parseInt(exEl.dataset.section, 10);
  const eIdx = parseInt(exEl.dataset.ex, 10);
  const setIdx = parseInt(setBox.dataset.set, 10);
  const day = dayFromDate(currentDate);
  const dateStr = formatDate(currentDate);
  const cur = getSet(dateStr, day.key, sIdx, eIdx, setIdx);
  updateSet(dateStr, day.key, sIdx, eIdx, setIdx, { done: !cur.done });

  setBox.dataset.checked = !cur.done;

  const totalSets = day.sections[sIdx].exercises[eIdx].sets;
  if (exerciseDoneOnDate(dateStr, day.key, sIdx, eIdx, totalSets)) {
    exEl.classList.add('done');
  } else {
    exEl.classList.remove('done');
  }
});

document.getElementById('todayContent').addEventListener('input', (e) => {
  const inp = e.target.closest('.set-input');
  if (!inp) return;
  const exEl = inp.closest('.exercise');
  const sIdx = parseInt(exEl.dataset.section, 10);
  const eIdx = parseInt(exEl.dataset.ex, 10);
  const setIdx = parseInt(inp.dataset.set, 10);
  const field = inp.dataset.field;
  const day = dayFromDate(currentDate);
  const dateStr = formatDate(currentDate);
  updateSet(dateStr, day.key, sIdx, eIdx, setIdx, { [field]: inp.value });
  inp.classList.toggle('has-value', !!inp.value);
});

document.getElementById('prevDay').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  renderToday();
});
document.getElementById('nextDay').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderToday();
});
document.getElementById('dateDisplay').addEventListener('click', () => {
  // Tap date → open History
  switchTab('history');
});

// ---------- History tab ----------
let calCursor = new Date();
calCursor.setDate(1);

function renderHistoryStats() {
  const sessions = Object.keys(state.sessions).filter(d => dateHasAnyData(d));
  const completed = sessions.filter(d => dateIsCompleted(d));

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const thisMonth = sessions.filter(d => d.startsWith(ym));

  document.getElementById('historyStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${completed.length}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${sessions.length}</div>
      <div class="stat-label">Logged</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${thisMonth.length}</div>
      <div class="stat-label">This month</div>
    </div>
  `;
}

function renderCalendar() {
  document.getElementById('calMonth').textContent = formatMonthYear(calCursor);

  const year = calCursor.getFullYear();
  const month = calCursor.getMonth();
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startCol = first.getDay(); // 0=Sun

  const today = new Date();
  const todayStr = formatDate(today);
  const selectedStr = formatDate(currentDate);

  let html = '';
  for (let i = 0; i < startCol; i++) {
    html += `<div class="cal-day" data-empty="true"></div>`;
  }
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDate(date);
    const day = dayFromDate(date);
    const isRest = !!day.rest;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedStr;
    const hasData = dateHasAnyData(dateStr);
    const completed = dateIsCompleted(dateStr);

    html += `<button class="cal-day"
      data-date="${dateStr}"
      ${isRest ? 'data-rest="true"' : ''}
      ${isToday ? 'data-today="true"' : ''}
      ${isSelected ? 'data-selected="true"' : ''}
      ${hasData ? 'data-has-data="true"' : ''}
      ${completed ? 'data-completed="true"' : ''}
      >${d}</button>`;
  }
  document.getElementById('calDays').innerHTML = html;
}

document.getElementById('calPrev').addEventListener('click', () => {
  calCursor.setMonth(calCursor.getMonth() - 1);
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calCursor.setMonth(calCursor.getMonth() + 1);
  renderCalendar();
});
document.getElementById('calDays').addEventListener('click', (e) => {
  const btn = e.target.closest('.cal-day[data-date]');
  if (!btn) return;
  currentDate = parseDate(btn.dataset.date);
  renderToday();
  switchTab('today');
});

function refreshHistory() {
  renderHistoryStats();
  renderCalendar();
}

// ---------- Plan tab (read-only reference) ----------
let planCurrentDayKey = (PROGRAM.find(p => p.dayIdx === new Date().getDay()) || PROGRAM[0]).key;

function renderPlanNav() {
  const nav = document.getElementById('planDayNav');
  nav.innerHTML = '';
  PROGRAM.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'day-btn';
    btn.textContent = d.name;
    btn.dataset.key = d.key;
    btn.setAttribute('aria-selected', d.key === planCurrentDayKey);
    btn.addEventListener('click', () => {
      planCurrentDayKey = d.key;
      renderPlanNav();
      renderPlanContent();
    });
    nav.appendChild(btn);
  });
}

function renderPlanContent() {
  const day = PROGRAM.find(p => p.key === planCurrentDayKey);
  const container = document.getElementById('planContent');

  let html = `
    <div class="day-block">
      <h2 class="day-title">${day.title}</h2>
      <div class="day-subtitle">${day.subtitle}</div>
    </div>
  `;

  if (day.rest) {
    html += `
      <div class="rest-card">
        <div class="icon">~</div>
        <div class="label">${day.rest.label}</div>
        <div class="detail">${day.rest.detail}</div>
      </div>
    `;
  } else {
    html += `<div class="plan-list">`;
    day.sections.forEach((section) => {
      html += `
        <div class="plan-section">
          <div class="section-label">
            <div class="section-num">${section.label}</div>
            <div class="section-name">${section.name}</div>
          </div>
      `;
      if (section.cardio) {
        html += `
          <div class="cardio-block">
            <div class="cardio-row">
              <div class="cardio-label">Week A</div>
              <div class="cardio-detail">Incline Walk · 30–45 min<br><span style="color:var(--text-faint); font-size:12px;">3.0 mph @ 10–12% incline</span></div>
            </div>
            <div class="cardio-row">
              <div class="cardio-label">Week B</div>
              <div class="cardio-detail">Intervals · ~21 min<br><span style="color:var(--text-faint); font-size:12px;">1 min hard / 2 min easy × 7</span></div>
            </div>
          </div>
        `;
      } else {
        section.exercises.forEach((ex) => {
          html += `
            <div class="plan-row">
              <div class="plan-name">${ex.name}${ex.added ? '<span class="added">NEW</span>' : ''}${ex.note ? `<div style="font-size:12px; color:var(--text-faint); font-style:italic; margin-top:4px;">${ex.note}</div>` : ''}</div>
              <div class="plan-prescription">${ex.prescription}</div>
            </div>
          `;
        });
      }
      html += `</div>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

// ---------- Tab switching ----------
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.dataset.active = p.dataset.tab === name;
  });
  document.querySelectorAll('.tab-bar button').forEach(b => {
    b.dataset.active = b.dataset.tabBtn === name;
  });
  if (name === 'history') refreshHistory();
  if (name === 'today') renderToday();
  if (name === 'plan') { renderPlanNav(); renderPlanContent(); }
  window.scrollTo({ top: 0 });
}

document.querySelectorAll('.tab-bar button').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tabBtn));
});

// ---------- Init ----------
renderToday();
renderPlanNav();
renderPlanContent();