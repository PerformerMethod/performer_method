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
  const { member, updateProfile, signOut } = useAuth();
  if (!member) return <Navigate to="/join" replace />;

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
            onChange={(e) =>
              updateProfile({ shareCheckIns: e.target.checked })
            }
          />
          <span>Share check-ins for personalised For You notes.</span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={member.marketing}
            onChange={(e) => updateProfile({ marketing: e.target.checked })}
          />
          <span>Marketing emails.</span>
        </label>

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
