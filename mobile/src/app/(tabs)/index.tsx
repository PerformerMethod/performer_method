import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { practitioners, pillars } from "@/content";
import { Button, Card, Kicker, TabScreen } from "@/components/ui";
import { portraits, hero } from "@/photos";
import { useAppState } from "@/state";
import { colors, pillarColor } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { member } = useAppState();
  const preview = practitioners.slice(0, 3);

  return (
    <TabScreen>
      <View style={styles.heroWrap}>
        <Image
          source={hero}
          style={styles.hero}
          accessibilityLabel="Two performers stretching in a sunlit rehearsal studio"
        />
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>
            Connecting performers with the professionals who understand them.
          </Text>
        </View>
      </View>

      <Button
        label="Find a practitioner"
        onPress={() => router.push("/practitioners")}
      />
      <Button
        label={member ? "Open your Pass" : "Join the community"}
        tone="ghost"
        onPress={() => router.push(member ? "/pass" : "/join")}
      />

      {member ? (
        <Card onPress={() => router.push("/for-you")}>
          <Kicker>Welcome back</Kicker>
          <Text style={styles.cardTitle}>
            {member.name.split(" ")[0]}, you are in {member.stage}
            {member.show ? ` on ${member.show}` : ""}.
          </Text>
          <Text style={styles.cardBody}>Your For You page is ready when you are.</Text>
        </Card>
      ) : null}

      <View style={styles.block}>
        <Kicker>Your support team</Kicker>
        <Text style={styles.sectionTitle}>Practitioners who know the work.</Text>
        {preview.map((person) => (
          <Card
            key={person.id}
            onPress={() =>
              router.push({ pathname: "/practitioner/[id]", params: { id: person.id } })
            }
          >
            <View style={styles.person}>
              {portraits[person.id] ? (
                <Image source={portraits[person.id]} style={styles.portrait} />
              ) : (
                <View style={styles.initials}>
                  <Text style={styles.initialsText}>{person.initials}</Text>
                </View>
              )}
              <View style={styles.personCopy}>
                <Text style={styles.cardTitle}>{person.name}</Text>
                <Text style={styles.meta}>
                  {person.specialty} · {person.location}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.block}>
        <Kicker>The Method</Kicker>
        <Text style={styles.sectionTitle}>Four ways to stay in the work.</Text>
        {pillars.map((pillar) => (
          <Card
            key={pillar.id}
            onPress={() =>
              router.push({ pathname: "/pillar/[id]", params: { id: pillar.id } })
            }
          >
            <Text style={[styles.pillarMark, { color: pillarColor[pillar.id] }]}>
              {pillar.title}
            </Text>
            <Text style={styles.cardBody}>{pillar.summary}</Text>
          </Card>
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  heroWrap: { borderRadius: 28, overflow: "hidden", backgroundColor: colors.stone },
  hero: { width: "100%", height: 240 },
  heroCopy: {
    padding: 16,
    backgroundColor: colors.stone2,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.6,
  },
  block: { gap: 10 },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  cardBody: { color: colors.ink2, fontSize: 15, lineHeight: 21 },
  meta: { color: colors.muted, fontSize: 14 },
  person: { flexDirection: "row", gap: 12, alignItems: "center" },
  personCopy: { flex: 1, gap: 4 },
  portrait: { width: 64, height: 80, borderRadius: 14 },
  initials: {
    width: 64,
    height: 80,
    borderRadius: 14,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { color: colors.ink, fontWeight: "700", fontSize: 18 },
  pillarMark: { fontSize: 13, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase" },
});
