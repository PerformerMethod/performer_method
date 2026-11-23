type Props = {
  kind: "terms" | "privacy";
};

export function Legal({ kind }: Props) {
  const isTerms = kind === "terms";

  return (
    <div className="page">
      <p className="section-kicker">Legal</p>
      <h1 className="section-title">
        {isTerms ? "Terms and Conditions" : "Privacy Policy"}
      </h1>
      <p className="section-lead">
        Placeholder pages covering Community and AI use. Replace with the
        founder’s PDF content before launch.
      </p>

      <div className="soft-panel" style={{ marginTop: "1.5rem" }}>
        {isTerms ? (
          <>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              By joining Performer Method you confirm you are 18 or older, will
              treat Community spaces with care, and will not use the platform to
              share other people’s private details without consent.
            </p>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.65,
                marginTop: "1rem",
              }}
            >
              AI features write personal notes and picks only from site content,
              never diagnose, and only run when you opt in to sharing check-ins.
            </p>
          </>
        ) : (
          <>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              We store account details, favourites, and check-ins per member.
              Names and emails are never sent to the AI provider.
            </p>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.65,
                marginTop: "1rem",
              }}
            >
              Marketing email is optional. You can delete check-in history or
              your account from My details.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
