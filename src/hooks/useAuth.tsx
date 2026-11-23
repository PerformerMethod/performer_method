import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  getPass,
  getSettings,
  loadStoredRefresh,
  refreshSession,
  setSettings,
  sharingEnabled,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  storeRefresh,
  verifyEmail as apiVerifyEmail,
  type Me,
  type MemberSettings,
  type Pass,
  type Session,
} from "../lib/api";

export type MemberProfile = {
  name: string;
  email: string;
  city: string;
  discipline: string;
  stage: string;
  show: string;
  shareCheckIns: boolean;
  marketing: boolean;
  tier: "Debut" | "Company";
  passNumber: string;
  passCode?: string;
  live: boolean;
};

type AuthContextValue = {
  member: MemberProfile | null;
  session: Session | null;
  me: Me | null;
  pass: Pass | null;
  favourites: Set<string>;
  booting: boolean;
  live: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    consent: boolean;
    share: boolean;
    marketing: boolean;
  }) => Promise<{ email: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInDemo: () => void;
  toggleFavourite: (id: string) => void;
  updateProfile: (patch: Partial<MemberProfile>) => void;
  savePrivacy: (patch: {
    shareCheckIns?: boolean;
    marketing?: boolean;
  }) => Promise<void>;
  refreshMember: () => Promise<void>;
  withSession: <T>(fn: (session: Session) => Promise<T>) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PHASES = [
  "Audition",
  "Preparation",
  "Rehearsal",
  "Tech",
  "Opening",
  "The Run",
  "Tour",
  "Closing",
];

function mapMember(
  me: Me,
  pass: Pass | null,
  live: boolean,
  settings?: MemberSettings | null,
): MemberProfile {
  const profile = me.profile || {};
  const phase =
    profile.phase !== null && profile.phase !== undefined
      ? PHASES[profile.phase] || "Not on a show right now"
      : "Not on a show right now";
  return {
    name: me.name || "Member",
    email: me.email || "",
    city: profile.city || "Sydney",
    discipline: profile.disciplines?.[0] || "Musical theatre",
    stage: phase,
    show: profile.current_work || "",
    // Default off until server prefs confirm share + AI consent.
    shareCheckIns: sharingEnabled(settings),
    marketing: settings?.marketing === true,
    tier: pass?.tier === "member" ? "Company" : "Debut",
    passNumber: pass?.number || "—",
    passCode: pass?.code,
    live,
  };
}

const demoMember: MemberProfile = {
  name: "Alex Rivera",
  email: "alex@example.com",
  city: "Sydney",
  discipline: "Musical theatre",
  stage: "The Run",
  show: "Hamilton",
  shareCheckIns: true,
  marketing: false,
  tier: "Debut",
  passNumber: "PM-48291",
  live: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [pass, setPass] = useState<Pass | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
  const [booting, setBooting] = useState(true);
  const [live, setLive] = useState(false);
  const refreshTimer = useRef<number | null>(null);

  const applySession = useCallback((value: Session | null) => {
    setSession(value);
    storeRefresh(value?.refresh_token ?? null);
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    if (value?.refresh_token) {
      const wait = Math.max(30, (value.expires_in || 3600) - 60) * 1000;
      refreshTimer.current = window.setTimeout(async () => {
        try {
          const next = await refreshSession(value.refresh_token);
          applySession(next);
        } catch {
          applySession(null);
          setMe(null);
          setPass(null);
          setMember(null);
          setLive(false);
        }
      }, wait);
    }
  }, []);

  const hydrate = useCallback(
    async (s: Session) => {
      const onSession = (next: Session | null) => applySession(next);
      const profile = await getMe(s, onSession);
      let passData: Pass | null = null;
      try {
        passData = await getPass(s, onSession);
      } catch {
        passData = null;
      }
      let settings: MemberSettings | null = null;
      try {
        const res = await getSettings(s, onSession);
        settings = res.settings ?? null;
      } catch {
        settings = null;
      }
      setMe(profile);
      setPass(passData);
      setMember(mapMember(profile, passData, true, settings));
      setLive(true);
      try {
        localStorage.setItem("pm.who", (profile.email || "").toLowerCase());
      } catch {
        /* ignore */
      }
      return { profile, settings };
    },
    [applySession],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const refresh = loadStoredRefresh();
      if (!refresh) {
        if (!cancelled) setBooting(false);
        return;
      }
      try {
        const next = await refreshSession(refresh);
        if (cancelled) return;
        applySession(next);
        await hydrate(next);
      } catch {
        storeRefresh(null);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, [applySession, hydrate]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const next = await apiSignIn({ email, password });
      applySession(next);
      await hydrate(next);
    },
    [applySession, hydrate],
  );

  const signUp = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      consent: boolean;
      share: boolean;
      marketing: boolean;
    }) => {
      try {
        localStorage.setItem("pm.pending.email", input.email.trim().toLowerCase());
        localStorage.setItem("pm.share.pending", input.share ? "1" : "0");
        localStorage.setItem("pm.marketing.pending", input.marketing ? "1" : "0");
      } catch {
        /* ignore */
      }
      const r = await apiSignUp({
        name: input.name,
        email: input.email,
        password: input.password,
        consent: input.consent,
      });
      return { email: r.email || input.email };
    },
    [],
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      const next = await apiVerifyEmail({ email, code });
      applySession(next);
      const hydrated = await hydrate(next);
      try {
        const share = localStorage.getItem("pm.share.pending");
        const marketing = localStorage.getItem("pm.marketing.pending");
        const pendingEmail = localStorage.getItem("pm.pending.email") || "";
        const meEmail = (hydrated.profile.email || "").trim().toLowerCase();
        if (pendingEmail && pendingEmail !== meEmail) return;
        if (share === null && marketing === null) return;

        const current = hydrated.settings || {};
        const patch: { share?: boolean; ai?: boolean; marketing?: boolean } =
          {};
        if (
          share !== null &&
          (current.share === null || current.share === undefined)
        ) {
          patch.share = share === "1";
          if (share === "1") patch.ai = true;
        }
        if (
          marketing !== null &&
          (current.marketing === null || current.marketing === undefined)
        ) {
          patch.marketing = marketing === "1";
        }
        if (Object.keys(patch).length) {
          await setSettings(next, patch, applySession);
        }
        [
          "pm.share.pending",
          "pm.marketing.pending",
          "pm.pending.email",
        ].forEach((k) => localStorage.removeItem(k));
        await hydrate(next);
      } catch {
        /* preferences can be set later in My details */
      }
    },
    [applySession, hydrate],
  );

  const signOut = useCallback(async () => {
    await apiSignOut(session);
    applySession(null);
    setMe(null);
    setPass(null);
    setMember(null);
    setLive(false);
    try {
      localStorage.removeItem("pm.who");
    } catch {
      /* ignore */
    }
  }, [applySession, session]);

  const signInDemo = useCallback(() => {
    applySession(null);
    setMe(null);
    setPass(null);
    setMember(demoMember);
    setLive(false);
    setFavourites(new Set(["p1", "p3"]));
  }, [applySession]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const updateProfile = useCallback((patch: Partial<MemberProfile>) => {
    setMember((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const savePrivacy = useCallback(
    async (patch: { shareCheckIns?: boolean; marketing?: boolean }) => {
      setMember((prev) =>
        prev
          ? {
              ...prev,
              ...(patch.shareCheckIns !== undefined
                ? { shareCheckIns: patch.shareCheckIns }
                : {}),
              ...(patch.marketing !== undefined
                ? { marketing: patch.marketing }
                : {}),
            }
          : prev,
      );

      // Demo / offline: keep the choice on-device only.
      if (!live || !session) return;

      const body: { share?: boolean; ai?: boolean; marketing?: boolean } = {};
      if (patch.shareCheckIns !== undefined) {
        body.share = patch.shareCheckIns;
        body.ai = patch.shareCheckIns;
      }
      if (patch.marketing !== undefined) {
        body.marketing = patch.marketing;
      }

      try {
        const res = await setSettings(session, body, applySession);
        const st = res.settings || null;
        setMember((prev) =>
          prev
            ? {
                ...prev,
                shareCheckIns: sharingEnabled(st),
                marketing: st?.marketing === true,
              }
            : prev,
        );
      } catch (err) {
        // Revert optimistic UI from the last known server hydrate.
        await hydrate(session);
        throw err;
      }
    },
    [applySession, hydrate, live, session],
  );

  const refreshMember = useCallback(async () => {
    if (!session) return;
    await hydrate(session);
  }, [hydrate, session]);

  const withSession = useCallback(
    async <T,>(fn: (session: Session) => Promise<T>) => {
      if (!session) throw new Error("Sign in to continue.");
      return fn(session);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      member,
      session,
      me,
      pass,
      favourites,
      booting,
      live,
      signIn,
      signUp,
      verifyEmail,
      signOut,
      signInDemo,
      toggleFavourite,
      updateProfile,
      savePrivacy,
      refreshMember,
      withSession,
    }),
    [
      member,
      session,
      me,
      pass,
      favourites,
      booting,
      live,
      signIn,
      signUp,
      verifyEmail,
      signOut,
      signInDemo,
      toggleFavourite,
      updateProfile,
      savePrivacy,
      refreshMember,
      withSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
