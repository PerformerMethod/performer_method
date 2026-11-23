import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LifecycleRing } from "../components/LifecycleRing";
import { practitioners } from "../data/content";
import { fetchForYouPicks } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import "./ForYou.css";

const dayKinds = [
  "Rehearsal",
  "Show day",
  "Audition",
  "Travel",
  "A day for me",
] as const;

export function ForYou() {
  const { member, favourites } = useAuth();
  const [step, setStep] = useState(0);
  const [dayKind, setDayKind] = useState<(typeof dayKinds)[number]>("Show day");
  const [mind, setMind] = useState(6);
  const [body, setBody] = useState(5);
  const [voice, setVoice] = useState(6);
  const [energy, setEnergy] = useState(5);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serviceNote, setServiceNote] = useState("");
  const [note, setNote] = useState("");
  const [practice, setPractice] = useState("Two-minute exhale reset");
  const [read, setRead] = useState("Show-day mobility");
  const [weekSummary, setWeekSummary] = useState(
    "A steady midweek with a softer Tuesday — you have been protecting energy better than last week.",
  );

  const week = useMemo(() => [46, 62, 38, 70, 55, 48, 64], []);

  if (!member) return <Navigate to="/join" replace />;

  const saved = practitioners.filter((p) => favourites.has(p.id));
  const showCare = body <= 3;

  const advance = async () => {
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    setBusy(true);
    const result = await fetchForYouPicks({
      memberId: member.email,
      mind,
      body,
      voice,
      energy,
      dayKind,
    });
    setBusy(false);
    setNote(result.data.note);
    setPractice(result.data.practice);
    setRead(result.data.read);
    setWeekSummary(result.data.weekSummary);
    setServiceNote(
      result.status === "sample"
        ? result.detail ?? "Sample picks"
        : "Claude picks via pm-recovery",
    );
    setDone(true);
  };

  return (
    <div className="page">
      <div className="for-you-hero">
        <p className="section-kicker">For You</p>
        <h1>Good to see you, {member.name.split(" ")[0]}.</h1>
      </div>

      <div className="note-panel">
        <p>
          {done
            ? note
            : "After your check-in, today’s note and picks will land here — Claude chooses only from Method content and practitioners on the site."}
        </p>
        {serviceNote ? (
          <p className="service-banner" style={{ marginTop: "0.85rem" }}>
            {serviceNote}
          </p>
        ) : null}
      </div>

      <div className="for-you-layout">
        <div>
          {member.discipline.toLowerCase().includes("musical") ? (
            <div className="soft-panel" style={{ marginBottom: "1rem" }}>
              <p className="section-kicker">Your stage</p>
              <LifecycleRing activeId={member.stage} compact />
            </div>
          ) : null}

          <p className="section-kicker">For today</p>
          <div className="picks-grid">
            <article className="pick-tile">
              <span>Practice</span>
              <h3>{practice}</h3>
              <p>From Mind — before the call, name the worry, then lengthen the breath.</p>
            </article>
            <article className="pick-tile">
              <span>Reads</span>
              <h3>{read}</h3>
              <p>From Body — warm joints before call; cool down so tomorrow is kinder.</p>
            </article>
            <article className="pick-tile">
              <span>Practitioner</span>
              <h3>{practitioners[0].name}</h3>
              <p>
                Suggested when load runs high — {practitioners[0].specialty} in{" "}
                {practitioners[0].city}.
              </p>
            </article>
          </div>

          {showCare || done ? (
            <p className="care-notes">
              Gentle care: if body feels low, shrink the plan. Chest or sharp
              pain is a stop — seek medical care. Soft tissue tiredness can wait
              for paced recovery.
            </p>
          ) : null}

          <div style={{ marginTop: "1.5rem" }}>
            <p className="section-kicker">Saved favourites</p>
            {saved.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>
                Star practitioners in the directory to keep them here.
              </p>
            ) : (
              <div className="picks-grid">
                {saved.map((p) => (
                  <Link key={p.id} to="/practitioners" className="pick-tile">
                    <span>{p.specialty}</span>
                    <h3>{p.name}</h3>
                    <p>{p.location}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside>
          <div className="soft-panel">
            <p className="section-kicker">Your week</p>
            <div className="week-bars" aria-hidden>
              {week.map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="care-notes" style={{ marginTop: 0 }}>
              {weekSummary}
            </p>
          </div>

          <div className="check-in">
            <h2>Daily check-in</h2>
            {!done ? (
              <>
                <p>
                  One question at a time
                  {member.shareCheckIns
                    ? " — sharing is on, so picks can feel personal."
                    : " — AI picks stay off until you opt in to sharing."}
                </p>
                {step === 0 && (
                  <>
                    <p>What kind of day is it?</p>
                    <div className="day-options">
                      {dayKinds.map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={dayKind === d ? "is-active" : undefined}
                          onClick={() => setDayKind(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 1 && (
                  <div className="slider-field">
                    <label htmlFor="mind">Mind · {mind}</label>
                    <input
                      id="mind"
                      type="range"
                      min={1}
                      max={10}
                      value={mind}
                      onChange={(e) => setMind(Number(e.target.value))}
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="slider-field">
                    <label htmlFor="body">Body · {body}</label>
                    <input
                      id="body"
                      type="range"
                      min={1}
                      max={10}
                      value={body}
                      onChange={(e) => setBody(Number(e.target.value))}
                    />
                  </div>
                )}
                {step === 3 && (
                  <div className="slider-field">
                    <label htmlFor="voice">Voice · {voice}</label>
                    <input
                      id="voice"
                      type="range"
                      min={1}
                      max={10}
                      value={voice}
                      onChange={(e) => setVoice(Number(e.target.value))}
                    />
                  </div>
                )}
                {step === 4 && (
                  <div className="slider-field">
                    <label htmlFor="energy">Energy · {energy}</label>
                    <input
                      id="energy"
                      type="range"
                      min={1}
                      max={10}
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn--spotlight"
                  onClick={advance}
                  disabled={busy}
                >
                  {busy ? "Writing your note…" : step < 4 ? "Next" : "Save check-in"}
                </button>
              </>
            ) : (
              <p>Check-in saved. Your note and picks above are ready for today.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
