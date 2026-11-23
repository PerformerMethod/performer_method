import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./TabBar.css";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 19c.8-3 3-4.5 5.5-4.5S13.7 16 14.5 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.5 14.8c1.4-.4 2.9-.2 4.2.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v15.5H7.5A2.5 2.5 0 0 0 5 21V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M5 18.5h12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconWave() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M3 14c2-.8 3.5-2.8 5-2.8S11 13.2 13 14s3.5 1.2 5 0 3-2.8 3-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 9c2-.8 3.5-2.8 5-2.8S11 8.2 13 9s3.5 1.2 5 0 3-2.8 3-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPass() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconJoin() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TabBar() {
  const { member } = useAuth();

  const tabs = member
    ? [
        { to: "/", label: "Home", icon: <IconHome />, end: true },
        { to: "/practitioners", label: "Practitioners", icon: <IconPeople /> },
        { to: "/for-you", label: "For You", icon: <IconHeart /> },
        { to: "/community", label: "Community", icon: <IconBook /> },
        { to: "/pass", label: "Pass", icon: <IconPass /> },
      ]
    : [
        { to: "/", label: "Home", icon: <IconHome />, end: true },
        { to: "/practitioners", label: "Practitioners", icon: <IconPeople /> },
        { to: "/method", label: "Method", icon: <IconBook /> },
        { to: "/recovery", label: "Recovery", icon: <IconWave /> },
        { to: "/join", label: "Join", icon: <IconJoin /> },
      ];

  return (
    <nav className="tab-bar" aria-label="Mobile">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `tab-bar__item${isActive ? " is-active" : ""}`
          }
        >
          {tab.icon}
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
