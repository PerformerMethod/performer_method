import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Header.css";

const visitorLinks = [
  { to: "/practitioners", label: "Practitioners" },
  { to: "/method", label: "Method" },
  { to: "/pass", label: "Pass" },
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [member]);

  const links = member ? memberLinks : visitorLinks;

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-pill nav-left">
        <Link to="/" className="brand" aria-label="The Performer Method, home">
          The Performer Method
          <span className="brand-dot" aria-hidden />
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="nav-pill nav-right">
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
        {member ? (
          <>
            <Link to="/me" className="nav-login">
              {member.name.split(" ")[0]}
            </Link>
            <button type="button" className="nav-login" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/join" className="nav-login">
            Log in
          </Link>
        )}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            {menuOpen ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="mobile-menu" id="mobileMenu" hidden={!menuOpen}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        {member ? (
          <>
            <Link to="/me" onClick={() => setMenuOpen(false)}>
              My details
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link to="/join" onClick={() => setMenuOpen(false)}>
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
