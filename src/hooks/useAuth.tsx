import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
};

type AuthContextValue = {
  member: MemberProfile | null;
  favourites: Set<string>;
  signInDemo: () => void;
  signOut: () => void;
  toggleFavourite: (id: string) => void;
  updateProfile: (patch: Partial<MemberProfile>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(
    () => new Set(["p1", "p3"]),
  );

  const signInDemo = useCallback(() => setMember(demoMember), []);
  const signOut = useCallback(() => setMember(null), []);

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

  const value = useMemo(
    () => ({
      member,
      favourites,
      signInDemo,
      signOut,
      toggleFavourite,
      updateProfile,
    }),
    [member, favourites, signInDemo, signOut, toggleFavourite, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
