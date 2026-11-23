import { StyleSheet, Text, View } from "react-native";
import { passOffers } from "@/content";
import { Card, Chip, ChipRow, Kicker, TabScreen, Title } from "@/components/ui";
import { useAppState } from "@/state";
import { colors } from "@/theme";

export default function PassScreen() {
  const { member, updateProfile } = useAppState();
  if (!member) return null;

  const offers = passOffers.filter(
    (offer) => offer.tier === "Debut" || member.tier === "Company",
  );

  return (
    <TabScreen>
      <Kicker>Performer Pass</Kicker>
      <Title>Your Pass</Title>
      <Text style={styles.lead}>
        A digital pass for partner offers at gyms, studios, and recovery spaces.
      </Text>
      <View style={styles.pass}>
        <View style={styles.passTop}>
          <Text style={styles.passBrand}>Performer Method</Text>
          <Text style={styles.tier}>{member.tier}</Text>
        </View>
        <Text style={styles.passName}>{member.name}</Text>
        <Text style={styles.number}>{member.passNumber}</Text>
        <View style={styles.bars} accessibilityElementsHidden>
          {Array.from({ length: 28 }).map((_, index) => (
            <View
              key={index}
              style={[styles.bar, { height: 14 + ((index * 17) % 28) }]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.note}>Sample pass. A live member number arrives with a real account.</Text>
      <ChipRow>
        <Chip
          label="Debut · free"
          selected={member.tier === "Debut"}
          onPress={() => updateProfile({ tier: "Debut" })}
        />
        <Chip
          label="Company · preview"
          selected={member.tier === "Company"}
          onPress={() => updateProfile({ tier: "Company" })}
        />
      </ChipRow>
      {offers.map((offer) => (
        <Card key={offer.id}>
          <Text style={styles.meta}>
            {offer.partner} · {offer.tier}
          </Text>
          <Text style={styles.perk}>{offer.perk}</Text>
          <Text style={styles.redeem}>{offer.redeem}</Text>
        </Card>
      ))}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  pass: {
    backgroundColor: colors.ink,
    borderRadius: 28,
    padding: 20,
    gap: 8,
  },
  passTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  passBrand: { color: colors.sageSoft, fontSize: 13, fontWeight: "600" },
  tier: {
    color: colors.ink,
    backgroundColor: colors.sageSoft,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  passName: { color: colors.bg, fontSize: 28, fontWeight: "600", marginTop: 12 },
  number: { color: colors.sage, fontSize: 16, letterSpacing: 1 },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 46,
    marginTop: 16,
  },
  bar: { width: 3, backgroundColor: colors.bg, borderRadius: 2 },
  note: { color: colors.muted, fontSize: 13 },
  meta: { color: colors.muted, fontSize: 13 },
  perk: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  redeem: { color: colors.ink2, fontSize: 14, lineHeight: 20 },
});
