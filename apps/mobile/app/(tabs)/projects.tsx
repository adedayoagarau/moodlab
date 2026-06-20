import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassPanel } from '@/components/GlassPanel';
import { theme } from '@/constants/theme';
import { loadLocalProjects, type LocalProject } from '@/lib/local-projects';

export default function ProjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<LocalProject[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLocalProjects().then(setProjects);
    }, []),
  );

  function openProject(project: LocalProject) {
    router.push({
      pathname: '/editor',
      params: {
        uri: encodeURIComponent(project.sourceUri),
        projectId: project.id,
        recipe: encodeURIComponent(JSON.stringify(project.recipe)),
      },
    });
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + theme.space[4],
          paddingBottom: insets.bottom + 88,
        },
      ]}>
      <Text style={styles.title}>Projects</Text>
      <Text style={styles.subtitle}>Saved edits on this device — tap to continue editing</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No projects yet. Edit a photo and tap Save project.</Text>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openProject(item)}>
            <GlassPanel style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                LUT: {item.recipe.lutId ?? 'none'} · strength{' '}
                {Math.round(item.recipe.lutStrength * 100)}%
              </Text>
              <Text style={styles.cardDate}>
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
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
    paddingHorizontal: theme.space[4],
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
    lineHeight: 20,
  },
  list: {
    paddingBottom: theme.space[4],
    gap: 10,
  },
  empty: {
    color: theme.color.text.muted,
    marginTop: 16,
    lineHeight: 20,
  },
  card: {
    marginBottom: 4,
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
  cardDate: {
    fontSize: 12,
    color: theme.color.text.muted,
    marginTop: 6,
  },
});
