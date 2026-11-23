import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { pillars } from "@/content";
import { Card, Kicker, Screen } from "@/components/ui";
import { colors, pillarColor } from "@/theme";

export default function PillarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pillar = pillars.find((item) => item.id === id);

  if (!pillar) {
    return (
      <Screen>
        <Text style={styles.body}>That pillar is not part of the Method.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: pillar.title }} />
      <Text style={[styles.mark, { color: pillarColor[pillar.id] }]}>{pillar.title}</Text>
      <Text style={styles.summary}>{pillar.summary}</Text>
      {pillar.sections.map((section) => (
        <Card key={section.title}>
          <Kicker>{pillar.title}</Kicker>
          <Text style={styles.section}>{section.title}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mark: { fontSize: 13, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  summary: { color: colors.ink, fontSize: 28, lineHeight: 34, fontWeight: "600", letterSpacing: -0.5 },
  section: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  body: { color: colors.ink2, fontSize: 16, lineHeight: 23 },
});
