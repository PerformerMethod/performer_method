import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LifecycleRing } from "../components/LifecycleRing";
import { practitioners } from "../data/content";
import { forYou, saveCheckins, weeklySummary } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import "./ForYou.css";

const dayKinds = [
  "Rehearsal day",
  "Single show day",
  "Double show day",
  "Audition day",
  "Travel day",
  "A day for me",
] as const;

export function ForYou() {
  const { member, favourites, session, live, withSession } = useAuth();
  const [step, setStep] = useState(0);
  const [dayKind, setDayKind] = useState<(typeof dayKinds)[number]>(
    "Single show day",
  );
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
  const [person, setPerson] = useState(practitioners[0].name);
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
    try {
      const checkin = {
        day: dayKind,
        when: "today",
        feel: "",
        pain: body <= 3,
        sev: body <= 3 ? 11 - body : 0,
        scores: { mind, body, voice, energy },
      };

      if (live && session && member.shareCheckIns) {
        let wroteNote = false;
        await withSession(async (s) => {
          await saveCheckins(s, [checkin], {});
          const picks = await forYou(s, {
            checkin,
            stage: member.stage,
            disciplines: [member.discipline],
            focus: [],
            roles: [],
            candidates: {
              practices: [
                {
                  id: "exhale",
                  title: "Two-minute exhale reset",
                  about: "Before the call, name the worry, then lengthen the breath.",
                },
                {
                  id: "mobility",
                  title: "Show-day mobility",
                  about: "Warm joints before call; cool down so tomorrow is kinder.",
                },
              ],
              reads: [
                { id: "vocal-health", title: "Vocal health" },
                { id: "show-day-mobility", title: "Show-day mobility" },
              ],
              people: practitioners.slice(0, 6).map((p) => ({
                id: p.id,
                title: p.name,
                about: `${p.specialty}, ${p.location}`,
              })),
            },
          });
          if (picks.note) {
            setNote(picks.note);
            wroteNote = true;
          }
          if (picks.practice) setPractice(picks.practice);
          if (picks.reads?.[0]) setRead(picks.reads[0]);
          if (picks.person) {
            const match = practitioners.find((p) => p.id === picks.person);
            setPerson(match?.name || picks.person);
          }
          setServiceNote(
            picks.line || "Live For You via pm-recovery + Claude",
          );
          try {
            const week = await weeklySummary(s);
            if (week.summary) setWeekSummary(week.summary);
          } catch {
            /* bars still show */
          }
        });
        if (!wroteNote) {
          setNote(
            `Today looks like a ${dayKind.toLowerCase()}. Keep the warm-up short, drink early, and let the notes stay in the room.`,
          );
        }
      } else {
        setNote(
          `Today looks like a ${dayKind.toLowerCase()}. Keep the warm-up short, drink early, and let the notes stay in the room.`,
        );
        setServiceNote(
          live
            ? "Signed in — turn on check-in sharing for Claude picks"
            : "Sample picks — sign in for live Claude notes",
        );
      }
      setDone(true);
    } catch (err) {
      setNote(
        `Today looks like a ${dayKind.toLowerCase()}. Keep the warm-up short, drink early, and let the notes stay in the room.`,
      );
      setServiceNote(
        err instanceof Error ? err.message : "Could not reach For You — showing standard picks",
      );
      setDone(true);
    } finally {
      setBusy(false);
    }
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
            : "After your check-in, today’s note and picks land here — Claude chooses only from Method content and practitioners on the site."}
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
              <p>Chosen for how you’re arriving today.</p>
            </article>
            <article className="pick-tile">
              <span>Reads</span>
              <h3>{read}</h3>
              <p>From the Method library.</p>
            </article>
            <article className="pick-tile">
              <span>Practitioner</span>
              <h3>{person}</h3>
              <p>Suggested when load or voice asks for support.</p>
            </article>
          </div>

          {showCare || done ? (
            <p className="care-notes">
              Gentle care: if body feels low, shrink the plan. Chest or sharp
              pain is a stop — seek medical care.
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
                  {busy
                    ? "Writing your note…"
                    : step < 4
                      ? "Next"
                      : "Save check-in"}
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
