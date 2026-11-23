/**
 * Service boundary for Performer Method.
 *
 * Secrets never live in the browser:
 * - ANTHROPIC_API_KEY → Supabase Edge Function env (pm-recovery)
 * - RESEND_API_KEY → Edge Function env
 * - SUPABASE_SERVICE_ROLE_KEY → Edge Function env only
 *
 * The browser talks to public edge endpoints + Supabase Auth (anon).
 * Until keys/session are available, UX falls back to sample data.
 */

export const PM_API_BASE =
  (typeof window !== "undefined" &&
    (window as Window & { __PM_API_BASE__?: string }).__PM_API_BASE__) ||
  "https://uovcicqaxqzziregyxxz.supabase.co/functions/v1/pm-api";

export const PM_RECOVERY_BASE = PM_API_BASE.replace(/pm-api$/, "pm-recovery");

export type ServiceStatus = "live" | "sample";

export type ApiResult<T> = {
  status: ServiceStatus;
  data: T;
  detail?: string;
};

async function tryJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Auth / profile / Pass — pm-api */
export async function requestMagicCode(email: string): Promise<ApiResult<{ sent: boolean }>> {
  const live = await tryJson<{ sent?: boolean }>(`${PM_API_BASE}/auth/request-code`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (live) return { status: "live", data: { sent: true } };
  return {
    status: "sample",
    data: { sent: true },
    detail: "Demo mode — confirmation UI continues without Resend.",
  };
}

/** Check-ins / For You / Community / AI — pm-recovery */
export async function fetchForYouPicks(payload: {
  memberId: string;
  mind: number;
  body: number;
  voice: number;
  energy: number;
  dayKind: string;
}): Promise<
  ApiResult<{
    note: string;
    practice: string;
    read: string;
    practitionerHint: string;
    weekSummary: string;
  }>
> {
  const live = await tryJson<{
    note: string;
    practice: string;
    read: string;
    practitionerHint: string;
    weekSummary: string;
  }>(`${PM_RECOVERY_BASE}/for-you`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (live) return { status: "live", data: live };

  return {
    status: "sample",
    data: {
      note: `Today looks like a ${payload.dayKind.toLowerCase()}. Keep the warm-up short, drink early, and let the notes stay in the room.`,
      practice: "Two-minute exhale reset",
      read: "Show-day mobility",
      practitionerHint: "Suggested when load runs high",
      weekSummary:
        "A steady midweek with a softer Tuesday — you have been protecting energy better than last week.",
    },
    detail: "Sample picks until Claude runs behind pm-recovery.",
  };
}

export async function moderateCommunityPost(body: {
  title: string;
  detail: string;
  type: string;
}): Promise<ApiResult<{ verdict: "clean" | "flagged"; live: boolean }>> {
  const live = await tryJson<{ verdict: "clean" | "flagged" }>(
    `${PM_RECOVERY_BASE}/community/moderate`,
    { method: "POST", body: JSON.stringify(body) },
  );
  if (live)
    return {
      status: "live",
      data: { verdict: live.verdict, live: live.verdict === "clean" },
    };
  return {
    status: "sample",
    data: {
      verdict: body.type === "accommodation" ? "flagged" : "clean",
      live: body.type !== "accommodation",
    },
    detail: "Sample moderation rules until Anthropic moderation is connected.",
  };
}
