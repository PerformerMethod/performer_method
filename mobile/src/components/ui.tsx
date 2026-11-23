import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "@/state";
import { colors } from "@/theme";

export function Screen({
  children,
  clearWebTabs = false,
}: {
  children: ReactNode;
  clearWebTabs?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            insets.top + 12 + (clearWebTabs && Platform.OS === "web" ? 76 : 0),
          paddingBottom: 32,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      {children}
    </ScrollView>
  );
}

export function TabScreen({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { member } = useAppState();
  return (
    <Screen clearWebTabs>
      <View style={styles.top}>
        <Text style={styles.brand}>Performer Method</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={member ? "Open profile" : "Log in"}
          onPress={() => router.push(member ? "/profile" : "/join")}
          style={styles.account}
        >
          <Text style={styles.accountText}>
            {member ? member.name.split(" ")[0] : "Log in"}
          </Text>
        </Pressable>
      </View>
      {children}
    </Screen>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <Text style={styles.lead}>{children}</Text>;
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  tone = "ink",
}: {
  label: string;
  onPress: () => void;
  tone?: "ink" | "ghost" | "danger";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "ink" && styles.buttonInk,
        tone === "ghost" && styles.buttonGhost,
        tone === "danger" && styles.buttonDanger,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          tone === "ghost" && styles.buttonTextInk,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipOn]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function Banner({ children }: { children: ReactNode }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{children}</Text>
    </View>
  );
}

export function IconButton(props: PressableProps & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={(state) => [
        styles.iconButton,
        typeof style === "function" ? style(state) : style,
        state.pressed && styles.pressed,
      ]}
      {...rest}
    >
      <Text style={styles.iconButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: 20,
    gap: 16,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  brand: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  account: {
    backgroundColor: colors.stone,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  accountText: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  kicker: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -0.8,
  },
  lead: { color: colors.ink2, fontSize: 16, lineHeight: 23 },
  card: {
    backgroundColor: colors.stone2,
    borderRadius: 22,
    padding: 16,
    gap: 6,
  },
  pressed: { opacity: 0.82 },
  button: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  buttonInk: { backgroundColor: colors.ink },
  buttonGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonDanger: { backgroundColor: colors.danger },
  buttonText: { color: colors.bg, fontSize: 16, fontWeight: "600" },
  buttonTextInk: { color: colors.ink },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.stone,
  },
  chipOn: { backgroundColor: colors.ink },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: "500" },
  chipTextOn: { color: colors.bg },
  fieldLabel: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  banner: {
    backgroundColor: colors.sageSoft,
    borderRadius: 16,
    padding: 14,
  },
  bannerText: { color: colors.ink2, fontSize: 14, lineHeight: 20 },
  iconButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bg,
  },
  iconButtonText: { color: colors.ink, fontWeight: "600", fontSize: 13 },
});
