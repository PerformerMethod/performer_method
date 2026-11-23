import { NativeTabs } from "expo-router/native-tabs";
import { useAppState } from "@/state";
import { colors } from "@/theme";

export default function TabLayout() {
  const { member } = useAppState();
  const signedIn = member != null;

  return (
    <NativeTabs
      tintColor={colors.ink}
      backgroundColor={colors.bg}
      iconColor={{ default: colors.muted, selected: colors.ink }}
      labelStyle={{ default: { color: colors.muted }, selected: { color: colors.ink } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practitioners">
        <NativeTabs.Trigger.Label>Practitioners</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2.fill" md="group" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="method" hidden={signedIn}>
        <NativeTabs.Trigger.Label>Method</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="for-you" hidden={!signedIn}>
        <NativeTabs.Trigger.Label>For You</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="recovery" hidden={signedIn}>
        <NativeTabs.Trigger.Label>Recovery</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="drop.fill" md="water_drop" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="community" hidden={!signedIn}>
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bubble.left.and.bubble.right.fill" md="forum" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="join" hidden={signedIn}>
        <NativeTabs.Trigger.Label>Join</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="person_add" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="pass" hidden={!signedIn}>
        <NativeTabs.Trigger.Label>Pass</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wallet.pass.fill" md="badge" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
