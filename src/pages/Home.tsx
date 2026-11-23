import { Link } from "react-router-dom";
import { LeafMark } from "../components/LeafMark";
import { LifecycleRing } from "../components/LifecycleRing";
import { practitioners, pillars } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Home.css";

export function Home() {
  const { member } = useAuth();
  const preview = practitioners.slice(0, 3);

  return (
    <div className="page page--flush">
      <section className="hero">
        <div className="hero__bg" aria-hidden />
        <div className="hero__content">
          <div className="hero-brand">
            <LeafMark size={42} />
            <span className="hero-brand__text">Performer Method</span>
          </div>
          <div className="hero-copy">
            <h1>Wellbeing built for the show calendar.</h1>
            <p>
              Find practitioners who understand performers, learn the Method,
              and recover between calls — with a personal Pass when you join.
            </p>
            <div className="hero-actions">
              <Link to="/practitioners" className="btn btn--spotlight">
                Find a practitioner
              </Link>
              <Link to="/method" className="btn btn--ghost">
                Explore the Method
              </Link>
            </div>
            {member ? (
              <p className="welcome-note">
                Welcome back, {member.name.split(" ")[0]}. You are in{" "}
                {member.stage}
                {member.show ? ` on ${member.show}` : ""}. Your For You page is
                ready when you are.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="page-inner">
        <section className="home-section">
          <p className="section-kicker">Practitioners</p>
          <h2 className="section-title">People who get the work.</h2>
          <p className="section-lead">
            A directory of practitioners who understand vocal load, eight-show
            weeks, and the quiet days in between.
          </p>
          <div className="preview-grid">
            {preview.map((p) => (
              <Link
                key={p.id}
                to="/practitioners"
                className="person-tile"
              >
                <div className="person-tile__avatar">{p.initials}</div>
                <div>
                  <p className="person-tile__meta">
                    {p.specialty} · {p.location}
                  </p>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section">
          <p className="section-kicker">The Method</p>
          <h2 className="section-title">Four pillars. One craft.</h2>
          <p className="section-lead">
            Mind, Body, Fuel, and Purpose — short enough for a call day, deep
            enough for a career.
          </p>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                to={`/method/${pillar.id}`}
                className="pillar-tile"
              >
                <h3>{pillar.title}</h3>
                <p>{pillar.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section">
          <p className="section-kicker">Performer Pass</p>
          <h2 className="section-title">Partner offers that travel with you.</h2>
          <div className="pass-band">
            <div>
              <h3>A digital pass for gyms, studios, and recovery spaces.</h3>
              <p>
                Debut is free. Company unlocks deeper partner perks. Partners
                can check a Pass at the door.
              </p>
            </div>
            <div>
              <Link to={member ? "/pass" : "/join"} className="btn">
                {member ? "Open your Pass" : "Get the Pass"}
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <p className="section-kicker">Founder</p>
          <h2 className="section-title">Built from inside the industry.</h2>
          <div className="founder-block">
            <div className="founder-visual" aria-hidden />
            <div className="founder-copy">
              <p>
                Performer Method started as a practical answer to a familiar
                gap: performers need care that understands the schedule, the
                body, and the identity wrapped around the work.
              </p>
              <p>
                The platform brings practitioners, recovery, education, and
                community into one place — so support is available between
                auditions, during the run, and after closing night.
              </p>
            </div>
          </div>
        </section>

        <section className="home-section">
          <p className="section-kicker">Lifecycle</p>
          <h2 className="section-title">From audition to closing.</h2>
          <div className="lifecycle-home">
            <div>
              <p className="section-lead">
                Eight stages of a show, each with guidance for the load you are
                actually carrying.
              </p>
              <p style={{ marginTop: "1.25rem" }}>
                <Link to="/lifecycle" className="btn">
                  Open the ring
                </Link>
              </p>
            </div>
            <LifecycleRing activeId={member?.stage} />
          </div>
        </section>

        <section className="home-section" style={{ paddingBottom: "2rem" }}>
          <p className="section-kicker">Journal & recovery</p>
          <h2 className="section-title">Care between the calls.</h2>
          <div className="journal-recovery">
            <div className="soft-panel">
              <h3>Daily check-in</h3>
              <p>
                One question at a time for mind, body, voice, and energy —
                shaping a quieter For You page for members.
              </p>
              <Link to={member ? "/for-you" : "/join"} className="btn">
                {member ? "Go to For You" : "Start as a member"}
              </Link>
            </div>
            <div className="soft-panel">
              <h3>Recovery directory</h3>
              <p>
                Sauna, ice bath, and contrast therapy centres across NSW, VIC,
                QLD, and WA.
              </p>
              <Link to="/recovery" className="btn">
                Find recovery
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
