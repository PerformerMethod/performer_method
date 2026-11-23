import { useMemo, useState, type FormEvent } from "react";
import { recoveryCentres } from "../data/content";
import "./Directory.css";

const services = ["All", "Sauna", "Ice bath", "Contrast"] as const;
const states = ["All", "NSW", "VIC", "QLD", "WA"] as const;

export function Recovery() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState<(typeof services)[number]>("All");
  const [state, setState] = useState<(typeof states)[number]>("All");
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    return recoveryCentres.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.suburb.toLowerCase().includes(q);
      const matchesService =
        service === "All" || c.services.includes(service);
      const matchesState = state === "All" || c.state === state;
      return matchesQuery && matchesService && matchesState;
    });
  }, [query, service, state]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page">
      <p className="section-kicker">Recovery</p>
      <h1 className="section-title">Recovery directory</h1>
      <p className="section-lead">
        Sauna, ice bath, and contrast therapy centres across NSW, VIC, QLD, and
        WA.
      </p>

      <div className="directory-toolbar">
        <div className="field">
          <label htmlFor="rec-search">Search</label>
          <input
            id="rec-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Centre or suburb…"
          />
        </div>
        <div className="chip-row">
          {services.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${service === s ? "is-active" : ""}`}
              onClick={() => setService(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="chip-row">
          {states.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${state === s ? "is-active" : ""}`}
              onClick={() => setState(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="directory-grid">
        {filtered.map((c) => (
          <article key={c.id} className="centre-card">
            <div>
              <p className="person-tile__meta">
                {c.state} · {c.suburb}
              </p>
              <h3>{c.name}</h3>
              <p style={{ color: "var(--muted)", marginTop: "0.35rem" }}>
                {c.services.join(" · ")}
              </p>
            </div>
            <div className="centre-actions">
              {c.phone ? <a href={`tel:${c.phone}`}>Call</a> : null}
              {c.email ? <a href={`mailto:${c.email}`}>Email</a> : null}
              {c.website ? (
                <a href={c.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
              {c.instagram ? <span>{c.instagram}</span> : null}
            </div>
          </article>
        ))}
      </div>

      <div className="apply-band" style={{ display: "block" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Submit a centre
        </h2>
        <p style={{ marginBottom: "1rem" }}>
          Centres can submit themselves. The founder is emailed either way.
        </p>
        {submitted ? (
          <p style={{ color: "var(--ok)", fontWeight: 500 }}>
            Thanks — your submission is ready to send once email is connected.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{ display: "grid", gap: "0.75rem", maxWidth: 480 }}
          >
            <div className="field">
              <label htmlFor="centre-name">Centre name</label>
              <input id="centre-name" required />
            </div>
            <div className="field">
              <label htmlFor="centre-email">Contact email</label>
              <input id="centre-email" type="email" required />
            </div>
            <button type="submit" className="btn">
              Submit centre
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
