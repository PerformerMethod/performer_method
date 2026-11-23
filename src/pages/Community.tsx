import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { communityFeed } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Community.css";

export function Community() {
  const { member } = useAuth();
  const [posted, setPosted] = useState(false);

  if (!member) return <Navigate to="/join" replace />;

  const cityFeed = communityFeed.filter((item) => item.city === member.city);

  const onPost = (e: FormEvent) => {
    e.preventDefault();
    setPosted(true);
  };

  return (
    <div className="page">
      <p className="section-kicker">Community</p>
      <h1 className="section-title">What’s on in {member.city}</h1>
      <p className="section-lead">
        Events, classes, recommendations, parking, and accommodation — city by
        city. New posts are moderated before they go live when needed.
      </p>

      <section className="show-band soft-panel">
        <p className="section-kicker">On in your city</p>
        <div className="show-art" aria-hidden />
        <h2>Hamilton</h2>
        <p>Matched from member show names — artwork managed in admin.</p>
      </section>

      <section style={{ marginTop: "1.75rem" }}>
        <p className="section-kicker">Coming up</p>
        <div className="community-grid">
          {cityFeed.map((item) => (
            <article key={item.id} className="community-tile">
              <p className="person-tile__meta">
                {item.type} · {item.when}
              </p>
              <h3>{item.title}</h3>
              <p>{item.place}</p>
              <div className="community-actions">
                <button type="button">Going</button>
                <button type="button">Recommend</button>
                <button type="button">Helpful</button>
                <span>{item.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-panel" style={{ marginTop: "1.75rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Share something
        </h2>
        {posted ? (
          <p style={{ color: "var(--ok)" }}>
            Post received. Clean posts go live at once; flagged posts and all
            accommodation wait for founder review.
          </p>
        ) : (
          <form onSubmit={onPost} className="post-form">
            <div className="field">
              <label htmlFor="post-type">Type</label>
              <select id="post-type" defaultValue="event">
                <option value="event">Event</option>
                <option value="class">Class</option>
                <option value="place">Recommendation</option>
                <option value="parking">Parking tip</option>
                <option value="accommodation">Accommodation</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="post-title">Title</label>
              <input id="post-title" required placeholder="What’s happening?" />
            </div>
            <div className="field">
              <label htmlFor="post-detail">Details</label>
              <textarea id="post-detail" rows={3} required />
            </div>
            <button type="submit" className="btn">
              Post to {member.city}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
