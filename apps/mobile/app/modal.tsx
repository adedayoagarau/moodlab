import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { API_BASE_URL } from '@/lib/config';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About MoodLab</Text>
      <Text style={styles.body}>
        MoodLab explores mood, tone, and emotional resonance in language — at the intersection of
        poetry and product content.
      </Text>
      <Text style={styles.label}>API</Text>
      <Text style={styles.mono}>{API_BASE_URL}</Text>
      <Text style={styles.hint}>
        Start the API with `pnpm dev:api` from the repo root. Journal entries sync when the API is
        reachable.
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
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 14,
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
});
