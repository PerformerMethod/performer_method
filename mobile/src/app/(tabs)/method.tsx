import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { lifecycleStages, pillars } from "@/content";
import { Card, Kicker, TabScreen, Title } from "@/components/ui";
import { colors, pillarColor } from "@/theme";

export default function MethodScreen() {
  const router = useRouter();
  const [stageId, setStageId] = useState(lifecycleStages[0].id);
  const stage = lifecycleStages.find((item) => item.id === stageId) ?? lifecycleStages[0];

  return (
    <TabScreen>
      <Kicker>The Method</Kicker>
      <Title>Four pillars.</Title>
      <Text style={styles.lead}>
        Mind, body, fuel, and purpose. Open a pillar for the practices behind it.
      </Text>
      {pillars.map((pillar) => (
        <Card
          key={pillar.id}
          onPress={() => router.push({ pathname: "/pillar/[id]", params: { id: pillar.id } })}
        >
          <Text style={[styles.mark, { color: pillarColor[pillar.id] }]}>{pillar.title}</Text>
          <Text style={styles.summary}>{pillar.summary}</Text>
          <Text style={styles.open}>Read {pillar.sections.length} practices</Text>
        </Card>
      ))}

      <Kicker>Show cycle</Kicker>
      <Text style={styles.section}>Where you are changes what to protect.</Text>
      <View style={styles.stages}>
        {lifecycleStages.map((item) => {
          const selected = item.id === stage.id;
          return (
            <Card
              key={item.id}
              onPress={() => setStageId(item.id)}
              style={selected ? styles.stageOn : undefined}
            >
              <Text style={styles.stageTitle}>{item.title}</Text>
            </Card>
          );
        })}
      </View>
      <Card>
        <Kicker>{stage.title}</Kicker>
        <Text style={styles.summary}>{stage.guidance}</Text>
      </Card>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  mark: { fontSize: 13, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },
  summary: { color: colors.ink2, fontSize: 15, lineHeight: 21 },
  open: { color: colors.ink, fontSize: 14, fontWeight: "600", marginTop: 4 },
  section: { color: colors.ink, fontSize: 22, fontWeight: "600" },
  stages: { gap: 8 },
  stageOn: { backgroundColor: colors.sageSoft },
  stageTitle: { color: colors.ink, fontSize: 16, fontWeight: "600" },
});
