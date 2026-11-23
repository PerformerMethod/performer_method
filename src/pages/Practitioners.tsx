import { useMemo, useState } from "react";
import { practitioners, specialties } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Directory.css";

export function Practitioners() {
  const { member, favourites, toggleFavourite } = useAuth();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All");

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(practitioners.map((p) => p.city)))],
    [],
  );

  const filtered = practitioners.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    const matchesSpecialty = specialty === "All" || p.specialty === specialty;
    const matchesCity = city === "All" || p.city === city;
    return matchesQuery && matchesSpecialty && matchesCity;
  });

  return (
    <div className="page">
      <p className="section-kicker">Directory</p>
      <h1 className="section-title">Practitioner directory</h1>
      <p className="section-lead">
        Find practitioners who understand performers, filtered by specialty and
        location.
      </p>

      <div className="directory-toolbar">
        <div className="search-bar">
          <div className="field">
            <label htmlFor="prac-search">Search</label>
            <input
              id="prac-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, specialty, suburb…"
            />
          </div>
        </div>
        <div className="chip-row" role="group" aria-label="Specialty">
          <button
            type="button"
            className={`chip ${specialty === "All" ? "is-active" : ""}`}
            onClick={() => setSpecialty("All")}
          >
            All
          </button>
          {specialties.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${specialty === s ? "is-active" : ""}`}
              onClick={() => setSpecialty(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label="City">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${city === c ? "is-active" : ""}`}
              onClick={() => setCity(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No practitioners match those filters.</p>
      ) : (
        <div className="directory-grid">
          {filtered.map((p) => {
            const fav = favourites.has(p.id);
            return (
              <article key={p.id} className="directory-card">
                <div className="directory-card__avatar">{p.initials}</div>
                <div>
                  <p className="person-tile__meta">
                    {p.specialty} · {p.location}
                  </p>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                </div>
                {member ? (
                  <button
                    type="button"
                    className={`fav-btn ${fav ? "is-on" : ""}`}
                    aria-label={fav ? "Remove favourite" : "Save favourite"}
                    onClick={() => toggleFavourite(p.id)}
                  >
                    {fav ? "★" : "☆"}
                  </button>
                ) : (
                  <span />
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="apply-band">
        <p>
          Practitioners can apply to join the directory. Submissions are emailed
          to the founder for review.
        </p>
        <a className="btn" href="mailto:hello@performermethod.com">
          Apply to join
        </a>
      </div>
    </div>
  );
}
