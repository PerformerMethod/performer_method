import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LeafMark } from "./LeafMark";
import { useAuth } from "../hooks/useAuth";
import "./Header.css";

const visitorLinks = [
  { to: "/practitioners", label: "Practitioners" },
  { to: "/method", label: "Method" },
  { to: "/lifecycle", label: "Lifecycle" },
  { to: "/recovery", label: "Recovery" },
];

const memberLinks = [
  { to: "/practitioners", label: "Practitioners" },
  { to: "/for-you", label: "For You" },
  { to: "/community", label: "Community" },
  { to: "/pass", label: "Pass" },
];

export function Header() {
  const { member, live, signOut } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const links = member ? memberLinks : visitorLinks;

  return (
    <header className={`site-header ${hidden ? "is-hidden" : ""}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="The Performer Method home">
          <LeafMark size={22} />
          <span className="brand__name">The Performer Method</span>
          <span className="brand-dot" aria-hidden />
        </Link>
        <span
          className="sample-pill"
          title={
            live
              ? "Signed in to live Supabase session"
              : "Sample UX until you sign in with a live account"
          }
        >
          {live ? "Live" : "Sample"}
        </span>

        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="site-nav__link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          {member ? (
            <>
              <Link to="/me" className="member-chip">
                {member.name.split(" ")[0]}
              </Link>
              <button type="button" className="text-btn" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/join" className="btn btn--spotlight header-cta">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
