import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { practitioners } from "@/content";
import { Card, Chip, ChipRow, Kicker, TabScreen, Title } from "@/components/ui";
import { portraits } from "@/photos";
import { colors } from "@/theme";

export default function PractitionersScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const options = useMemo(
    () => ["All", ...new Set(practitioners.map((person) => person.specialty))],
    [],
  );
  const results = practitioners.filter((person) => {
    const haystack = `${person.name} ${person.specialty} ${person.city} ${person.blurb}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesSpecialty = specialty === "All" || person.specialty === specialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <TabScreen>
      <Kicker>Directory</Kicker>
      <Title>Practitioners</Title>
      <Text style={styles.lead}>
        Physiotherapists, voice specialists, counsellors and more, chosen because they understand performers.
      </Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Name, specialty, city"
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel="Search practitioners"
        autoCorrect={false}
      />
      <ChipRow>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={specialty === option}
            onPress={() => setSpecialty(option)}
          />
        ))}
      </ChipRow>
      <Text style={styles.count}>
        {results.length} {results.length === 1 ? "practitioner" : "practitioners"}
      </Text>
      {results.map((person) => (
        <Card
          key={person.id}
          onPress={() =>
            router.push({ pathname: "/practitioner/[id]", params: { id: person.id } })
          }
        >
          <View style={styles.row}>
            {portraits[person.id] ? (
              <Image source={portraits[person.id]} style={styles.portrait} />
            ) : (
              <View style={styles.initials}>
                <Text style={styles.initialsText}>{person.initials}</Text>
              </View>
            )}
            <View style={styles.copy}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.meta}>
                {person.specialty} · {person.location}
              </Text>
              <Text style={styles.blurb}>{person.blurb}</Text>
            </View>
          </View>
        </Card>
      ))}
      {results.length === 0 ? (
        <Text style={styles.empty}>No one matches that search yet.</Text>
      ) : null}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  input: {
    backgroundColor: colors.stone2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  count: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12 },
  copy: { flex: 1, gap: 4 },
  portrait: { width: 72, height: 92, borderRadius: 16 },
  initials: {
    width: 72,
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { color: colors.ink, fontWeight: "700", fontSize: 18 },
  name: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  meta: { color: colors.muted, fontSize: 13 },
  blurb: { color: colors.ink2, fontSize: 14, lineHeight: 20 },
  empty: { color: colors.muted, fontSize: 15 },
});
