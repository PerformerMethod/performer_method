import { Link, useParams } from "react-router-dom";
import { pillars } from "../data/content";
import "./Method.css";

const pillarImages: Record<string, string> = {
  mind: "/brand/pillar-mind.webp",
  body: "/brand/pillar-body.webp",
  fuel: "/brand/pillar-fuel.webp",
  purpose: "/brand/pillar-purpose.webp",
};

const pillarTags: Record<string, string> = {
  mind: "Psychology. Mindfulness. Mental resilience.",
  body: "Physio. Strength. Recovery between shows.",
  fuel: "Nutrition. Energy. Tour-proof habits.",
  purpose: "Career. Identity. Longevity.",
};

export function Method() {
  const { pillarId } = useParams();
  const active = pillars.find((p) => p.id === pillarId) ?? pillars[0];

  return (
    <div className="page">
      <p className="section-kicker">Education</p>
      <h1 className="section-title">The Method</h1>
      <p className="section-lead">
        Four pillars that hold a performing life together. Start with the one
        that needs you most.
      </p>

      <div className="method-layout">
        <div>
          <nav className="method-nav" aria-label="Pillars">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                to={`/method/${pillar.id}`}
                className={pillar.id === active.id ? "active" : undefined}
              >
                <h3>{pillar.title}</h3>
                <p>{pillarTags[pillar.id]}</p>
              </Link>
            ))}
          </nav>

          <h2 className="section-title" style={{ fontSize: "2rem" }}>
            {active.title}
          </h2>
          <p className="section-lead" style={{ marginBottom: "1.25rem" }}>
            {active.summary}
          </p>

          <div className="accordion">
            {active.sections.map((section) => (
              <details key={section.title}>
                <summary>{section.title}</summary>
                <p>{section.body}</p>
              </details>
            ))}
          </div>
        </div>

        <figure className="method-stage" aria-hidden>
          <img
            key={active.id}
            src={pillarImages[active.id]}
            alt=""
            width={1024}
            height={1536}
          />
        </figure>
      </div>
    </div>
  );
}
