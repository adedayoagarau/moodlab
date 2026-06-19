import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { theme } from '@/constants/theme';
import { fetchPacks } from '@/lib/api';
import type { LutPack } from '@moodlab/shared';

export default function PacksScreen() {
  const router = useRouter();
  const [packs, setPacks] = useState<LutPack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPacks()
      .then(setPacks)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load packs'));
  }, []);

  function openPack(pack: LutPack) {
    router.push({
      pathname: '/editor',
      params: {
        uri: encodeURIComponent(
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
        ),
        workflow: pack.id === 'melanin-gold' ? 'portrait' : 'beat-cover',
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Packs</Text>
      <Text style={styles.subtitle}>Curated LUT collections — tap to preview in editor</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={packs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => openPack(item)}>
            <GlassPanel style={styles.card}>
              <View style={[styles.swatch, { backgroundColor: item.coverColor ?? theme.color.accent.blue }]} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.badge}>{item.plan === 'pro' ? 'PRO' : 'FREE'}</Text>
                <Text style={styles.cta}>Preview pack →</Text>
              </View>
            </GlassPanel>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
    padding: theme.space[4],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.color.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.color.text.secondary,
    marginBottom: theme.space[4],
  },
  error: {
    color: theme.color.accent.red,
    marginBottom: 8,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.color.text.secondary,
    marginTop: 4,
  },
  badge: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    color: theme.color.accent.gold,
  },
  cta: {
    marginTop: 6,
    fontSize: 12,
    color: theme.color.accent.gold,
    fontWeight: '600',
  },
});
