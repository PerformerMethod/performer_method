import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { requestMagicCode } from "../lib/api";
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
  const [serviceNote, setServiceNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (member) return <Navigate to="/for-you" replace />;

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await requestMagicCode(email);
    setBusy(false);
    setServiceNote(
      result.status === "sample"
        ? result.detail ?? "Sample mode — Resend email not connected here."
        : "Code requested via pm-api.",
    );
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
      <div className="join-shell glass" style={{ padding: "1.5rem", borderRadius: "var(--radius-xl)" }}>
        <p className="section-kicker">Membership</p>
        <h1 className="section-title">Join The Performer Method</h1>
        <p className="section-lead">
          Email + code via Supabase Auth and Resend. For You notes use Claude
          only after you opt in to sharing check-ins.
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
            <button type="submit" className="btn btn--spotlight" disabled={busy}>
              {busy ? "Sending…" : "Send confirmation code"}
            </button>
          </form>
        ) : (
          <form className="join-form" onSubmit={confirm}>
            {serviceNote ? (
              <p className="service-banner">{serviceNote}</p>
            ) : null}
            <p className="join-hint">
              Demo confirm: enter any 4+ digit code for {email}.
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
                I am 18+ and agree to the <Link to="/terms">Terms</Link> and{" "}
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
                Share check-ins so For You can feel personal (Claude writes from
                site content only — never diagnoses).
              </span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>Send me marketing emails (Resend).</span>
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
