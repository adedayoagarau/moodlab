import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { theme } from '@/constants/theme';

export type PlatformStatus = {
  loading: boolean;
  apiOnline: boolean;
  packCount: number;
  lutCount: number;
  templateCount: number;
  apiUrl: string;
};

type Props = {
  status: PlatformStatus;
};

export function PlatformStatusCard({ status }: Props) {
  if (status.loading) {
    return (
      <GlassPanel style={styles.card}>
        <View style={styles.row}>
          <ActivityIndicator color={theme.color.accent.gold} />
          <Text style={styles.loadingText}>Connecting to MoodLab platform…</Text>
        </View>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.dot, status.apiOnline ? styles.dotOnline : styles.dotOffline]} />
        <Text style={styles.statusTitle}>
          {status.apiOnline ? 'Platform online' : 'Platform offline'}
        </Text>
      </View>
      {status.apiOnline ? (
        <Text style={styles.stats}>
          {status.packCount} mood packs · {status.lutCount} LUTs · {status.templateCount} templates
        </Text>
      ) : (
        <Text style={styles.hint}>
          Start the API: <Text style={styles.mono}>pnpm dev:api</Text> then reload
        </Text>
      )}
      <Text style={styles.apiUrl} numberOfLines={1}>{status.apiUrl}</Text>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.space[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: theme.color.text.secondary,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: theme.color.accent.green,
  },
  dotOffline: {
    backgroundColor: theme.color.accent.red,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  stats: {
    fontSize: 14,
    color: theme.color.text.secondary,
    marginBottom: 6,
  },
  hint: {
    fontSize: 14,
    color: theme.color.text.secondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  mono: {
    fontFamily: 'monospace',
    color: theme.color.accent.gold,
  },
  apiUrl: {
    fontSize: 11,
    color: theme.color.text.muted,
    fontFamily: 'monospace',
  },
});
