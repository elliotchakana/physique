"use client";
import { useState, useEffect, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────

const T = {
  bg: "#f3f1ec",
  card: "rgba(255,255,255,0.55)",
  cardBorder: "rgba(90,158,114,0.15)",
  cardSolid: "rgba(255,255,255,0.7)",
  glass: "blur(20px) saturate(1.4)",
  green: "#4a8c5c",
  greenLight: "#5a9e72",
  greenFaint: "rgba(90,158,114,0.10)",
  greenBorder: "rgba(90,158,114,0.25)",
  text: "#1a1a1a",
  textSoft: "#555",
  textMuted: "#999",
  divider: "rgba(90,158,114,0.12)",
  inputBg: "rgba(255,255,255,0.6)",
  inputBorder: "rgba(0,0,0,0.08)",
  radius: 16,
  radiusSm: 10,
};

const glassCard = {
  background: T.card,
  backdropFilter: T.glass,
  WebkitBackdropFilter: T.glass,
  border: `1px solid ${T.cardBorder}`,
  borderRadius: T.radius,
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const PROGRAM = {
  "Day 1": {
    label: "Day 1",
    subtitle: "Upper Body Shape",
    focus: ["Lateral delts", "Upper chest", "Lower traps", "Lower abs"],
    exercises: [
      {
        id: "incline-press",
        name: "Incline Dumbbell Press",
        purpose: "Upper chest without lower-chest thickness",
        sets: 4, repRange: "6–8", restSeconds: 105,
        tempo: "3 sec down, controlled up",
        priority: "upper_chest",
        track: ["weight","reps","RIR"],
        cues: ["Shoulders down and back", "No shrugging"],
        variants: null,
      },
      {
        id: "lateral-raise",
        name: "Cable Lateral Raise",
        altName: "Dumbbell Lateral Raise",
        purpose: "Shoulder width — delt cap",
        sets: 4, repRange: "12–15", restSeconds: 52,
        tempo: "2 sec up, 2–3 sec down",
        priority: "lateral_delt",
        track: ["weight","reps"],
        cues: ["Raise out, not up", "Stop at shoulder height", "Neck relaxed"],
        finisherNote: "Last set: 5–8 top-half partials after full reps",
        variants: [
          { id: "cable", label: "Cable" },
          { id: "dumbbell", label: "Dumbbell" },
        ],
        activeVariant: "cable",
      },
      {
        id: "pull-ups",
        name: "Pull-Ups",
        purpose: "Back width and torso balance",
        sets: 4, repRange: "6–8", restSeconds: 105,
        tempo: null,
        priority: "back",
        track: ["weight","reps"],
        cues: ["Depress scapula before pulling", "Avoid neck tension"],
        variants: [
          { id: "bodyweight", label: "Bodyweight" },
          { id: "weighted", label: "+Weight" },
          { id: "assisted", label: "Assisted" },
        ],
        activeVariant: "bodyweight",
      },
      {
        id: "prone-y",
        name: "Prone Y Raise",
        purpose: "Lower traps — reduce upper-trap dominance",
        sets: 3, repRange: "10", restSeconds: 52,
        tempo: "Slow and strict",
        priority: "lower_trap",
        track: ["reps"],
        cues: ["Shoulder blades into back pockets", "Thumbs up"],
        note: "Technique exercise. Light load only.",
        variants: null,
      },
      {
        id: "hanging-leg",
        name: "Hanging Leg Raise",
        altName: "Hanging Knee Raise",
        purpose: "Lower abs, posterior pelvic tilt",
        sets: 3, repRange: "10–12", restSeconds: 52,
        tempo: null,
        priority: "core",
        track: ["reps"],
        cues: ["Curl pelvis upward", "No swinging", "Tailbone toward ribs"],
        variants: [
          { id: "legs", label: "Legs" },
          { id: "knees", label: "Knees (reg.)" },
        ],
        activeVariant: "legs",
      },
    ],
    finisher: {
      label: "12-Min Shoulder Finisher",
      blocks: [
        { time: "0–4 min", move: "Lateral Raise", detail: "12–15 reps/side, alternate arms" },
        { time: "4–8 min", move: "Chest-Supported Rear Delt Fly", detail: "12–15 reps" },
        { time: "8–10 min", move: "Face Pull", detail: "12–15 reps" },
        { time: "10–12 min", move: "Prone Y Raise", detail: "10–12 slow reps" },
      ],
      cues: ["Long neck", "Shoulders down", "Delt burn, not trap burn"],
    },
  },
  "Day 2": {
    label: "Day 2",
    subtitle: "Posterior Chain + Shoulder Balance",
    focus: ["Rear delts", "Posterior chain", "Posture", "Core"],
    exercises: [
      {
        id: "rdl",
        name: "Romanian Deadlift",
        purpose: "Posterior chain, glutes, hamstrings, posture",
        sets: 4, repRange: "6–8", restSeconds: 105,
        tempo: null,
        priority: "posterior",
        track: ["weight","reps","RIR"],
        cues: ["Hips back", "Ribs down", "Neutral spine"],
        variants: null,
      },
      {
        id: "bss",
        name: "Bulgarian Split Squat",
        purpose: "Glutes, legs, pelvic control",
        sets: 3, repRange: "8 / leg", restSeconds: 75,
        tempo: null,
        priority: "legs",
        track: ["weight","reps"],
        cues: ["Slight torso lean", "Push through front heel"],
        note: "Dumbbell-based.",
        variants: null,
      },
      {
        id: "face-pull",
        name: "Face Pull",
        purpose: "Rear delts, mid/lower trap, posture",
        sets: 3, repRange: "12–15", restSeconds: 52,
        tempo: null,
        priority: "rear_delt",
        track: ["weight","reps"],
        cues: ["Pull to forehead", "Slight pull-apart at end", "No shrugging"],
        variants: null,
      },
      {
        id: "rear-delt-fly",
        name: "Rear Delt Fly",
        purpose: "3D shoulder shape and roundness",
        sets: 3, repRange: "12–15", restSeconds: 52,
        tempo: null,
        priority: "rear_delt",
        track: ["weight","reps"],
        cues: ["Open wide", "Do not row", "Chest supported if possible"],
        note: "Preferred: chest-supported.",
        variants: null,
      },
      {
        id: "rkc-plank",
        name: "RKC Plank",
        purpose: "Deep core tension, flatter lower abdomen",
        sets: 3, repRange: "20–30 sec", restSeconds: 52,
        tempo: null,
        priority: "core",
        track: ["duration"],
        cues: ["Squeeze glutes", "Ribs down", "Pull elbows toward toes"],
        note: "If you can hold >45 sec easily, tension is too low.",
        variants: null,
      },
    ],
    finisher: null,
  },
};

const MOBILITY = [
  { name: "Doorway Pec Stretch", sets: 2, duration: "30–45 sec" },
  { name: "Upper Trap Stretch", sets: "1–2", duration: "30 sec / side" },
  { name: "Lat Stretch on Bench", sets: "1–2", duration: "40 sec" },
  { name: "Couch Stretch", sets: "1–2", duration: "30–45 sec / side" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getNextDay(log) {
  if (!log.length) return "Day 1";
  const last = log[log.length - 1].day;
  return last === "Day 1" ? "Day 2" : "Day 1";
}

function formatDuration(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────

function getHistory(exerciseId) {
  try {
    const raw = localStorage.getItem(`physique_${exerciseId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSetLog(exerciseId, setData) {
  try {
    const history = getHistory(exerciseId);
    history.push({ ...setData, date: new Date().toISOString() });
    // keep last 50 entries per exercise
    const trimmed = history.slice(-50);
    localStorage.setItem(`physique_${exerciseId}`, JSON.stringify(trimmed));
  } catch {}
}

function getLastWeight(exerciseId) {
  const history = getHistory(exerciseId);
  // find most recent entry that has weight
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].weight) return history[i];
  }
  return null;
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────

function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => { setRemaining(seconds); }, [seconds]);

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(ref.current); onDone?.(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [seconds]);

  const pct = (remaining / seconds) * 100;
  const r = 22, circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={60} height={60} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={30} cy={30} r={r} fill="none" stroke={T.greenFaint} strokeWidth={4} />
        <circle cx={30} cy={30} r={r} fill="none" stroke={T.green} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <span style={{ marginTop: -46, position: "absolute", fontSize: 13, color: T.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {formatDuration(remaining)}
      </span>
      <span style={{ marginTop: 6, fontSize: 11, color: T.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>Rest</span>
    </div>
  );
}

// ─── SET LOG ROW ──────────────────────────────────────────────────────────────

function SetRow({ setNum, track, onLog, defaults }) {
  const [vals, setVals] = useState(defaults || {});
  const [done, setDone] = useState(false);
  const RIR_OPTIONS = [0, 1, 2, 3];
  const handleLog = () => { setDone(true); onLog({ set: setNum, ...vals }); };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "28px 1fr auto",
      alignItems: "center", gap: 8,
      padding: "8px 0",
      borderBottom: `1px solid ${T.divider}`,
      opacity: done ? 0.4 : 1,
      transition: "opacity 0.3s",
    }}>
      <span style={{ fontSize: 12, color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>
        {setNum.toString().padStart(2, "0")}
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {track.includes("weight") && (
          <input type="number" placeholder="kg" min={0}
            value={vals.weight || ""}
            onChange={e => setVals(v => ({ ...v, weight: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("reps") && (
          <input type="number" placeholder="reps" min={0}
            value={vals.reps || ""}
            onChange={e => setVals(v => ({ ...v, reps: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("duration") && (
          <input type="number" placeholder="sec" min={0}
            value={vals.duration || ""}
            onChange={e => setVals(v => ({ ...v, duration: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("RIR") && (
          <div style={{ display: "flex", gap: 4 }}>
            {RIR_OPTIONS.map(r => (
              <button key={r} onClick={() => setVals(v => ({ ...v, rir: r }))}
                style={{
                  ...pillStyle,
                  background: vals.rir === r ? T.green : "rgba(255,255,255,0.5)",
                  color: vals.rir === r ? "#fff" : T.textSoft,
                }}>
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleLog} disabled={done}
        style={{
          width: 28, height: 28, borderRadius: "50%",
          border: done ? "none" : `1px solid ${T.greenBorder}`,
          background: done ? T.green : "rgba(255,255,255,0.4)",
          color: done ? "#fff" : T.textMuted,
          cursor: done ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, transition: "all 0.2s",
        }}>
        {done ? "✓" : "○"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: 60, padding: "6px 8px",
  background: T.inputBg, border: `1px solid ${T.inputBorder}`,
  color: T.text, fontSize: 13,
  borderRadius: 8, outline: "none",
  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
};

const pillStyle = {
  padding: "4px 10px", borderRadius: 20, border: `1px solid ${T.greenBorder}`,
  fontSize: 11, cursor: "pointer",
  transition: "all 0.15s",
  background: "rgba(255,255,255,0.4)",
  color: T.textSoft,
};

// ─── EXERCISE IMAGES ──────────────────────────────────────────────────────────

const EXERCISE_IMG_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const EXERCISE_IMAGES = {
  "incline-press": [`${EXERCISE_IMG_BASE}/Incline_Dumbbell_Press/0.jpg`, `${EXERCISE_IMG_BASE}/Incline_Dumbbell_Press/1.jpg`],
  "lateral-raise": [`${EXERCISE_IMG_BASE}/Cable_Seated_Lateral_Raise/0.jpg`, `${EXERCISE_IMG_BASE}/Cable_Seated_Lateral_Raise/1.jpg`],
  "pull-ups": [`${EXERCISE_IMG_BASE}/Chin-Up/0.jpg`, `${EXERCISE_IMG_BASE}/Chin-Up/1.jpg`],
  "prone-y": [`${EXERCISE_IMG_BASE}/Face_Pull/0.jpg`, `${EXERCISE_IMG_BASE}/Face_Pull/1.jpg`],
  "hanging-leg": [`${EXERCISE_IMG_BASE}/Hanging_Leg_Raise/0.jpg`, `${EXERCISE_IMG_BASE}/Hanging_Leg_Raise/1.jpg`],
  "rdl": [`${EXERCISE_IMG_BASE}/Barbell_Deadlift/0.jpg`, `${EXERCISE_IMG_BASE}/Barbell_Deadlift/1.jpg`],
  "bss": [`${EXERCISE_IMG_BASE}/Dumbbell_Lunges/0.jpg`, `${EXERCISE_IMG_BASE}/Dumbbell_Lunges/1.jpg`],
  "face-pull": [`${EXERCISE_IMG_BASE}/Face_Pull/0.jpg`, `${EXERCISE_IMG_BASE}/Face_Pull/1.jpg`],
  "rear-delt-fly": [`${EXERCISE_IMG_BASE}/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench/0.jpg`, `${EXERCISE_IMG_BASE}/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench/1.jpg`],
  "rkc-plank": null,
};

function ExerciseImage({ exerciseId }) {
  const images = EXERCISE_IMAGES[exerciseId];
  if (!images) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {images.map((src, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: T.radiusSm, overflow: "hidden",
          background: "rgba(255,255,255,0.3)", border: `1px solid ${T.cardBorder}`,
          aspectRatio: "3/4",
        }}>
          <img src={src} alt={`${exerciseId} position ${i + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      ))}
    </div>
  );
}

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────

function ExerciseCard({ ex: exProp, idx }) {
  const [ex, setEx] = useState(exProp);
  const [expanded, setExpanded] = useState(idx === 0);
  const [timerKey, setTimerKey] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastUsed] = useState(() => getLastWeight(exProp.id));

  const completedSets = logs.length;
  const allDone = completedSets >= ex.sets;

  const toggleVariant = (vid) => {
    setEx(e => ({ ...e, activeVariant: vid,
      name: vid === "knees" ? ex.altName : vid === "dumbbell" ? ex.altName : exProp.name
    }));
  };

  return (
    <div style={{
      ...glassCard,
      marginBottom: 12, overflow: "hidden",
      borderColor: allDone ? T.greenBorder : T.cardBorder,
      transition: "border-color 0.3s",
    }}>
      {/* Header */}
      <div onClick={() => setExpanded(e => !e)}
        style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: allDone ? T.green : T.divider,
          transition: "background 0.3s", flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
              {ex.name}
            </span>
            <span style={{ fontSize: 11, color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>
              {ex.sets}×{ex.repRange}
            </span>
          </div>
          <div style={{ fontSize: 11, color: T.textSoft, marginTop: 2 }}>{ex.purpose}</div>
          {lastUsed && lastUsed.weight && (
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 3 }}>
              Last: {lastUsed.weight}kg{lastUsed.reps ? ` × ${lastUsed.reps}` : ""}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            {completedSets}/{ex.sets}
          </span>
          <span style={{ color: T.textMuted, fontSize: 12, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>

          {/* Variants */}
          {ex.variants && (
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {ex.variants.map(v => (
                <button key={v.id} onClick={() => toggleVariant(v.id)}
                  style={{
                    ...pillStyle,
                    background: ex.activeVariant === v.id ? T.greenFaint : "rgba(255,255,255,0.4)",
                    color: ex.activeVariant === v.id ? T.green : T.textSoft,
                    borderColor: ex.activeVariant === v.id ? T.greenBorder : T.inputBorder,
                    fontWeight: ex.activeVariant === v.id ? 600 : 400,
                  }}>
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* Exercise demo */}
          <ExerciseImage exerciseId={ex.id} />

          {/* Cues */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {ex.cues.map((c, i) => (
              <span key={i} style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 20,
                background: T.greenFaint, color: T.green,
                letterSpacing: 0.5,
              }}>{c}</span>
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {ex.tempo && (
              <div>
                <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Tempo</div>
                <div style={{ fontSize: 11, color: T.textSoft }}>{ex.tempo}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Rest</div>
              <div style={{ fontSize: 11, color: T.textSoft }}>{formatDuration(ex.restSeconds)}</div>
            </div>
          </div>

          {/* Notes */}
          {(ex.note || ex.finisherNote) && (
            <div style={{ fontSize: 11, color: T.textSoft, fontStyle: "italic", marginBottom: 14, paddingLeft: 10, borderLeft: `2px solid ${T.greenBorder}` }}>
              {ex.note || ex.finisherNote}
            </div>
          )}

          {/* Set rows */}
          <div style={{ marginBottom: 14 }}>
            {Array.from({ length: ex.sets }, (_, i) => (
              <SetRow key={i} setNum={i + 1} track={ex.track}
                defaults={lastUsed ? { weight: lastUsed.weight, reps: lastUsed.reps } : undefined}
                onLog={(data) => {
                  setLogs(l => [...l, data]);
                  saveSetLog(ex.id, data);
                  if (i + 1 < ex.sets) setTimerKey(Date.now());
                }} />
            ))}
          </div>

          {/* Rest timer */}
          {timerKey && !allDone && (
            <div style={{ display: "flex", justifyContent: "center", position: "relative", paddingTop: 8 }}>
              <RestTimer key={timerKey} seconds={ex.restSeconds} onDone={() => setTimerKey(null)} />
            </div>
          )}

          {allDone && (
            <div style={{ textAlign: "center", padding: "6px 0", fontSize: 11, color: T.green, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
              ✓ Complete
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FINISHER CARD ────────────────────────────────────────────────────────────

function FinisherCard({ finisher }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...glassCard, marginBottom: 12, border: `1px dashed ${T.greenBorder}` }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 12, color: T.green, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
            + {finisher.label}
          </span>
          <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>Optional · After Day 1</div>
        </div>
        <span style={{ color: T.textMuted, fontSize: 12 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {finisher.blocks.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.divider}` }}>
              <span style={{ fontSize: 10, color: T.green, minWidth: 56, fontVariantNumeric: "tabular-nums" }}>{b.time}</span>
              <div>
                <div style={{ fontSize: 12, color: T.text }}>{b.move}</div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{b.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {finisher.cues.map((c, i) => (
              <span key={i} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: T.greenFaint, color: T.green }}>{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MOBILITY SECTION ─────────────────────────────────────────────────────────

function MobilitySection() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...glassCard, marginTop: 20 }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: T.textSoft, letterSpacing: 2, textTransform: "uppercase" }}>Stretch / Mobility</span>
        <span style={{ color: T.textMuted, fontSize: 12 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {MOBILITY.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.divider}`, fontSize: 12 }}>
              <span style={{ color: T.text }}>{m.name}</span>
              <span style={{ color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>{m.sets}×{m.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

function HomeScreen({ sessionLog, onStart }) {
  const [bw, setBw] = useState("");
  const [energy, setEnergy] = useState(null);
  const [selectedDay, setSelectedDay] = useState(() => getNextDay(sessionLog));
  const dayData = PROGRAM[selectedDay];

  const weekLog = sessionLog.slice(-7);
  const totalSessions = sessionLog.length;

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Hero */}
      <div style={{ padding: "32px 20px 24px", borderBottom: `1px solid ${T.divider}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 4, textTransform: "uppercase" }}>
            Today
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Day 1", "Day 2"].map(d => (
              <button key={d} onClick={() => setSelectedDay(d)}
                style={{
                  ...pillStyle,
                  background: selectedDay === d ? T.green : "rgba(255,255,255,0.5)",
                  color: selectedDay === d ? "#fff" : T.textSoft,
                  borderColor: selectedDay === d ? T.green : T.inputBorder,
                  fontWeight: selectedDay === d ? 600 : 400,
                }}>{d}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-1px", lineHeight: 1 }}>
            {dayData.label}
          </h1>
          <span style={{ fontSize: 14, color: T.textMuted }}>—</span>
          <span style={{ fontSize: 13, color: T.textSoft }}>{dayData.subtitle}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {dayData.focus.map((f, i) => (
            <span key={i} style={{
              fontSize: 10, padding: "4px 12px", borderRadius: 20,
              background: T.greenFaint, color: T.green, fontWeight: 500,
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Weekly snapshot */}
      <div style={{ padding: "20px 20px 0", display: "flex", gap: 12 }}>
        {[
          { label: "Total Sessions", val: totalSessions },
          { label: "This Week", val: weekLog.length },
        ].map((s, i) => (
          <div key={i} style={{ ...glassCard, flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.green, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pre-session inputs */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
          Pre-Session
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <input type="number" placeholder="Bodyweight (kg)" value={bw} onChange={e => setBw(e.target.value)}
            style={{ ...inputStyle, width: 140, padding: "10px 14px", fontSize: 14 }} />
          <span style={{ fontSize: 11, color: T.textMuted }}>kg</span>
        </div>
        <div style={{ marginBottom: 6, fontSize: 10, color: T.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>Energy</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Low", "Mid", "High", "Locked in"].map((e, i) => (
            <button key={e} onClick={() => setEnergy(e)}
              style={{
                ...pillStyle,
                background: energy === e ? T.greenFaint : "rgba(255,255,255,0.5)",
                color: energy === e ? T.green : T.textSoft,
                borderColor: energy === e ? T.greenBorder : T.inputBorder,
                fontWeight: energy === e ? 600 : 400,
              }}>{e}</button>
          ))}
        </div>
      </div>

      {/* Start */}
      <div style={{ padding: "28px 20px 0" }}>
        <button onClick={() => onStart(selectedDay, bw, energy)}
          style={{
            width: "100%", padding: "16px 0", borderRadius: T.radius,
            background: T.green, border: "none", color: "#fff",
            fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(90,158,114,0.3)",
          }}>
          Start {dayData.label}
        </button>
      </div>

      {/* History */}
      {sessionLog.length > 0 && (
        <div style={{ padding: "28px 20px 0" }}>
          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Recent
          </div>
          {sessionLog.slice(-4).reverse().map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.divider}`, fontSize: 12 }}>
              <span style={{ color: T.text, fontWeight: 500 }}>{s.day}</span>
              <span style={{ color: T.textMuted }}>{s.date}</span>
              {s.bw && <span style={{ color: T.textSoft }}>{s.bw}kg</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WORKOUT SCREEN ───────────────────────────────────────────────────────────

function WorkoutScreen({ dayKey, bw, energy, onFinish }) {
  const dayData = PROGRAM[dayKey];
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  const handleFinish = () => {
    const duration = Math.round(elapsed / 60);
    onFinish({ day: dayKey, date: new Date().toLocaleDateString(), bw, energy, duration });
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${T.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>
            {dayData.label} <span style={{ fontWeight: 400, color: T.textSoft, fontSize: 14 }}>— {dayData.subtitle}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, color: T.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            {formatDuration(elapsed)}
          </div>
          {energy && <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{energy}</div>}
        </div>
      </div>

      {/* Global cues banner */}
      <div style={{
        padding: "10px 20px",
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", gap: 8, overflowX: "auto",
        borderBottom: `1px solid ${T.divider}`,
      }}>
        {["Long neck", "Shoulders down", "Ribs down", "Controlled eccentrics"].map((c, i) => (
          <span key={i} style={{
            fontSize: 9, whiteSpace: "nowrap", padding: "3px 10px", borderRadius: 20,
            background: T.greenFaint, color: T.green,
            letterSpacing: 1, textTransform: "uppercase",
          }}>{c}</span>
        ))}
      </div>

      {/* Exercises */}
      <div style={{ padding: "16px 20px 0" }}>
        {dayData.exercises.map((ex, i) => (
          <ExerciseCard key={ex.id} ex={ex} idx={i} />
        ))}
        {dayData.finisher && <FinisherCard finisher={dayData.finisher} />}
        <MobilitySection />
      </div>

      {/* Finish button */}
      <div style={{ padding: "24px 20px 0" }}>
        <button onClick={handleFinish}
          style={{
            width: "100%", padding: "14px 0", borderRadius: T.radius,
            background: "rgba(255,255,255,0.5)", border: `1px solid ${T.greenBorder}`,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            color: T.green,
            fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
            cursor: "pointer",
          }}>
          End Session
        </button>
      </div>
    </div>
  );
}

// ─── SUMMARY SCREEN ───────────────────────────────────────────────────────────

function SummaryScreen({ session, onHome }) {
  return (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, color: T.green, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Session Complete</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: T.text, letterSpacing: "-1px", lineHeight: 1 }}>{session.day}</div>
        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>{session.date}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Duration", val: `${session.duration} min` },
          { label: "Bodyweight", val: session.bw ? `${session.bw} kg` : "—" },
          { label: "Energy", val: session.energy || "—" },
        ].map((s, i) => (
          <div key={i} style={{ ...glassCard, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, color: T.green, fontWeight: 700 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onHome}
        style={{
          width: "100%", padding: "16px 0", borderRadius: T.radius,
          background: T.green, border: "none", color: "#fff",
          fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(90,158,114,0.3)",
        }}>
        Back to Home
      </button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [sessionLog, setSessionLog] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [lastSession, setLastSession] = useState(null);

  const handleStart = (dayKey, bw, energy) => {
    setActiveSession({ dayKey, bw, energy });
    setScreen("workout");
  };

  const handleFinish = (sessionData) => {
    setLastSession(sessionData);
    setSessionLog(l => [...l, sessionData]);
    setActiveSession(null);
    setScreen("summary");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
      maxWidth: 480, margin: "0 auto",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        html { -webkit-text-size-adjust: 100%; background: ${T.bg}; }
        body { background: ${T.bg}; }
        input:focus { border-color: ${T.greenBorder} !important; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {/* Nav bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(243,241,236,0.75)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: `1px solid ${T.divider}`,
        padding: "14px 20px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: T.text }}>
            PHYSIQUE
          </span>
        </div>
        {screen !== "home" && (
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: T.textSoft, cursor: "pointer", fontSize: 12, letterSpacing: 1, fontWeight: 500 }}>
            ← HOME
          </button>
        )}
      </div>

      {screen === "home" && (
        <HomeScreen sessionLog={sessionLog} onStart={handleStart} />
      )}
      {screen === "workout" && activeSession && (
        <WorkoutScreen
          dayKey={activeSession.dayKey}
          bw={activeSession.bw}
          energy={activeSession.energy}
          onFinish={handleFinish}
        />
      )}
      {screen === "summary" && lastSession && (
        <SummaryScreen session={lastSession} onHome={() => setScreen("home")} />
      )}
    </div>
  );
}
