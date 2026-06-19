import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '@/components/GlassPanel';
import { PlatformStatusCard } from '@/components/PlatformStatusCard';
import { theme } from '@/constants/theme';
import { fetchManifest } from '@/lib/api';
import { DEMO_IMAGE_URI, usePlatformStatus } from '@/lib/use-platform-status';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const platform = usePlatformStatus();
  const [buildCards, setBuildCards] = useState<
    { id: string; title: string; subtitle: string }[]
  >([]);

  useEffect(() => {
    fetchManifest()
      .then((m) => setBuildCards(m.buildMyPost))
      .catch(() => setBuildCards([]));
  }, []);

  function openEditor(imageUri: string) {
    router.push({
      pathname: '/editor',
      params: { uri: encodeURIComponent(imageUri) },
    });
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to edit images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      openEditor(result.assets[0].uri);
    }
  }

  function tryDemoPhoto() {
    openEditor(DEMO_IMAGE_URI);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>MoodLab</Text>
      <Text style={styles.subtitle}>Photo first. Mood second. Export ready.</Text>

      <PlatformStatusCard status={platform} />

      <Pressable style={styles.primaryCta} onPress={pickPhoto}>
        <Text style={styles.primaryCtaText}>Edit Photo</Text>
        <Text style={styles.primaryCtaHint}>Import from gallery — GPU LUT preview</Text>
      </Pressable>

      <Pressable style={styles.secondaryCta} onPress={tryDemoPhoto}>
        <Text style={styles.secondaryCtaText}>Try demo portrait</Text>
        <Text style={styles.secondaryCtaHint}>
          {Platform.OS === 'web'
            ? 'Opens editor with a sample image (no gallery needed)'
            : 'Sample portrait — test moods without picking a photo'}
        </Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Build My Post</Text>
      {buildCards.length === 0 ? (
        <Text style={styles.emptyCards}>
          {platform.loading ? 'Loading templates…' : 'Templates appear when API is online'}
        </Text>
      ) : (
        buildCards.map((card) => (
          <Pressable key={card.id} onPress={pickPhoto}>
            <GlassPanel style={styles.card}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </GlassPanel>
          </Pressable>
        ))
      )}

      <GlassPanel style={styles.note}>
        <Text style={styles.noteText}>
          Editor applies real .cube LUTs via Skia GPU shaders. Skin-safe blending uses a face-region
          mask until Vision / ML Kit segmentation ships.
        </Text>
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
  },
  content: {
    padding: theme.space[4],
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: theme.color.text.secondary,
    marginBottom: theme.space[4],
  },
  primaryCta: {
    backgroundColor: theme.color.accent.gold,
    borderRadius: theme.radius.lg,
    padding: theme.space[5],
    marginBottom: theme.space[3],
  },
  primaryCtaText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.color.surface.base,
  },
  primaryCtaHint: {
    marginTop: 4,
    fontSize: 13,
    color: theme.color.surface.base,
    opacity: 0.85,
  },
  secondaryCta: {
    borderRadius: theme.radius.lg,
    padding: theme.space[4],
    marginBottom: theme.space[6],
    borderWidth: 1,
    borderColor: theme.color.stroke.strong,
    backgroundColor: theme.color.surface.elevated,
  },
  secondaryCtaText: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  secondaryCtaHint: {
    marginTop: 4,
    fontSize: 13,
    color: theme.color.text.secondary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.text.muted,
    marginBottom: theme.space[3],
    letterSpacing: 0.5,
  },
  emptyCards: {
    fontSize: 14,
    color: theme.color.text.muted,
    marginBottom: theme.space[3],
  },
  card: {
    marginBottom: theme.space[3],
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.color.text.secondary,
    marginTop: 4,
  },
  note: {
    marginTop: theme.space[4],
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.color.text.secondary,
  },
});
