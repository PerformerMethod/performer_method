import { Stack, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { practitioners } from "@/content";
import { Button, Card, Kicker, Screen } from "@/components/ui";
import { portraits } from "@/photos";
import { useAppState } from "@/state";
import { colors } from "@/theme";

export default function PractitionerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = practitioners.find((item) => item.id === id);
  const { member, favourites, toggleFavourite } = useAppState();
  const saved = person ? favourites.has(person.id) : false;

  if (!person) {
    return (
      <Screen>
        <Text style={styles.missing}>That practitioner is not in the directory.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: person.name }} />
      {portraits[person.id] ? (
        <Image source={portraits[person.id]} style={styles.photo} accessibilityIgnoresInvertColors />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.initials}>{person.initials}</Text>
        </View>
      )}
      <Kicker>{person.specialty}</Kicker>
      <Text style={styles.name}>{person.name}</Text>
      <Text style={styles.meta}>{person.location}</Text>
      <Card>
        <Text style={styles.body}>{person.blurb}</Text>
      </Card>
      {member ? (
        <Button
          label={saved ? "Saved to favourites" : "Save practitioner"}
          tone={saved ? "ghost" : "ink"}
          onPress={() => toggleFavourite(person.id)}
        />
      ) : (
        <Text style={styles.note}>Log in with the sample member to save favourites on this phone.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { width: "100%", height: 280, borderRadius: 28 },
  fallback: {
    height: 180,
    borderRadius: 28,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: colors.ink, fontSize: 42, fontWeight: "700" },
  name: { color: colors.ink, fontSize: 32, fontWeight: "600", letterSpacing: -0.6 },
  meta: { color: colors.muted, fontSize: 16 },
  body: { color: colors.ink2, fontSize: 16, lineHeight: 23 },
  note: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  missing: { color: colors.ink, fontSize: 16 },
});
