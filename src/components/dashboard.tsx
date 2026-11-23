"use client";

import {
  Activity,
  BarChart3,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Cloud,
  HeartPulse,
  Moon,
  Settings,
  Waves,
  Dumbbell,
  Download,
  Upload,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { useMemo, useState } from "react";
import { generateDemoData, Sport } from "@/lib/demo";

const nav = [
  { label: "Today", icon: Activity },
  { label: "Sleep", icon: Moon },
  { label: "Recovery", icon: BatteryCharging },
  { label: "Training", icon: Dumbbell },
  { label: "Trends", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

function Ring({ value, max, label, color, sublabel }: {
  value: number;
  max: number;
  label: string;
  color: string;
  sublabel: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 128 128" aria-label={`${label}: ${value}`}>
        <circle cx="64" cy="64" r={radius} className="ring-track" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          className="ring-value"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <div className="ring-label">
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{sublabel}</small>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="provenance">{children}</span>;
}

export default function Dashboard() {
  const data = useMemo(() => generateDemoData(), []);
  const [dayIndex, setDayIndex] = useState(data.length - 1);
  const [active, setActive] = useState("Today");
  const [filter, setFilter] = useState<Sport | "All">("All");
  const day = data[dayIndex];
  const visibleExercises = day.exercises.filter(
    (exercise) => filter === "All" || exercise.sport === filter,
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={19} /></div>
          <div>
            <strong>POLAR</strong>
            <span>TRACKER</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={active === item.label ? "nav-item active" : "nav-item"}
                onClick={() => setActive(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="profile">
          <CircleUserRound size={36} />
          <div><strong>keyclimbs</strong><span>Multi-sport athlete</span></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="date-control">
            <button aria-label="Previous day" onClick={() => setDayIndex(Math.max(0, dayIndex - 1))}><ChevronLeft size={18} /></button>
            <CalendarDays size={16} />
            <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <button aria-label="Next day" onClick={() => setDayIndex(Math.min(data.length - 1, dayIndex + 1))}><ChevronRight size={18} /></button>
          </div>
          <div className="top-actions">
            <span className="freshness"><span /> Synced 8 min ago</span>
            <button className="sync-button"><RefreshCw size={15} /> Sync now</button>
          </div>
        </header>

        {active === "Today" && (
          <div className="content">
            <div className="heading-row">
              <div><p className="eyebrow">DAILY ATHLETIC INTELLIGENCE</p><h1>Today&apos;s readiness</h1></div>
              <Badge>Demo Fixture</Badge>
            </div>

            <section className="rings-card card">
              <Ring value={day.recovery} max={100} label="Recovery" color="#2ea043" sublabel="GOOD" />
              <Ring value={day.strain} max={21} label="Strain" color="#58a6ff" sublabel="MODERATE" />
              <Ring value={day.sleepScore} max={100} label="Sleep" color="#d29922" sublabel={`${day.sleepEfficiency}% eff.`} />
            </section>

            <section className="vitals card">
              <div className="section-title"><HeartPulse size={17} /><h2>Overnight vitals</h2><Badge>Polar Native</Badge></div>
              <div className="vital-grid">
                <div><span>RMSSD</span><strong>{day.rmssd}<small> ms</small></strong><em>+4.2%</em></div>
                <div><span>Sleeping RHR</span><strong>{day.rhr}<small> bpm</small></strong><em>-1.8%</em></div>
                <div><span>Breathing rate</span><strong>{day.breathingRate}<small> br/min</small></strong><em>stable</em></div>
                <div><span>ANS charge</span><strong className="text-charge">{day.ansCharge}</strong><em>overnight</em></div>
              </div>
            </section>

            <div className="lower-grid">
              <section className="card workouts">
                <div className="section-title"><Dumbbell size={17} /><h2>Workouts</h2></div>
                <div className="filter-row">
                  {(["All", "Trail Run", "Bouldering", "Sport Climbing", "Cycling", "Swimming", "Strength"] as const).map((item) => (
                    <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>{item}</button>
                  ))}
                </div>
                {visibleExercises.length ? visibleExercises.map((exercise) => (
                  <div className="workout" key={exercise.name}>
                    <div className="sport-icon"><Dumbbell size={18} /></div>
                    <div className="workout-name"><strong>{exercise.name}</strong><span>{exercise.sport} · {exercise.durationMinutes} min</span></div>
                    <div className="load"><strong>{exercise.strain ? `${exercise.strain}` : exercise.srpe}</strong><span>{exercise.strain ? "Strain" : "sRPE load"}</span></div>
                    <Badge>{exercise.strain ? "Derived TRIMP" : "Manual sRPE"}</Badge>
                  </div>
                )) : <div className="empty">Rest day · no workouts recorded</div>}
              </section>

              <section className="card recharge">
                <div className="section-title"><Waves size={17} /><h2>Nightly Recharge</h2></div>
                <div className="recharge-main">
                  <div><span>ANS</span><strong>{day.ansCharge}</strong></div>
                  <div><span>Sleep</span><strong>{day.sleepCharge}</strong></div>
                </div>
                <p>Recovery is supported by your most consistent parasympathetic night of the week.</p>
                <Badge>Polar Native</Badge>
              </section>
            </div>
          </div>
        )}

        {active !== "Today" && (
          <div className="content">
            <div className="heading-row"><div><p className="eyebrow">POLAR TRACKER</p><h1>{active}</h1></div><Badge>Demo Fixture</Badge></div>
            {active === "Settings" ? (
              <section className="card settings-grid">
                <div><h2>Polar AccessLink</h2><p>Connect or manage your Polar account.</p><button className="sync-button"><Cloud size={15} /> Connect Polar</button></div>
                <div><h2>Data imports</h2><p>CSV / RR intervals and account JSON archive.</p><button className="sync-button"><Upload size={15} /> Choose files</button></div>
                <div><h2>Export & privacy</h2><p>Download all data or permanently purge it.</p><button className="sync-button"><Download size={15} /> Export JSON</button></div>
              </section>
            ) : (
              <section className="card secondary-view">
                <h2>{active} overview</h2>
                <p>30-day demo telemetry is available across all views. Use the Today date control to inspect a day in the deterministic fixture set.</p>
                <div className="fake-chart">
                  {data.slice(-14).map((item, i) => (
                    <div key={item.date} style={{ height: `${30 + ((i * 11 + item.recovery) % 58)}%` }} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
