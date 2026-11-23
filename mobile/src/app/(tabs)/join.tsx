import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Button, Card, Kicker, TabScreen, Title } from "@/components/ui";
import { useAppState } from "@/state";
import { colors } from "@/theme";

export default function JoinScreen() {
  const router = useRouter();
  const { signInDemo } = useAppState();

  return (
    <TabScreen>
      <Kicker>Your space</Kicker>
      <Title>Open the member app.</Title>
      <Text style={styles.lead}>
        For You, Pass, and Community live on this phone once you are in. This build uses a sample member so you can try those screens without a live account.
      </Text>
      <Card>
        <Text style={styles.name}>Alex Rivera</Text>
        <Text style={styles.meta}>Musical theatre · The Run · Hamilton</Text>
        <Text style={styles.meta}>Sydney · Debut pass PM-48291</Text>
      </Card>
      <Button
        label="Preview with sample member"
        onPress={() => {
          signInDemo();
          router.replace("/for-you");
        }}
      />
      <Text style={styles.note}>
        Live email codes stay on the Performer Method server. Nothing in this app stores an API key.
      </Text>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 22 },
  name: { color: colors.ink, fontSize: 20, fontWeight: "600" },
  meta: { color: colors.muted, fontSize: 14 },
  note: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
