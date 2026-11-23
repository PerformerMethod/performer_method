import { Navigate } from "react-router-dom";
import { passOffers } from "../data/content";
import { useAuth } from "../hooks/useAuth";
import "./Pass.css";

export function Pass() {
  const { member, updateProfile } = useAuth();
  if (!member) return <Navigate to="/join" replace />;

  const offers = passOffers.filter(
    (o) => o.tier === "Debut" || member.tier === "Company",
  );

  return (
    <div className="page">
      <p className="section-kicker">Performer Pass</p>
      <h1 className="section-title">Your Pass</h1>
      <p className="section-lead">
        A digital pass for partner offers at gyms, studios, and recovery spaces.
      </p>

      <div className="pass-card">
        <div className="pass-card__top">
          <span>Performer Method</span>
          <span className="pass-card__tier">{member.tier}</span>
        </div>
        <p className="pass-card__name">{member.name}</p>
        <p className="pass-card__number">{member.passNumber}</p>
        <div className="pass-card__scan" aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => (
            <i key={i} style={{ height: `${30 + ((i * 17) % 50)}%` }} />
          ))}
        </div>
      </div>

      <div className="tier-switch">
        <button
          type="button"
          className={member.tier === "Debut" ? "is-active" : undefined}
          onClick={() => updateProfile({ tier: "Debut" })}
        >
          Debut · free
        </button>
        <button
          type="button"
          className={member.tier === "Company" ? "is-active" : undefined}
          onClick={() => updateProfile({ tier: "Company" })}
        >
          Company · $49/week
        </button>
      </div>

      <div className="offers">
        {offers.map((offer) => (
          <article key={offer.id} className="offer-tile">
            <p className="person-tile__meta">
              {offer.partner} · {offer.tier}
            </p>
            <h3>{offer.perk}</h3>
            <p>{offer.redeem}</p>
          </article>
        ))}
      </div>

      <div className="apply-band">
        <p>
          Partners can check a Pass at the door. Full partner sign-in is planned
          next.
        </p>
      </div>
    </div>
  );
}
