import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About MoodLab</Text>
      <Text style={styles.body}>
        MoodLab is a creator-first photo studio. Pick a mood LUT, protect skin with Melanin Guard,
        polish portraits in Beauty Studio, add promo text, and export cover art and social posts.
      </Text>
      <Text style={styles.label}>Built for</Text>
      <Text style={styles.body}>
        Music producers, artists, and social creators who want camera-roll photos to look like cover
        art — not generic filtered selfies.
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.85,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
});
