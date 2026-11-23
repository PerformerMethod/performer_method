import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link to="/" className="footer-brand">
            The Performer Method
            <span className="brand-dot" aria-hidden />
          </Link>
          <p className="footer-tag">
            Connecting performers with the professionals who understand them.
          </p>
        </div>
        <div className="footer-cols">
          <div>
            <p className="label label-light">Explore</p>
            <Link to="/practitioners">Practitioners</Link>
            <Link to="/method">Method</Link>
            <Link to="/pass">Pass</Link>
            <Link to="/recovery">Recovery</Link>
          </div>
          <div>
            <p className="label label-light">Members</p>
            <Link to="/join">Log in</Link>
            <Link to="/for-you">For You</Link>
            <Link to="/community">Community</Link>
          </div>
          <div>
            <p className="label label-light">Contact</p>
            <a href="mailto:will@performermethod.com">will@performermethod.com</a>
            <a
              href="https://performermethod.com"
              target="_blank"
              rel="noreferrer"
            >
              performermethod.com
            </a>
          </div>
        </div>
      </div>
      <div className="footer-legal">
        <Link to="/privacy">Privacy</Link>
        <span aria-hidden>·</span>
        <Link to="/terms">Terms</Link>
        <span aria-hidden>·</span>
        <span>© 2026 The Performer Method</span>
      </div>
    </footer>
  );
}
