"use client";
import { useState, useEffect, useRef } from "react";

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
        gifSearch: "incline dumbbell press chest workout",
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
        gifSearch: "lateral raise shoulder exercise dumbbell",
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
        gifSearch: "pull ups back workout gym",
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
        gifSearch: "prone Y raise lower trap exercise",
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
        gifSearch: "hanging leg raise abs core workout",
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
        gifSearch: "romanian deadlift RDL hamstring exercise",
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
        gifSearch: "bulgarian split squat dumbbell glutes",
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
        gifSearch: "face pull cable rear delt exercise",
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
        gifSearch: "rear delt fly chest supported dumbbell",
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
        gifSearch: "RKC plank hardstyle core exercise",
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

const PRIORITY_COLOR = {
  upper_chest: "#5a9e72",
  lateral_delt: "#5a9e72",
  rear_delt: "#5a9e72",
  lower_trap: "#7ab896",
  core: "#7ab896",
  posterior: "#a8ccb8",
  back: "#a8ccb8",
  legs: "#a8ccb8",
};

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

// ─── REST TIMER ───────────────────────────────────────────────────────────────

function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

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
        <circle cx={30} cy={30} r={r} fill="none" stroke="#1c2e20" strokeWidth={4} />
        <circle cx={30} cy={30} r={r} fill="none" stroke="#5a9e72" strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <span style={{ marginTop: -46, position: "absolute", fontFamily: "monospace", fontSize: 13, color: "#5a9e72", fontWeight: 700 }}>
        {formatDuration(remaining)}
      </span>
      <span style={{ marginTop: 6, fontSize: 11, color: "#7a9e80", letterSpacing: 2, textTransform: "uppercase" }}>Rest</span>
    </div>
  );
}

// ─── SET LOG ROW ──────────────────────────────────────────────────────────────

function SetRow({ setNum, track, onLog }) {
  const [vals, setVals] = useState({});
  const [done, setDone] = useState(false);

  const RIR_OPTIONS = [0, 1, 2, 3];

  const handleLog = () => {
    setDone(true);
    onLog({ set: setNum, ...vals });
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "28px 1fr auto",
      alignItems: "center", gap: 8,
      padding: "8px 0",
      borderBottom: "1px solid #1a2e1e",
      opacity: done ? 0.45 : 1,
      transition: "opacity 0.3s",
    }}>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#4a6e52" }}>
        {setNum.toString().padStart(2, "0")}
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {track.includes("weight") && (
          <input type="number" placeholder="kg" min={0}
            onChange={e => setVals(v => ({ ...v, weight: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("reps") && (
          <input type="number" placeholder="reps" min={0}
            onChange={e => setVals(v => ({ ...v, reps: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("duration") && (
          <input type="number" placeholder="sec" min={0}
            onChange={e => setVals(v => ({ ...v, duration: e.target.value }))}
            style={inputStyle} />
        )}
        {track.includes("RIR") && (
          <div style={{ display: "flex", gap: 4 }}>
            {RIR_OPTIONS.map(r => (
              <button key={r} onClick={() => setVals(v => ({ ...v, rir: r }))}
                style={{
                  ...pillStyle,
                  background: vals.rir === r ? "#5a9e72" : "#1a2e1e",
                  color: vals.rir === r ? "#000" : "#7a9e80",
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
          border: done ? "none" : "1px solid #2a3d2e",
          background: done ? "#5a9e72" : "transparent",
          color: done ? "#000" : "#4a6e52",
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
  width: 60, padding: "4px 6px",
  background: "#0e1810", border: "1px solid #1c2e20",
  color: "#eef2ee", fontFamily: "monospace", fontSize: 13,
  borderRadius: 4, outline: "none",
};

const pillStyle = {
  padding: "3px 8px", borderRadius: 4, border: "1px solid #1c2e20",
  fontFamily: "monospace", fontSize: 11, cursor: "pointer",
  transition: "all 0.15s",
};

// ─── EXERCISE GIF ─────────────────────────────────────────────────────────────

const GIF_CACHE = {};

function ExerciseGif({ searchQuery }) {
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;
    if (GIF_CACHE[searchQuery]) {
      setGifUrl(GIF_CACHE[searchQuery]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    const encoded = encodeURIComponent(searchQuery);
    fetch(`https://tenor.googleapis.com/v2/search?q=${encoded}&key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&client_key=physique_app&limit=3`)
      .then(r => r.json())
      .then(data => {
        const results = data?.results;
        if (results && results.length > 0) {
          const pick = results[Math.min(1, results.length - 1)];
          const url = pick.media_formats?.tinygif?.url || pick.media_formats?.gif?.url;
          if (url) {
            GIF_CACHE[searchQuery] = url;
            setGifUrl(url);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  if (error) return null;

  return (
    <div style={{
      width: "100%", borderRadius: 6, overflow: "hidden",
      marginBottom: 14, background: "#0e1810",
      aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid #1a2e1e",
    }}>
      {loading ? (
        <div style={{ fontSize: 10, color: "#2a3d2e", letterSpacing: 2, textTransform: "uppercase" }}>
          Loading…
        </div>
      ) : gifUrl ? (
        <img src={gifUrl} alt={searchQuery}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : null}
    </div>
  );
}

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────

function ExerciseCard({ ex: exProp, idx }) {
  const [ex, setEx] = useState(exProp);
  const [expanded, setExpanded] = useState(idx === 0);
  const [timerKey, setTimerKey] = useState(null);
  const [logs, setLogs] = useState([]);

  const accentColor = PRIORITY_COLOR[ex.priority] || "#5a9e72";
  const completedSets = logs.length;
  const allDone = completedSets >= ex.sets;

  const toggleVariant = (vid) => {
    setEx(e => ({ ...e, activeVariant: vid,
      name: vid === "knees" ? ex.altName : vid === "dumbbell" ? ex.altName : exProp.name
    }));
  };

  return (
    <div style={{
      background: "#131f16", border: `1px solid ${allDone ? accentColor + "55" : "#1c2e20"}`,
      borderRadius: 8, marginBottom: 12, overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      {/* Header */}
      <div onClick={() => setExpanded(e => !e)}
        style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: allDone ? accentColor : "#2a3d2e",
          transition: "background 0.3s", flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#f2f4f1", letterSpacing: "-0.3px" }}>
              {ex.name}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#4a6e52" }}>
              {ex.sets}×{ex.repRange}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#4a6e52", marginTop: 2 }}>{ex.purpose}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: accentColor }}>
            {completedSets}/{ex.sets}
          </span>
          <span style={{ color: "#2a3d2e", fontSize: 12, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
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
                    background: ex.activeVariant === v.id ? accentColor + "22" : "transparent",
                    color: ex.activeVariant === v.id ? accentColor : "#4a6e52",
                    borderColor: ex.activeVariant === v.id ? accentColor + "55" : "#1c2e20",
                  }}>
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* GIF demo */}
          {ex.gifSearch && <ExerciseGif searchQuery={ex.gifSearch} />}

          {/* Cues */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {ex.cues.map((c, i) => (
              <span key={i} style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 3,
                background: "#1a2e1e", color: "#8aaa8e",
                letterSpacing: 1, textTransform: "uppercase",
              }}>{c}</span>
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {ex.tempo && (
              <div>
                <div style={{ fontSize: 9, color: "#2a3d2e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Tempo</div>
                <div style={{ fontSize: 11, color: "#8aaa8e", fontFamily: "monospace" }}>{ex.tempo}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, color: "#2a3d2e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Rest</div>
              <div style={{ fontSize: 11, color: "#8aaa8e", fontFamily: "monospace" }}>{formatDuration(ex.restSeconds)}</div>
            </div>
          </div>

          {/* Notes */}
          {(ex.note || ex.finisherNote) && (
            <div style={{ fontSize: 11, color: "#7a9e80", fontStyle: "italic", marginBottom: 14, paddingLeft: 8, borderLeft: "2px solid #1c2e20" }}>
              {ex.note || ex.finisherNote}
            </div>
          )}

          {/* Set rows */}
          <div style={{ marginBottom: 14 }}>
            {Array.from({ length: ex.sets }, (_, i) => (
              <SetRow key={i} setNum={i + 1} track={ex.track}
                onLog={(data) => {
                  setLogs(l => [...l, data]);
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
            <div style={{ textAlign: "center", padding: "6px 0", fontSize: 11, color: accentColor, letterSpacing: 2, textTransform: "uppercase" }}>
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
    <div style={{ border: "1px dashed #1c2e20", borderRadius: 8, marginBottom: 12 }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 12, color: "#5a9e72", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            + {finisher.label}
          </span>
          <div style={{ fontSize: 10, color: "#2a3d2e", marginTop: 2 }}>Optional · After Day 1</div>
        </div>
        <span style={{ color: "#2a3d2e", fontSize: 12 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {finisher.blocks.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #131f16" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "#5a9e72", minWidth: 56 }}>{b.time}</span>
              <div>
                <div style={{ fontSize: 12, color: "#d0ddd2" }}>{b.move}</div>
                <div style={{ fontSize: 10, color: "#4a6e52", marginTop: 2 }}>{b.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {finisher.cues.map((c, i) => (
              <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: "#1a2e1e", color: "#5a9e7244", border: "1px solid #5a9e7222", letterSpacing: 1, textTransform: "uppercase" }}>{c}</span>
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
    <div style={{ border: "1px solid #172b1b", borderRadius: 8, marginTop: 20 }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#7a9e80", letterSpacing: 2, textTransform: "uppercase" }}>Stretch / Mobility</span>
        <span style={{ color: "#2a3d2e", fontSize: 12 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {MOBILITY.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #131f16", fontSize: 12 }}>
              <span style={{ color: "#c2d4c4" }}>{m.name}</span>
              <span style={{ fontFamily: "monospace", color: "#4a6e52" }}>{m.sets}×{m.duration}</span>
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
  const todayDay = getNextDay(sessionLog);
  const dayData = PROGRAM[todayDay];

  const weekLog = sessionLog.slice(-7);
  const totalSessions = sessionLog.length;

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Hero */}
      <div style={{ padding: "32px 20px 24px", borderBottom: "1px solid #1a2e1e" }}>
        <div style={{ fontSize: 10, color: "#4a6e52", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
          Today
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#f3f5f2", margin: 0, letterSpacing: "-1px", lineHeight: 1 }}>
            {dayData.label}
          </h1>
          <span style={{ fontSize: 14, color: "#7a9e80" }}>—</span>
          <span style={{ fontSize: 13, color: "#7a9e80" }}>{dayData.subtitle}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {dayData.focus.map((f, i) => (
            <span key={i} style={{
              fontSize: 10, padding: "3px 10px", borderRadius: 20,
              border: "1px solid #1c2e20", color: "#7a9e80", letterSpacing: 1, textTransform: "uppercase",
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Weekly snapshot */}
      <div style={{ padding: "20px 20px 0", display: "flex", gap: 16 }}>
        {[
          { label: "Total Sessions", val: totalSessions },
          { label: "This Week", val: weekLog.length },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 16px", background: "#131f16", borderRadius: 8, border: "1px solid #172b1b" }}>
            <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#5a9e72", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#4a6e52", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pre-session inputs */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 10, color: "#2a3d2e", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
          Pre-Session
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <input type="number" placeholder="Bodyweight (kg)" value={bw} onChange={e => setBw(e.target.value)}
            style={{ ...inputStyle, width: 140, padding: "8px 12px", fontSize: 14 }} />
          <span style={{ fontSize: 11, color: "#2a3d2e" }}>kg</span>
        </div>
        <div style={{ marginBottom: 6, fontSize: 10, color: "#2a3d2e", letterSpacing: 2, textTransform: "uppercase" }}>Energy</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Low", "Mid", "High", "Locked in"].map((e, i) => (
            <button key={e} onClick={() => setEnergy(e)}
              style={{
                ...pillStyle, fontSize: 10,
                background: energy === e ? "#5a9e7222" : "transparent",
                color: energy === e ? "#5a9e72" : "#4a6e52",
                borderColor: energy === e ? "#5a9e7255" : "#1c2e20",
              }}>{e}</button>
          ))}
        </div>
      </div>

      {/* Start */}
      <div style={{ padding: "28px 20px 0" }}>
        <button onClick={() => onStart(todayDay, bw, energy)}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 8,
            background: "#5a9e72", border: "none", color: "#000",
            fontSize: 14, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase",
            cursor: "pointer",
          }}>
          Start {dayData.label}
        </button>
      </div>

      {/* History */}
      {sessionLog.length > 0 && (
        <div style={{ padding: "28px 20px 0" }}>
          <div style={{ fontSize: 10, color: "#2a3d2e", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Recent
          </div>
          {sessionLog.slice(-4).reverse().map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #131f16", fontSize: 12 }}>
              <span style={{ color: "#7a9e80" }}>{s.day}</span>
              <span style={{ fontFamily: "monospace", color: "#2a3d2e" }}>{s.date}</span>
              {s.bw && <span style={{ fontFamily: "monospace", color: "#4a6e52" }}>{s.bw}kg</span>}
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
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1a2e1e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: "#4a6e52", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Active</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f3f5f2", letterSpacing: "-0.5px" }}>
            {dayData.label} <span style={{ fontWeight: 400, color: "#7a9e80", fontSize: 14 }}>— {dayData.subtitle}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: 20, color: "#5a9e72" }}>
            {formatDuration(elapsed)}
          </div>
          {energy && <div style={{ fontSize: 10, color: "#2a3d2e", textTransform: "uppercase", letterSpacing: 1 }}>{energy}</div>}
        </div>
      </div>

      {/* Global cues banner */}
      <div style={{ padding: "10px 20px", background: "#0a130d", display: "flex", gap: 10, overflowX: "auto", borderBottom: "1px solid #1a2e1e" }}>
        {["Long neck", "Shoulders down", "Ribs down", "Controlled eccentrics"].map((c, i) => (
          <span key={i} style={{ fontSize: 9, whiteSpace: "nowrap", padding: "2px 8px", borderRadius: 2, background: "#131f16", color: "#2a3d2e", letterSpacing: 2, textTransform: "uppercase" }}>{c}</span>
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
            width: "100%", padding: "14px 0", borderRadius: 8,
            background: "transparent", border: "1px solid #2a3d2e", color: "#7a9e80",
            fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
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
        <div style={{ fontSize: 10, color: "#5a9e72", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Session Complete</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#f3f5f2", letterSpacing: "-1px", lineHeight: 1 }}>{session.day}</div>
        <div style={{ fontSize: 13, color: "#4a6e52", marginTop: 6 }}>{session.date}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Duration", val: `${session.duration} min` },
          { label: "Bodyweight", val: session.bw ? `${session.bw} kg` : "—" },
          { label: "Energy", val: session.energy || "—" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 16px", background: "#131f16", borderRadius: 8, border: "1px solid #172b1b" }}>
            <div style={{ fontFamily: "monospace", fontSize: 22, color: "#5a9e72", fontWeight: 700 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#2a3d2e", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onHome}
        style={{
          width: "100%", padding: "16px 0", borderRadius: 8,
          background: "#5a9e72", border: "none", color: "#000",
          fontSize: 13, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
        }}>
        Back to Home
      </button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home"); // home | workout | summary
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
      background: "#101c14",
      color: "#f2f4f1",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      maxWidth: 480, margin: "0 auto",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        html { -webkit-text-size-adjust: 100%; }
        input:focus { border-color: #333 !important; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {/* Nav bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#101c14cc", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #1a2e1e",
        padding: "14px 20px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a9e72" }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "#f2f4f1" }}>
            PHYSIQUE
          </span>
        </div>
        {screen !== "home" && (
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#4a6e52", cursor: "pointer", fontSize: 12, letterSpacing: 1 }}>
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
