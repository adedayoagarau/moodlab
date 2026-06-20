import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { ScreenShell } from '@/components/ScreenShell';
import { theme } from '@/constants/theme';
import { resetOnboarding } from '@/lib/onboarding';

export default function ProfileScreen() {
  const router = useRouter();

  async function replayOnboarding() {
    await resetOnboarding();
    router.push('/onboarding');
  }

  return (
    <ScreenShell contentStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <GlassPanel>
        <Text style={styles.label}>MoodLab Pro</Text>
        <Text style={styles.body}>
          Unlock premium mood packs, Melanin Gold grades, and creator cover workflows. RevenueCat
          billing replaces demo unlock before App Store ship.
        </Text>
      </GlassPanel>
      <GlassPanel style={styles.card}>
        <Text style={styles.label}>Creator studio</Text>
        <Text style={styles.body}>
          Beat covers, rollout posts, YouTube thumbnails, and portraits — all with skin-safe mood
          grades and platform export presets.
        </Text>
      </GlassPanel>
      <Pressable style={styles.linkBtn} onPress={replayOnboarding}>
        <Text style={styles.linkText}>Replay onboarding</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.color.text.secondary,
  },
  card: {
    marginTop: 4,
  },
  linkBtn: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    color: theme.color.accent.gold,
    fontWeight: '600',
    fontSize: 15,
  },
});
