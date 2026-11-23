import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { communityFeed } from "@/content";

export type Member = {
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

export type CommunityPost = {
  id: string;
  kind: string;
  title: string;
  place: string;
  when: string;
  detail: string;
  going: number;
};

const demoMember: Member = {
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

const samplePosts: CommunityPost[] = communityFeed.map((item) => ({
  id: item.id,
  kind: item.type,
  title: item.title,
  place: item.place,
  when: item.when,
  detail: item.meta,
  going: Number.parseInt(item.meta, 10) || 0,
}));

type AppState = {
  member: Member | null;
  favourites: Set<string>;
  posts: CommunityPost[];
  checkInNote: string | null;
  signInDemo: () => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Member>) => void;
  toggleFavourite: (id: string) => void;
  addPost: (input: { kind: string; title: string; detail: string }) => void;
  markGoing: (id: string) => void;
  saveCheckIn: (day: string) => void;
  clearCheckIns: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [extraPosts, setExtraPosts] = useState<CommunityPost[]>([]);
  const [going, setGoing] = useState<Record<string, number>>({});
  const [checkInNote, setCheckInNote] = useState<string | null>(null);

  const posts = useMemo(() => {
    const city = member?.city.trim().toLowerCase() ?? "";
    const sample = samplePosts.filter((post) => {
      const source = communityFeed.find((item) => item.id === post.id);
      if (!source || !city) return true;
      return source.city.toLowerCase() === city;
    });
    return [...extraPosts, ...sample].map((post) => ({
      ...post,
      going: post.going + (going[post.id] ?? 0),
    }));
  }, [extraPosts, going, member?.city]);

  const value = useMemo<AppState>(
    () => ({
      member,
      favourites,
      posts,
      checkInNote,
      signInDemo: () => {
        setMember(demoMember);
        setFavourites(new Set(["cristina-dagostino", "rosie-harris"]));
        setCheckInNote(null);
      },
      signOut: () => {
        setMember(null);
        setFavourites(new Set());
        setExtraPosts([]);
        setGoing({});
        setCheckInNote(null);
      },
      updateProfile: (patch) => {
        setMember((current) => (current ? { ...current, ...patch } : current));
      },
      toggleFavourite: (id) => {
        setFavourites((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      },
      addPost: ({ kind, title, detail }) => {
        const post: CommunityPost = {
          id: `local-${Date.now()}`,
          kind,
          title: title.trim(),
          place: detail.trim(),
          when: "Just now",
          detail: "Your post",
          going: 1,
        };
        setExtraPosts((current) => [post, ...current]);
      },
      markGoing: (id) => {
        setGoing((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
      },
      saveCheckIn: (day) => {
        setCheckInNote(
          `Today looks like a ${day.toLowerCase()}. Keep the warm-up short, drink early, and let the notes stay in the room.`,
        );
      },
      clearCheckIns: () => setCheckInNote(null),
    }),
    [checkInNote, favourites, member, posts],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
