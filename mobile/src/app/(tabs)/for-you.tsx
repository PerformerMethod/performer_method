import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { lifecycleStages, practitioners } from "@/content";
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

const dayKinds = [
  "Rehearsal day",
  "Single show day",
  "Double show day",
  "Audition day",
  "Travel day",
  "A day for me",
] as const;

const scoreKeys = ["mind", "body", "voice", "energy"] as const;

export default function ForYouScreen() {
  const router = useRouter();
  const { member, favourites, checkInNote, saveCheckIn } = useAppState();
  const [day, setDay] = useState<(typeof dayKinds)[number]>("Single show day");
  const [scores, setScores] = useState({ mind: 6, body: 5, voice: 6, energy: 5 });

  if (!member) return null;

  const stage = lifecycleStages.find((item) => item.title === member.stage);
  const saved = practitioners.filter((person) => favourites.has(person.id));
  const person = saved[0] ?? practitioners[0];
  const week = [46, 62, 38, 70, 55, 48, 64];

  return (
    <TabScreen>
      <Kicker>For You</Kicker>
      <Title>Good to see you, {member.name.split(" ")[0]}.</Title>
      <Banner>
        {checkInNote ??
          "After your check-in, today’s note lands here. Picks stay inside the Method and the practitioner directory."}
      </Banner>

      {stage ? (
        <Card>
          <Kicker>Your stage</Kicker>
          <Text style={styles.stage}>{stage.title}</Text>
          <Text style={styles.body}>{stage.guidance}</Text>
        </Card>
      ) : null}

      <Card>
        <Kicker>Your week</Kicker>
        <View style={styles.bars}>
          {week.map((value, index) => (
            <View key={index} style={styles.barTrack}>
              <View style={[styles.bar, { height: `${value}%` }]} />
            </View>
          ))}
        </View>
        <Text style={styles.body}>
          A steady midweek with a softer Tuesday. You have been protecting energy better than last week.
        </Text>
      </Card>

      <Kicker>Check-in</Kicker>
      <Text style={styles.question}>What kind of day is it?</Text>
      <ChipRow>
        {dayKinds.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={day === option}
            onPress={() => setDay(option)}
          />
        ))}
      </ChipRow>
      {scoreKeys.map((key) => (
        <View key={key} style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>{key}</Text>
          <View style={styles.stepper}>
            <Text
              accessibilityRole="button"
              onPress={() =>
                setScores((current) => ({ ...current, [key]: Math.max(1, current[key] - 1) }))
              }
              style={styles.step}
            >
              −
            </Text>
            <Text style={styles.scoreValue}>{scores[key]}</Text>
            <Text
              accessibilityRole="button"
              onPress={() =>
                setScores((current) => ({ ...current, [key]: Math.min(10, current[key] + 1) }))
              }
              style={styles.step}
            >
              +
            </Text>
          </View>
        </View>
      ))}
      {scores.body <= 3 ? (
        <Banner>
          A low body score is a cue to pace the day. Chest pain or sharp sudden pain is a stop sign — seek medical care.
        </Banner>
      ) : null}
      <Button label="Save check-in" onPress={() => saveCheckIn(day)} />

      <Kicker>For today</Kicker>
      <Card>
        <Kicker>Practice</Kicker>
        <Text style={styles.pick}>Two-minute exhale reset</Text>
        <Text style={styles.body}>Chosen for how you are arriving today.</Text>
      </Card>
      <Card>
        <Kicker>Read</Kicker>
        <Text style={styles.pick}>Show-day mobility</Text>
        <Text style={styles.body}>From the Method library.</Text>
      </Card>
      <Card
        onPress={() =>
          router.push({ pathname: "/practitioner/[id]", params: { id: person.id } })
        }
      >
        <Kicker>Practitioner</Kicker>
        <Text style={styles.pick}>{person.name}</Text>
        <Text style={styles.body}>
          {person.specialty} · {person.location}
        </Text>
      </Card>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  stage: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  body: { color: colors.ink2, fontSize: 15, lineHeight: 21 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 92 },
  barTrack: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: colors.stone,
    borderRadius: 8,
    overflow: "hidden",
  },
  bar: { backgroundColor: colors.sage, borderRadius: 8 },
  question: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 36,
    backgroundColor: colors.stone,
    color: colors.ink,
    fontSize: 20,
    fontWeight: "600",
  },
  scoreValue: { color: colors.ink, fontSize: 18, fontWeight: "700", width: 24, textAlign: "center" },
  pick: { color: colors.ink, fontSize: 18, fontWeight: "600" },
});
