import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const disciplines = [
  "Musical theatre",
  "Acting",
  "Dance",
  "Opera",
  "Circus",
  "Comedy",
  "Music",
  "Stage management",
  "Creative team",
];

const stages = [
  "Audition",
  "Preparation",
  "Rehearsal",
  "Tech",
  "Opening",
  "The Run",
  "Tour",
  "Closing",
  "Not on a show right now",
];

export function Me() {
  const { member, updateProfile, savePrivacy, signOut } = useAuth();
  const [privacyMsg, setPrivacyMsg] = useState("");
  const [privacyBusy, setPrivacyBusy] = useState(false);

  if (!member) return <Navigate to="/join" replace />;

  async function onShareChange(checked: boolean) {
    setPrivacyBusy(true);
    setPrivacyMsg("");
    try {
      await savePrivacy({ shareCheckIns: checked });
      setPrivacyMsg(
        checked
          ? "Sharing is on. For You can use your check-ins."
          : "Sharing is off. New check-ins stay on this device.",
      );
    } catch (err) {
      setPrivacyMsg(
        err instanceof Error ? err.message : "Could not update sharing.",
      );
    } finally {
      setPrivacyBusy(false);
    }
  }

  async function onMarketingChange(checked: boolean) {
    setPrivacyBusy(true);
    setPrivacyMsg("");
    try {
      await savePrivacy({ marketing: checked });
      setPrivacyMsg(
        checked
          ? "You’ll get news and offers."
          : "You won’t get news and offers.",
      );
    } catch (err) {
      setPrivacyMsg(
        err instanceof Error ? err.message : "Could not update marketing.",
      );
    } finally {
      setPrivacyBusy(false);
    }
  }

  return (
    <div className="page">
      <p className="section-kicker">My details</p>
      <h1 className="section-title">Profile</h1>
      <p className="section-lead">
        Favourites and check-ins stay on your account, so a shared iPad does not
        mix members’ data.
      </p>

      <form
        className="join-form"
        style={{ maxWidth: 560, marginTop: "1.5rem" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className="directory-card__avatar"
          style={{ width: 72, height: 72, fontSize: "1.2rem" }}
        >
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={member.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="discipline">Discipline</label>
          <select
            id="discipline"
            value={member.discipline}
            onChange={(e) => updateProfile({ discipline: e.target.value })}
          >
            {disciplines.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="stage">Show cycle</label>
          <select
            id="stage"
            value={member.stage}
            onChange={(e) => updateProfile({ stage: e.target.value })}
          >
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="show">Current show</label>
          <input
            id="show"
            value={member.show}
            onChange={(e) => updateProfile({ show: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={member.city}
            onChange={(e) => updateProfile({ city: e.target.value })}
          />
        </div>

        <label className="check">
          <input
            type="checkbox"
            checked={member.shareCheckIns}
            disabled={privacyBusy}
            onChange={(e) => onShareChange(e.target.checked)}
          />
          <span>
            Share check-ins for personalised For You notes (includes AI help).
          </span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={member.marketing}
            disabled={privacyBusy}
            onChange={(e) => onMarketingChange(e.target.checked)}
          />
          <span>Marketing emails.</span>
        </label>
        {privacyMsg ? (
          <p className="join-hint" role="status">
            {privacyMsg}
          </p>
        ) : null}

        <div className="chip-row" style={{ marginTop: "0.5rem" }}>
          <button type="button" className="btn">
            Delete check-in history
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: "var(--danger)" }}
            onClick={signOut}
          >
            Delete account (demo sign-out)
          </button>
        </div>
      </form>
    </div>
  );
}
