import { useEffect, useMemo, useState } from "react";
import { getDirectory, type Listing } from "../lib/api";
import { practitioners as samplePractitioners, specialties } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Directory.css";

type Card = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  city: string;
  blurb: string;
  initials: string;
  photo?: string;
};

function initialsFromName(name: string) {
  const parts = name
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s'-]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
  return initials || "PM";
}

function listingToCard(l: Listing): Card {
  return {
    id: l.id,
    name: l.name,
    specialty: l.category || l.role || "Practitioner",
    location: l.place || "",
    city: (l.place || "").split(/[-–,]/)[0]?.trim() || "Australia",
    blurb: l.bio || l.practice || l.role || "",
    initials: initialsFromName(l.name || ""),
    photo: l.photo_url || undefined,
  };
}

export function Practitioners() {
  const { member, favourites, toggleFavourite } = useAuth();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All");
  const [cards, setCards] = useState<Card[]>(
    samplePractitioners.map((p) => ({ ...p, city: p.city })),
  );
  const [source, setSource] = useState<"live" | "sample">("sample");

  useEffect(() => {
    getDirectory()
      .then((data) => {
        if (data.listings?.length) {
          setCards(data.listings.map(listingToCard));
          setSource("live");
        }
      })
      .catch(() => setSource("sample"));
  }, []);

  const specialtyOptions = useMemo(() => {
    const fromCards = Array.from(new Set(cards.map((c) => c.specialty))).sort();
    return ["All", ...(fromCards.length ? fromCards : [...specialties])];
  }, [cards]);

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(cards.map((p) => p.city))).sort()],
    [cards],
  );

  const filtered = cards.filter((p) => {
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
      <p className="service-banner" style={{ margin: "1rem 0" }}>
        {source === "live" ? "Live directory from pm-api" : "Sample directory"}
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
          {specialtyOptions.map((s) => (
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
                <div className="directory-card__avatar">
                  {p.photo ? (
                    <img src={p.photo} alt="" width={480} height={600} loading="lazy" />
                  ) : (
                    <span>{p.initials}</span>
                  )}
                </div>
                <div>
                  <p className="person-tile__meta">
                    {p.specialty} · {p.location}
                  </p>
                  <h3>{p.name}</h3>
                  <p>
                    {p.blurb.length > 160
                      ? `${p.blurb.slice(0, 157)}…`
                      : p.blurb}
                  </p>
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
                ) : null}
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
        <a className="btn" href="mailto:will@performermethod.com">
          Apply to join
        </a>
      </div>
    </div>
  );
}
