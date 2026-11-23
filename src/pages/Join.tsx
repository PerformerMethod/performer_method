import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Join.css";

export function Join() {
  const { member, signInDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [share, setShare] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");

  if (member) return <Navigate to="/for-you" replace />;

  const sendCode = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setError("");
    setCodeSent(true);
  };

  const confirm = (e: FormEvent) => {
    e.preventDefault();
    if (!ageOk) {
      setError("Confirm you are 18+ and agree to the Terms and Privacy Policy.");
      return;
    }
    if (code.trim().length < 4) {
      setError("Enter the confirmation code from your email.");
      return;
    }
    setError("");
    signInDemo();
  };

  return (
    <div className="page">
      <div className="join-shell">
        <p className="section-kicker">Membership</p>
        <h1 className="section-title">Join Performer Method</h1>
        <p className="section-lead">
          Sign up with email, confirm a code, and unlock For You, Community, and
          your Performer Pass.
        </p>

        {!codeSent ? (
          <form className="join-form" onSubmit={sendCode}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn btn--spotlight">
              Send confirmation code
            </button>
          </form>
        ) : (
          <form className="join-form" onSubmit={confirm}>
            <p className="join-hint">
              Demo mode: enter any 4+ digit code for {email}.
            </p>
            <div className="field">
              <label htmlFor="code">Confirmation code</label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                required
              />
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={ageOk}
                onChange={(e) => setAgeOk(e.target.checked)}
              />
              <span>
                I am 18+ and agree to the{" "}
                <Link to="/terms">Terms</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={share}
                onChange={(e) => setShare(e.target.checked)}
              />
              <span>
                Share check-ins so For You can feel personal (includes AI-written
                notes from site content only).
              </span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>Send me marketing emails.</span>
            </label>
            <button type="submit" className="btn btn--spotlight">
              Confirm and join
            </button>
          </form>
        )}

        {error ? <p className="join-error">{error}</p> : null}

        <button type="button" className="text-btn join-demo" onClick={signInDemo}>
          Skip ahead with demo member
        </button>
      </div>
    </div>
  );
}
