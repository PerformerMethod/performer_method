import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LifecycleRing } from "../components/LifecycleRing";
import { practitioners, pillars } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Home.css";

const pillarMeta: Record<
  string,
  { tags: string; image: string }
> = {
  mind: {
    tags: "Psychology. Mindfulness. Mental resilience.",
    image: "/brand/pillar-mind.webp",
  },
  body: {
    tags: "Physio. Strength. Recovery between shows.",
    image: "/brand/pillar-body.webp",
  },
  fuel: {
    tags: "Nutrition. Energy. Tour-proof habits.",
    image: "/brand/pillar-fuel.webp",
  },
  purpose: {
    tags: "Career. Identity. Longevity.",
    image: "/brand/pillar-purpose.webp",
  },
};

export function Home() {
  const { member } = useAuth();
  const preview = practitioners.slice(0, 3);
  const [activePillar, setActivePillar] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActivePillar((i) => (i + 1) % pillars.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const current = pillars[activePillar];
  const meta = pillarMeta[current.id];

  return (
    <div className="page page--flush">
      <section className="hero" id="top">
        <div className="hero-media">
          <img
            className="hero-still"
            src="/hero.webp"
            alt="Two performers facing the windows in matching stretches in a bright, sunlit rehearsal studio"
            width={1671}
            height={941}
            fetchPriority="high"
          />
        </div>
        <div className="hero-copy">
          <h1>Connecting performers with the professionals who understand them.</h1>
          <div className="hero-ctas">
            <Link to="/practitioners" className="btn">
              Find a practitioner
            </Link>
            <Link to={member ? "/pass" : "/join"} className="link-arrow">
              {member ? "Open your Pass" : "Join the community"}{" "}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {member ? (
        <section className="hm-welcome">
          <div className="hm-welcome-in">
            <h2 className="hm-welcome-h">
              Welcome back, {member.name.split(" ")[0]}.
            </h2>
            <p className="hm-welcome-note">
              You are in {member.stage}
              {member.show ? ` on ${member.show}` : ""}. Your For You page is
              ready when you are.
            </p>
            <Link to="/for-you" className="hm-welcome-go">
              Open For You
            </Link>
          </div>
        </section>
      ) : null}

      <section className="directory home-band" aria-labelledby="dirTitle">
        <div className="dir-head hm-head">
          <div>
            <h2 id="dirTitle" className="display-sm">
              Your support team.
            </h2>
            <p className="hm-lede">
              Physiotherapists, voice specialists, counsellors and more, each
              chosen because they understand the work you do.
            </p>
          </div>
          <Link to="/practitioners" className="btn hm-head-btn">
            See all practitioners
          </Link>
        </div>

        <div className="dir-grid">
          {preview.map((p, i) => (
            <Link key={p.id} to="/practitioners" className="p-card">
              <div className={`p-photo p-photo--tone-${i % 3}`}>
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt=""
                    width={600}
                    height={750}
                    loading="lazy"
                  />
                ) : (
                  <span aria-hidden>{p.initials}</span>
                )}
              </div>
              <div className="p-body">
                <h3 className="p-name">{p.name}</h3>
                <p className="p-role">{p.specialty}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="dir-foot hm-foot">
          <Link to="/practitioners" className="btn">
            See all practitioners
          </Link>
        </div>
      </section>

      <section className="pillars home-band" aria-labelledby="pillarsTitle">
        <div className="pillars-copy">
          <h2 id="pillarsTitle" className="pillars-title">
            <img
              src="/brand/pm-the-method.svg"
              alt="The Method"
              width={424}
              height={40}
            />
          </h2>
          <p className="hm-lede hm-method-lede">
            Four pillars that hold a performing life together. Start with the
            one that needs you most.
          </p>

          <div className="pillar-tabs" role="tablist" aria-label="The four pillars">
            {pillars.map((pillar, i) => (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                className={`pillar-tab${i === activePillar ? " is-active" : ""}`}
                aria-selected={i === activePillar}
                onClick={() => setActivePillar(i)}
              >
                <span className="pt-name">{pillar.title}</span>
                <span className="pt-bar">
                  <i />
                </span>
              </button>
            ))}
          </div>

          <div className="pillar-detail" key={current.id}>
            <h3 className="pd-title">{current.title}</h3>
            <p className="pd-tags">{meta.tags}</p>
            <Link to={`/method/${current.id}`} className="btn">
              Explore {current.title}
              <span className="btn-circle" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15m-6-6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <figure className="pillar-stage" aria-hidden>
          {pillars.map((pillar, i) => (
            <div
              key={pillar.id}
              className={`stage-layer${i === activePillar ? " is-active" : ""}`}
            >
              <img
                src={pillarMeta[pillar.id].image}
                alt=""
                width={1024}
                height={1536}
              />
            </div>
          ))}
        </figure>
      </section>

      <section className="pass-wrap home-band">
        <div className="hm-pass">
          <div className="hm-pass-copy">
            <p className="label label-light">Performer Pass</p>
            <h2 className="display-sm">One pass, wherever you go.</h2>
            <p className="hm-pass-tag">
              Free with every account, with offers from gyms, studios and
              recovery spaces that look after performers.
            </p>
            <Link to={member ? "/pass" : "/join"} className="btn btn--ghost">
              {member ? "Open your Pass" : "Get the Pass"}
            </Link>
          </div>
          <div className="hm-card" aria-hidden>
            <div className="hm-card-sheen" />
            <div className="hm-card-top">
              <img src="/brand/pm-emblem.svg" alt="" width={30} height={30} />
              <span>{member ? "Member" : "Debut"}</span>
            </div>
            <p className="hm-card-kicker">Performer Pass</p>
            <p className="hm-card-name">
              {member ? member.name : "Reserved for you"}
            </p>
            <div className="hm-card-foot">
              <span>PM–0001</span>
              <small>Active</small>
            </div>
          </div>
        </div>
      </section>

      <section className="founder home-band" aria-labelledby="founderTitle">
        <div className="founder-img">
          <img
            src="/brand/founder.webp"
            alt="William Tukia-Edwards"
            width={640}
            height={800}
          />
        </div>
        <div className="founder-copy">
          <p className="label">Founder</p>
          <h2 id="founderTitle" className="display-sm">
            Hi, I’m Will.
          </h2>
          <p>
            Some of the most valuable knowledge about performance, health,
            wellbeing, and career longevity isn’t always found in formal
            training. More often, it’s shared through conversations, trusted
            recommendations, lived experience, and the people we meet along the
            way.
          </p>
          <ul className="chips">
            <li>Hamilton</li>
            <li>Moulin Rouge! The Musical</li>
            <li>Beetlejuice</li>
            <li>Baz Luhrmann’s ELVIS</li>
          </ul>
          <p>
            That’s why I created The Performer Method — a place where performers
            can connect with trusted experts, practical resources, and evidence
            based education.
          </p>
        </div>
      </section>

      <section className="lifecycle-home home-band" aria-labelledby="lcTitle">
        <div className="lifecycle-copy">
          <h2 id="lcTitle" className="display-sm">
            Where are you right now?
          </h2>
          <p className="hm-lede">
            Eight stages of a show — from Audition to Closing — with guidance
            for the load you are actually carrying.
          </p>
          <Link to="/lifecycle" className="link-arrow" style={{ marginTop: "1.25rem" }}>
            Open the ring <span aria-hidden>→</span>
          </Link>
        </div>
        <LifecycleRing activeId={member?.stage} />
      </section>

      <section className="hm-rec-wrap home-band">
        <div className="hm-rec">
          <div>
            <h2 className="display-sm">Recovery centres</h2>
            <p className="hm-rec-tag">
              Saunas, ice baths and steam rooms across Australia, for the days
              after a big week.
            </p>
          </div>
          <Link to="/recovery" className="btn">
            Find recovery
          </Link>
        </div>
      </section>
    </div>
  );
}
