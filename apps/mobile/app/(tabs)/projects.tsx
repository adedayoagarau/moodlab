import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { theme } from '@/constants/theme';
import { fetchProjects } from '@/lib/api';
import type { EditProject } from '@moodlab/shared';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<EditProject[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>
      <Text style={styles.subtitle}>Saved edit recipes — syncs when API is running</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No projects yet. Edit a photo to start.</Text>}
        renderItem={({ item }) => (
          <GlassPanel style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>
              LUT: {item.recipe.lutId ?? 'none'} · strength {Math.round(item.recipe.lutStrength * 100)}%
            </Text>
          </GlassPanel>
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
  empty: {
    color: theme.color.text.muted,
    marginTop: 16,
  },
  card: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  cardMeta: {
    fontSize: 13,
    color: theme.color.text.secondary,
    marginTop: 4,
  },
});
