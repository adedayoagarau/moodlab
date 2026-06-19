import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { completeOnboarding } from '@/lib/onboarding';
import { DEMO_IMAGE_URI } from '@/lib/use-platform-status';

const STEPS = [
  {
    kicker: 'Welcome',
    title: 'Your cover-art studio',
    body: 'Turn camera-roll photos into beat covers, rollout posts, and thumbnails — with mood grades built for creators.',
  },
  {
    kicker: 'Melanin Guard',
    title: 'Moods that protect skin',
    body: 'Aggressive LUTs usually destroy brown and deep skin tones. MoodLab keeps melanin true while the grade hits the scene.',
  },
  {
    kicker: '60 seconds',
    title: 'Import → mood → export',
    body: 'Pick a photo, tap a mood, share to Instagram or save cover art. Your first finished post takes under a minute.',
  },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  async function finish(openDemo: boolean) {
    await completeOnboarding();
    if (openDemo) {
      router.replace({
        pathname: '/editor',
        params: {
          uri: encodeURIComponent(DEMO_IMAGE_URI),
          workflow: 'portrait',
        },
      });
    } else {
      router.replace('/(tabs)');
    }
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.kicker}>{current.kicker}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
      </View>

      <View style={styles.actions}>
        {isLast ? (
          <>
            <Pressable style={styles.primary} onPress={() => finish(true)}>
              <Text style={styles.primaryText}>Try demo portrait</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => finish(false)}>
              <Text style={styles.secondaryText}>Go to Home</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.primary} onPress={() => setStep((s) => s + 1)}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        )}
        {step > 0 && !isLast ? (
          <Pressable onPress={() => setStep((s) => s - 1)}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
        ) : null}
        {!isLast ? (
          <Pressable onPress={() => finish(false)}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
    paddingHorizontal: theme.space[5],
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.color.surface.raised,
  },
  dotActive: {
    backgroundColor: theme.color.accent.gold,
    width: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.color.accent.gold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.color.text.primary,
    lineHeight: 38,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: theme.color.text.secondary,
    marginTop: 8,
  },
  actions: {
    gap: 12,
  },
  primary: {
    backgroundColor: theme.color.accent.gold,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.color.surface.base,
  },
  secondary: {
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.color.stroke.strong,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  back: {
    textAlign: 'center',
    color: theme.color.text.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
  skip: {
    textAlign: 'center',
    color: theme.color.text.muted,
    fontSize: 14,
    marginTop: 4,
  },
});
