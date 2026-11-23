import { useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { recoveryCentres } from "@/content";
import { Card, Chip, ChipRow, Kicker, TabScreen, Title } from "@/components/ui";
import { colors } from "@/theme";

const states = ["All", "NSW", "VIC", "QLD", "WA"] as const;

export default function RecoveryScreen() {
  const [state, setState] = useState<(typeof states)[number]>("All");
  const centres = useMemo(
    () => recoveryCentres.filter((centre) => state === "All" || centre.state === state),
    [state],
  );

  return (
    <TabScreen>
      <Kicker>Recovery</Kicker>
      <Title>Heat, cold, contrast.</Title>
      <Text style={styles.lead}>
        Spaces for the hours after the show. Filter by state, then call or visit from the listing.
      </Text>
      <ChipRow>
        {states.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={state === option}
            onPress={() => setState(option)}
          />
        ))}
      </ChipRow>
      {centres.map((centre) => (
        <Card key={centre.id}>
          <Text style={styles.name}>{centre.name}</Text>
          <Text style={styles.meta}>
            {centre.suburb} · {centre.state}
          </Text>
          <Text style={styles.services}>{centre.services.join(" · ")}</Text>
          {centre.phone ? <Text style={styles.contact}>{centre.phone}</Text> : null}
          {centre.email ? <Text style={styles.contact}>{centre.email}</Text> : null}
          {centre.instagram ? <Text style={styles.contact}>{centre.instagram}</Text> : null}
        </Card>
      ))}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  name: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  meta: { color: colors.muted, fontSize: 13 },
  services: { color: colors.ink2, fontSize: 15 },
  contact: { color: colors.ink, fontSize: 14, fontWeight: "500" },
});
