import { StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { API_BASE_URL } from '@/lib/config';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <GlassPanel>
        <Text style={styles.label}>Platform API</Text>
        <Text style={styles.mono}>{API_BASE_URL}</Text>
        <Text style={styles.body}>
          V1 uses local editing + cloud catalog. Accounts, RevenueCat entitlements, and Supabase sync
          land in the next platform milestone — see docs/architecture/.
        </Text>
      </GlassPanel>
      <GlassPanel style={styles.card}>
        <Text style={styles.label}>Product docs</Text>
        <Text style={styles.body}>
          Master blueprint, UI spec, and E2E architecture live in docs/product, docs/design, and
          docs/architecture.
        </Text>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
    padding: theme.space[4],
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
  mono: {
    fontFamily: 'monospace',
    color: theme.color.text.primary,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.color.text.secondary,
  },
  card: {
    marginTop: 4,
  },
});
