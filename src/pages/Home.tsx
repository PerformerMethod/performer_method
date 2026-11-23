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
        <div className="hero__media" aria-hidden={false}>
          <img
            src="/hero.webp"
            alt="Two performers facing the windows in matching stretches in a bright rehearsal studio"
            width={1671}
            height={941}
            fetchPriority="high"
          />
        </div>
        <div className="hero__content">
          <div className="hero-brand glass">
            <LeafMark size={22} />
            <span className="hero-brand__text">The Performer Method</span>
          </div>
          <div className="hero-copy">
            <h1>Connecting performers with the professionals who understand them.</h1>
            <p>
              Physiotherapists, voice specialists, counsellors and more — plus
              the Method, recovery, and a Pass that travels with you.
            </p>
            <div className="hero-actions">
              <Link to="/practitioners" className="btn">
                Find a practitioner
              </Link>
              <Link to={member ? "/pass" : "/join"} className="link-arrow">
                {member ? "Open your Pass →" : "Join the community →"}
              </Link>
            </div>
            {member ? (
              <p className="welcome-note glass">
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
          <p className="section-kicker">Your support team</p>
          <h2 className="section-title">People who get the work.</h2>
          <p className="section-lead">
            Physiotherapists, voice specialists, counsellors and more, each
            chosen because they understand the work you do.
          </p>
          <div className="preview-grid">
            {preview.map((p) => (
              <Link key={p.id} to="/practitioners" className="person-tile">
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
          <h2 className="section-title">Four pillars that hold a performing life together.</h2>
          <p className="section-lead">
            Mind, Body, Fuel, and Purpose — start with the one that needs you
            most.
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
          <h2 className="section-title">One pass, wherever you go.</h2>
          <div className="pass-band">
            <div>
              <h3>Free with every account, with offers from gyms, studios and recovery spaces.</h3>
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
          <h2 className="section-title">Hi, I’m Will.</h2>
          <div className="founder-block">
            <div className="founder-visual" aria-hidden />
            <div className="founder-copy glass">
              <p>
                Some of the most valuable knowledge about performance, health,
                wellbeing, and career longevity isn’t always found in formal
                training. More often, it’s shared through conversations, trusted
                recommendations, lived experience, and the people we meet along
                the way.
              </p>
              <p>
                Credits include Hamilton, Moulin Rouge! The Musical,
                Beetlejuice, and Baz Luhrmann’s ELVIS.
              </p>
            </div>
          </div>
        </section>

        <section className="home-section">
          <p className="section-kicker">Lifecycle</p>
          <h2 className="section-title">Where are you right now?</h2>
          <div className="lifecycle-home">
            <div>
              <p className="section-lead">
                Eight stages of a show — from Audition to Closing — with
                guidance for the load you are actually carrying.
              </p>
              <p style={{ marginTop: "1.25rem" }}>
                <Link to="/lifecycle" className="btn btn--glass">
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
              <h3 style={{ fontSize: "1.55rem", marginBottom: "0.55rem" }}>
                Daily check-in
              </h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                One question at a time for mind, body, voice, and energy —
                shaping a quieter For You page for members.
              </p>
              <Link to={member ? "/for-you" : "/join"} className="btn">
                {member ? "Go to For You" : "Start as a member"}
              </Link>
            </div>
            <div className="soft-panel">
              <h3 style={{ fontSize: "1.55rem", marginBottom: "0.55rem" }}>
                Recovery centres
              </h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Saunas, ice baths and steam rooms across Australia, for the days
                after a big week.
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
