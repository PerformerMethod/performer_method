/**
 * Client for the live Performer Method edge functions.
 * Secrets (Anthropic, Resend, service role) stay in Supabase Function env.
 * Browser only sends session Bearer tokens + JSON bodies.
 *
 * Locally, Vite proxies /pm-api and /pm-recovery to bypass CORS
 * (production CORS allows performermethod.com only).
 */

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
};

export type Me = {
  name?: string;
  email?: string;
  since?: string;
  practitioner?: boolean;
  profile?: {
    city?: string;
    disciplines?: string[];
    current_work?: string;
    phase?: number | null;
    focus?: string[];
  };
};

export type Pass = {
  name: string;
  number: string;
  code: string;
  tier: "debut" | "member" | string;
  status: "active" | "paused" | string;
  issued_at?: string;
};

export type Listing = {
  id: string;
  name: string;
  role?: string;
  category?: string;
  place?: string;
  practice?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  booking_url?: string;
  photo_url?: string;
};

/** Privacy preferences from pm-recovery `/me/settings`. */
export type MemberSettings = {
  share?: boolean | null;
  ai?: boolean | null;
  ai_ok?: boolean | null;
  marketing?: boolean | null;
  share_at?: string | null;
};

const AUTH_KEY = "pm.auth";

export function apiBase() {
  if (import.meta.env.DEV) return "/pm-api";
  if (typeof window !== "undefined" && window.__PM_API_BASE__) {
    return window.__PM_API_BASE__;
  }
  return "https://uovcicqaxqzziregyxxz.supabase.co/functions/v1/pm-api";
}

export function recoveryBase() {
  return apiBase().replace(/\/pm-api\/?$/, "/pm-recovery");
}

export function loadStoredRefresh(): string | null {
  try {
    const raw = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    return raw?.r ?? null;
  } catch {
    return null;
  }
}

export function storeRefresh(refresh: string | null) {
  try {
    if (refresh) localStorage.setItem(AUTH_KEY, JSON.stringify({ r: refresh }));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

type ApiOpts = {
  method?: string;
  body?: unknown;
  authenticated?: boolean;
  retry?: boolean;
  base?: string;
  session?: Session | null;
  onSession?: (s: Session | null) => void;
};

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T = unknown>(
  route: string,
  {
    method = "GET",
    body,
    authenticated = true,
    retry = true,
    base,
    session = null,
    onSession,
  }: ApiOpts = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authenticated && session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${base || apiBase()}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({
    error: "The account service did not respond as expected.",
  }))) as { error?: string } & T;

  if (res.status === 401 && session?.refresh_token && retry) {
    const renewed = await api<Session>("/api/auth/refresh", {
      method: "POST",
      body: { refresh_token: session.refresh_token },
      authenticated: false,
      retry: false,
    });
    onSession?.(renewed);
    return api<T>(route, {
      method,
      body,
      authenticated,
      retry: false,
      base,
      session: renewed,
      onSession,
    });
  }

  if (!res.ok) throw new ApiError(data.error || "That action could not be completed.");
  return data as T;
}

export async function getStatus() {
  return api<{
    database: boolean;
    signupEnabled: boolean;
  }>("/api/status", { authenticated: false });
}

export async function signUp(body: {
  name: string;
  email: string;
  password: string;
  consent: boolean;
}) {
  return api<{ email?: string }>("/api/auth/signup", {
    method: "POST",
    body,
    authenticated: false,
  });
}

export async function verifyEmail(body: { email: string; code: string }) {
  return api<Session>("/api/auth/verify-email", {
    method: "POST",
    body,
    authenticated: false,
  });
}

export async function resendCode(email: string) {
  return api("/api/auth/resend", {
    method: "POST",
    body: { email },
    authenticated: false,
  });
}

export async function signIn(body: { email: string; password: string }) {
  return api<Session>("/api/auth/signin", {
    method: "POST",
    body,
    authenticated: false,
  });
}

export async function refreshSession(refresh_token: string) {
  return api<Session>("/api/auth/refresh", {
    method: "POST",
    body: { refresh_token },
    authenticated: false,
    retry: false,
  });
}

export async function signOut(session: Session | null) {
  if (!session) return;
  try {
    await api("/api/auth/signout", { method: "POST", session });
  } catch {
    /* ignore */
  }
}

export async function getMe(session: Session, onSession?: (s: Session | null) => void) {
  return api<Me>("/api/me", { session, onSession });
}

export async function getPass(session: Session, onSession?: (s: Session | null) => void) {
  return api<Pass>("/api/pass", { session, onSession });
}

export async function getDirectory() {
  return api<{ listings: Listing[] }>("/api/directory", { authenticated: false });
}

export async function saveCheckins(
  session: Session,
  items: unknown[],
  freq: unknown,
  onSession?: (s: Session | null) => void,
) {
  return api("/me/checkins", {
    method: "POST",
    body: { items, freq },
    base: recoveryBase(),
    session,
    onSession,
  });
}

export async function getSettings(
  session: Session,
  onSession?: (s: Session | null) => void,
) {
  return api<{ settings?: MemberSettings; photo_url?: string }>("/me/settings", {
    base: recoveryBase(),
    session,
    onSession,
  });
}

export async function setSettings(
  session: Session,
  body: { share?: boolean; ai?: boolean; marketing?: boolean },
  onSession?: (s: Session | null) => void,
) {
  return api<{ settings?: MemberSettings }>("/me/settings", {
    method: "POST",
    body,
    base: recoveryBase(),
    session,
    onSession,
  });
}

/** Sharing for For You / AI is only on when both flags are explicitly true. */
export function sharingEnabled(settings?: MemberSettings | null): boolean {
  return settings?.share === true && settings?.ai_ok === true;
}

export async function forYou(
  session: Session,
  body: unknown,
  onSession?: (s: Session | null) => void,
) {
  return api<{
    practice?: string;
    reads?: string[];
    person?: string;
    line?: string;
    note?: string;
  }>("/me/foryou", {
    method: "POST",
    body,
    base: recoveryBase(),
    session,
    onSession,
  });
}

export async function weeklySummary(
  session: Session,
  onSession?: (s: Session | null) => void,
) {
  return api<{ summary?: string }>("/me/weekly", {
    method: "POST",
    body: {},
    base: recoveryBase(),
    session,
    onSession,
  });
}

export async function getCommunity(
  session: Session,
  city: string,
  onSession?: (s: Session | null) => void,
) {
  return api<{
    posts?: Array<{
      id: string;
      kind: string;
      city: string;
      status: string;
      data: Record<string, string>;
    }>;
    shows?: unknown[];
  }>(`/me/community?city=${encodeURIComponent(city)}`, {
    base: recoveryBase(),
    session,
    onSession,
  });
}

export async function createCommunityPost(
  session: Session,
  body: { kind: string; city: string; data: Record<string, string> },
  onSession?: (s: Session | null) => void,
) {
  return api("/me/community/posts", {
    method: "POST",
    body,
    base: recoveryBase(),
    session,
    onSession,
  });
}

declare global {
  interface Window {
    __PM_API_BASE__?: string;
  }
}
