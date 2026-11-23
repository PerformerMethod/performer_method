import { Link, useParams } from "react-router-dom";
import { pillars } from "../data/content";
import "./Method.css";

export function Method() {
  const { pillarId } = useParams();
  const active = pillars.find((p) => p.id === pillarId) ?? pillars[0];

  return (
    <div className="page">
      <p className="section-kicker">Education</p>
      <h1 className="section-title">The Method</h1>
      <p className="section-lead">
        Four pillars for professional performers — condensed into short
        sections that open for more detail.
      </p>

      <nav className="method-nav" aria-label="Pillars">
        {pillars.map((pillar) => (
          <Link
            key={pillar.id}
            to={`/method/${pillar.id}`}
            className={pillar.id === active.id ? "active" : undefined}
          >
            <h3>{pillar.title}</h3>
            <p>{pillar.summary}</p>
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

      <div className="guides">
        <p className="section-kicker">Guides</p>
        <a
          href="https://performermethod.com"
          target="_blank"
          rel="noreferrer"
        >
          Warm-up that travels
          <span>Opens in a new tab</span>
        </a>
        <a
          href="https://performermethod.com"
          target="_blank"
          rel="noreferrer"
        >
          Closing week, gently
          <span>Opens in a new tab</span>
        </a>
      </div>
    </div>
  );
}
