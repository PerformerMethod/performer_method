import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStateProvider, useAppState } from "@/state";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { member } = useAppState();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="practitioner/[id]" options={{ title: "Practitioner" }} />
      <Stack.Screen name="pillar/[id]" options={{ title: "The Method" }} />
      <Stack.Protected guard={member != null}>
        <Stack.Screen name="profile" options={{ title: "My details" }} />
      </Stack.Protected>
    </Stack>
  );
}
