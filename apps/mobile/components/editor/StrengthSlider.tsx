import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { clamp01 } from '@moodlab/shared';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function StrengthSlider({ label, value, onChange }: Props) {
  const steps = 20;
  const index = Math.round(clamp01(value) * steps);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(clamp01(value) * 100)}%</Text>
      </View>
      <View style={styles.track}>
        {Array.from({ length: steps + 1 }, (_, i) => {
          const active = i <= index;
          return (
            <Pressable
              key={i}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => onChange(i / steps)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: theme.color.text.secondary,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.accent.gold,
  },
  track: {
    flexDirection: 'row',
    gap: 3,
    height: 28,
  },
  segment: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: theme.color.surface.elevated,
  },
  segmentActive: {
    backgroundColor: theme.color.accent.gold,
  },
});
