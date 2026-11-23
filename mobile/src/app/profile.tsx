import { useRouter } from "expo-router";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Button, Chip, ChipRow, FieldLabel, Kicker, Screen, Title } from "@/components/ui";
import { useAppState } from "@/state";
import { colors } from "@/theme";

const disciplines = [
  "Musical theatre",
  "Acting",
  "Dance",
  "Opera",
  "Circus",
  "Comedy",
  "Music",
  "Stage management",
  "Creative team",
];

const stages = [
  "Audition",
  "Preparation",
  "Rehearsal",
  "Tech",
  "Opening",
  "The Run",
  "Tour",
  "Closing",
  "Not on a show right now",
];

export default function ProfileScreen() {
  const router = useRouter();
  const { member, favourites, updateProfile, signOut, clearCheckIns } = useAppState();
  if (!member) return null;

  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Screen>
      <Kicker>My details</Kicker>
      <Title>Profile</Title>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <Text style={styles.email}>{member.email}</Text>
      <Text style={styles.meta}>{favourites.size} saved practitioners</Text>

      <FieldLabel>Name</FieldLabel>
      <TextInput
        value={member.name}
        onChangeText={(name) => updateProfile({ name })}
        style={styles.input}
        accessibilityLabel="Name"
      />
      <FieldLabel>Current show</FieldLabel>
      <TextInput
        value={member.show}
        onChangeText={(show) => updateProfile({ show })}
        style={styles.input}
        accessibilityLabel="Current show"
      />
      <FieldLabel>City</FieldLabel>
      <TextInput
        value={member.city}
        onChangeText={(city) => updateProfile({ city })}
        style={styles.input}
        accessibilityLabel="City"
      />

      <FieldLabel>Discipline</FieldLabel>
      <ChipRow>
        {disciplines.map((discipline) => (
          <Chip
            key={discipline}
            label={discipline}
            selected={member.discipline === discipline}
            onPress={() => updateProfile({ discipline })}
          />
        ))}
      </ChipRow>
      <FieldLabel>Show cycle</FieldLabel>
      <ChipRow>
        {stages.map((stage) => (
          <Chip
            key={stage}
            label={stage}
            selected={member.stage === stage}
            onPress={() => updateProfile({ stage })}
          />
        ))}
      </ChipRow>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Share check-ins for For You notes</Text>
        <Switch
          value={member.shareCheckIns}
          onValueChange={(shareCheckIns) => updateProfile({ shareCheckIns })}
          trackColor={{ true: colors.sage, false: colors.stone }}
        />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Marketing emails</Text>
        <Switch
          value={member.marketing}
          onValueChange={(marketing) => updateProfile({ marketing })}
          trackColor={{ true: colors.sage, false: colors.stone }}
        />
      </View>

      <Button label="Clear today’s check-in" tone="ghost" onPress={clearCheckIns} />
      <Button
        label="Sign out"
        tone="danger"
        onPress={() => {
          signOut();
          router.replace("/");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: colors.ink, fontSize: 24, fontWeight: "700" },
  email: { color: colors.ink, fontSize: 16, fontWeight: "600" },
  meta: { color: colors.muted, fontSize: 14 },
  input: {
    backgroundColor: colors.stone2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  switchLabel: { color: colors.ink, fontSize: 15, flex: 1 },
});
