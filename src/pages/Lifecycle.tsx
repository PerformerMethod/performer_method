import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LifecycleRing } from "../components/LifecycleRing";
import { lifecycleStages } from "../data/content";

export function Lifecycle() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <div className="page">
      <p className="section-kicker">Show calendar</p>
      <h1 className="section-title">Lifecycle</h1>
      <p className="section-lead">
        The eight stages of a show — from Audition to Closing — with guidance
        for each.
      </p>

      <div style={{ margin: "2rem 0", display: "grid", placeItems: "center" }}>
        <LifecycleRing />
      </div>

      <div className="accordion">
        {lifecycleStages.map((stage) => (
          <article
            key={stage.id}
            id={stage.id}
            className="soft-panel"
            style={{ marginBottom: "0.75rem", scrollMarginTop: "6rem" }}
          >
            <h2 style={{ fontSize: "1.6rem", marginBottom: "0.45rem" }}>
              {stage.title}
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              {stage.guidance}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
