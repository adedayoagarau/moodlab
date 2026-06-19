import { StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { API_BASE_URL } from '@/lib/config';
import { useIntegrationsBootstrap } from '@/lib/use-integrations-bootstrap';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  const integrations = useIntegrationsBootstrap();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <GlassPanel>
        <Text style={styles.label}>Platform API</Text>
        <Text style={styles.mono}>{API_BASE_URL}</Text>
      </GlassPanel>

      <GlassPanel style={styles.card}>
        <Text style={styles.label}>Integration stack</Text>
        {integrations ? (
          <>
            <Text style={styles.row}>
              Skia GPU LUT: {integrations.skia ? '✓' : '—'}
            </Text>
            <Text style={styles.row}>
              ML Kit faces: {integrations.mlKit ? '✓ (dev build)' : '—'}
            </Text>
            <Text style={styles.row}>
              Vision / CIColorCube: {integrations.visionNative ? '✓' : 'iOS dev build'}
            </Text>
            <Text style={styles.row}>
              Supabase: {integrations.supabase ? '✓ configured' : 'add keys to .env'}
            </Text>
            <Text style={styles.row}>
              RevenueCat: {integrations.revenueCat ? '✓ configured' : 'add iOS key to .env'}
            </Text>
          </>
        ) : (
          <Text style={styles.body}>Loading integrations…</Text>
        )}
      </GlassPanel>

      <GlassPanel style={styles.card}>
        <Text style={styles.label}>References wired in app</Text>
        {integrations?.references.map((ref) => (
          <Text key={ref} style={styles.refItem}>{ref}</Text>
        ))}
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
  row: {
    fontSize: 14,
    color: theme.color.text.secondary,
    marginBottom: 4,
  },
  refItem: {
    fontSize: 13,
    color: theme.color.text.muted,
    marginBottom: 4,
  },
  card: {
    marginTop: 4,
  },
});
