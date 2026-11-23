import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { communityFeed } from "../data/content";
import { createCommunityPost, getCommunity } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import "./Community.css";

type Post = {
  id: string;
  kind: string;
  title: string;
  place: string;
  when: string;
  meta: string;
};

export function Community() {
  const { member, live, withSession } = useAuth();
  const [posted, setPosted] = useState(false);
  const [postNote, setPostNote] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [source, setSource] = useState<"live" | "sample">("sample");

  useEffect(() => {
    if (!member || !live) {
      setPosts(
        communityFeed
          .filter((item) => item.city === member?.city)
          .map((item) => ({
            id: item.id,
            kind: item.type,
            title: item.title,
            place: item.place,
            when: item.when,
            meta: item.meta,
          })),
      );
      setSource("sample");
      return;
    }
    withSession((session) => getCommunity(session, member.city))
      .then((data) => {
        const mapped =
          data.posts
            ?.filter((p) => p.status === "live" || p.status === "approved")
            .map((p) => ({
              id: p.id,
              kind: p.kind,
              title: p.data.title || p.data.name || p.data.spot || "Community post",
              place: p.data.place || p.data.where || member.city,
              when: p.status,
              meta: p.kind,
            })) ?? [];
        setPosts(
          mapped.length
            ? mapped
            : communityFeed
                .filter((item) => item.city === member.city)
                .map((item) => ({
                  id: item.id,
                  kind: item.type,
                  title: item.title,
                  place: item.place,
                  when: item.when,
                  meta: item.meta,
                })),
        );
        setSource(mapped.length ? "live" : "sample");
      })
      .catch(() => setSource("sample"));
  }, [live, member, withSession]);

  if (!member) return <Navigate to="/join" replace />;

  const onPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const kind = String(form.get("type") ?? "event");
    const title = String(form.get("title") ?? "");
    const detail = String(form.get("detail") ?? "");

    if (!live) {
      setPostNote(
        kind === "accommodation"
          ? "Held for founder review (sample)."
          : "Sample post — sign in with a live account to publish.",
      );
      setPosted(true);
      return;
    }

    try {
      await withSession((session) =>
        createCommunityPost(session, {
          kind: kind === "accommodation" ? "accom" : kind === "recommendation" ? "rec" : kind,
          city: member.city,
          data: { title, detail },
        }),
      );
      setPostNote(
        kind === "accommodation"
          ? "Sent for founder review (accommodation always waits)."
          : "Posted — clean posts go live; flagged ones wait for review.",
      );
      setPosted(true);
    } catch (err) {
      setPostNote(err instanceof Error ? err.message : "Could not post.");
      setPosted(true);
    }
  };

  return (
    <div className="page">
      <p className="section-kicker">Community</p>
      <h1 className="section-title">What’s on in {member.city}</h1>
      <p className="section-lead">
        Events, classes, recommendations, parking, and accommodation — city by
        city.
      </p>
      <p className="service-banner" style={{ margin: "1rem 0" }}>
        {source === "live" ? "Live community from pm-recovery" : "Sample feed"}
      </p>

      <section className="show-band soft-panel">
        <p className="section-kicker">On in your city</p>
        <div className="show-art" aria-hidden />
        <h2>{member.show || "Your current show"}</h2>
        <p>Matched from member show names — artwork managed in admin.</p>
      </section>

      <section style={{ marginTop: "1.75rem" }}>
        <p className="section-kicker">Coming up</p>
        <div className="community-grid">
          {posts.map((item) => (
            <article key={item.id} className="community-tile">
              <p className="person-tile__meta">
                {item.kind} · {item.when}
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
          <p style={{ color: "var(--ok)" }}>{postNote}</p>
        ) : (
          <form onSubmit={onPost} className="post-form">
            <div className="field">
              <label htmlFor="post-type">Type</label>
              <select id="post-type" name="type" defaultValue="event">
                <option value="event">Event</option>
                <option value="class">Class</option>
                <option value="rec">Recommendation</option>
                <option value="parking">Parking tip</option>
                <option value="accommodation">Accommodation</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="post-title">Title</label>
              <input
                id="post-title"
                name="title"
                required
                placeholder="What’s happening?"
              />
            </div>
            <div className="field">
              <label htmlFor="post-detail">Details</label>
              <textarea id="post-detail" name="detail" rows={3} required />
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
