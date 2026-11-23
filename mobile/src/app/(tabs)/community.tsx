import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import {
  Banner,
  Button,
  Card,
  Chip,
  ChipRow,
  Kicker,
  TabScreen,
  Title,
} from "@/components/ui";
import { useAppState } from "@/state";
import { colors } from "@/theme";

const kinds = [
  { id: "event", label: "Event" },
  { id: "class", label: "Class" },
  { id: "recommendation", label: "Recommendation" },
  { id: "parking", label: "Parking tip" },
  { id: "accommodation", label: "Accommodation" },
] as const;

export default function CommunityScreen() {
  const { member, posts, addPost, markGoing } = useAppState();
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("event");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  if (!member) return null;

  const publish = () => {
    if (!title.trim() || !detail.trim()) {
      setError("Add a title and a detail before posting.");
      return;
    }
    addPost({ kind, title, detail });
    setTitle("");
    setDetail("");
    setError("");
    setNote(
      kind === "accommodation"
        ? "Held for founder review. Accommodation posts wait."
        : `Posted to the ${member.city} sample feed.`,
    );
  };

  return (
    <TabScreen>
      <Kicker>Community</Kicker>
      <Title>What’s on in {member.city}</Title>
      <Text style={styles.lead}>
        Events, classes, recommendations, parking, and accommodation.
      </Text>
      <Banner>Sample feed for {member.city}. Posts you add stay on this phone.</Banner>
      <Card>
        <Kicker>On in your city</Kicker>
        <Text style={styles.show}>{member.show || "Your current show"}</Text>
        <Text style={styles.body}>Matched from the show name on your profile.</Text>
      </Card>
      <Kicker>Coming up</Kicker>
      {posts.length === 0 ? (
        <Text style={styles.body}>Nothing in {member.city} yet. Share the first note.</Text>
      ) : null}
      {posts.map((post) => (
        <Card key={post.id}>
          <Text style={styles.meta}>
            {post.kind} · {post.when}
          </Text>
          <Text style={styles.itemTitle}>{post.title}</Text>
          <Text style={styles.body}>{post.place}</Text>
          <Button label={`Going · ${post.going}`} tone="ghost" onPress={() => markGoing(post.id)} />
        </Card>
      ))}

      <Kicker>Share something</Kicker>
      <ChipRow>
        {kinds.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            selected={kind === option.id}
            onPress={() => setKind(option.id)}
          />
        ))}
      </ChipRow>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="What’s happening?"
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel="Post title"
      />
      <TextInput
        value={detail}
        onChangeText={setDetail}
        placeholder="Where, when, or why it matters"
        placeholderTextColor={colors.muted}
        style={[styles.input, styles.detail]}
        accessibilityLabel="Post details"
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {note ? <Text style={styles.ok}>{note}</Text> : null}
      <Button label={`Post to ${member.city}`} onPress={publish} />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  show: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  body: { color: colors.ink2, fontSize: 15, lineHeight: 21 },
  meta: { color: colors.muted, fontSize: 13, textTransform: "capitalize" },
  itemTitle: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  input: {
    backgroundColor: colors.stone2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  detail: { minHeight: 88, textAlignVertical: "top" },
  error: { color: colors.danger, fontSize: 14 },
  ok: { color: colors.ok, fontSize: 14 },
});
