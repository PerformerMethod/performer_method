import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { ApiError, getStatus, resendCode } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import "./Join.css";

type Mode = "signin" | "signup" | "verify";

export function Join() {
  const { member, booting, signIn, signUp, verifyEmail, signInDemo } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [share, setShare] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{
    database: boolean;
    signupEnabled: boolean;
  } | null>(null);

  useEffect(() => {
    getStatus()
      .then(setStatus)
      .catch(() =>
        setStatus({ database: false, signupEnabled: false }),
      );
  }, []);

  if (booting) {
    return (
      <div className="page">
        <p className="section-lead">Checking your session…</p>
      </div>
    );
  }

  if (member) return <Navigate to="/for-you" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNote("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else if (mode === "signup") {
        if (!consent) throw new Error("Confirm you are 18+ and agree to the Terms and Privacy Policy.");
        if (password.length < 12) throw new Error("Use at least 12 characters for your password.");
        const r = await signUp({
          name,
          email,
          password,
          consent,
          share,
          marketing,
        });
        setEmail(r.email);
        setMode("verify");
        setNote(`We sent a code to ${r.email}. Check junk too — it can take a minute.`);
      } else {
        await verifyEmail(email, code.replace(/\s/g, ""));
      }
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setBusy(true);
    setError("");
    try {
      await resendCode(email);
      setNote("A new code is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend.");
    } finally {
      setBusy(false);
    }
  };

  const signupBlocked = status && (!status.database || !status.signupEnabled);

  return (
    <div className="page">
      <div
        className="join-shell glass"
        style={{ padding: "1.5rem", borderRadius: "var(--radius-xl)" }}
      >
        <p className="section-kicker">Your space</p>
        <h1 className="section-title">
          {mode === "verify" ? "Check your email." : "Log in to Performer Method"}
        </h1>
        <p className="section-lead">
          Live accounts use your Supabase Auth + Resend codes. Secrets stay on
          the server — this app only talks to pm-api / pm-recovery.
        </p>

        {status ? (
          <p className="service-banner" style={{ marginTop: "1rem" }}>
            {status.database && status.signupEnabled
              ? "Live API connected"
              : "API reachable, but sign-up is not enabled yet"}
          </p>
        ) : null}

        {mode !== "verify" ? (
          <div className="chip-row" style={{ marginTop: "1.25rem" }}>
            <button
              type="button"
              className={`chip ${mode === "signin" ? "is-active" : ""}`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`chip ${mode === "signup" ? "is-active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Create account
            </button>
          </div>
        ) : null}

        <form className="join-form" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {mode !== "verify" ? (
            <div className="field">
              <label htmlFor="password">
                {mode === "signup" ? "Password (12+ characters)" : "Password"}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={mode === "signup" ? 12 : undefined}
                required
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="code">Code from your email</label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </div>
          )}

          {mode === "signup" ? (
            <>
              <label className="check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I’m 18+ and agree to the <Link to="/terms">Terms</Link> and{" "}
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
                  Personalise my experience — share check-ins for For You (includes
                  AI from site content only).
                </span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span>Send me news and offers (Resend).</span>
              </label>
            </>
          ) : null}

          <button
            type="submit"
            className="btn btn--spotlight"
            disabled={busy || (mode === "signup" && !!signupBlocked)}
          >
            {busy
              ? "Working…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Confirm email"}
          </button>
        </form>

        {mode === "verify" ? (
          <button
            type="button"
            className="text-btn join-demo"
            onClick={onResend}
            disabled={busy}
          >
            Send a new code
          </button>
        ) : null}

        {note ? <p className="join-hint" style={{ marginTop: "1rem" }}>{note}</p> : null}
        {error ? <p className="join-error">{error}</p> : null}

        <button type="button" className="text-btn join-demo" onClick={signInDemo}>
          Preview with sample member (offline)
        </button>
      </div>
    </div>
  );
}
