import Slider from '@react-native-community/slider';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { clamp01 } from '@moodlab/shared';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Normalized 0–1 mode (default). Set min/max for bipolar or extended ranges. */
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
};

function defaultFormat(value: number, min: number, max: number): string {
  if (min >= 0 && max <= 1) {
    return `${Math.round(clamp01(value) * 100)}%`;
  }
  const rounded = Math.round(value * 100) / 100;
  if (rounded > 0) return `+${rounded}`;
  return String(rounded);
}

export function StrengthSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  formatValue,
}: Props) {
  const display =
    formatValue?.(value) ?? defaultFormat(value, min, max);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{display}</Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor={theme.color.accent.gold}
        maximumTrackTintColor={theme.color.surface.elevated}
        thumbTintColor={theme.color.accent.gold}
        tapToSeek
      />
    </View>
  );
}

const THUMB_SIZE = Platform.select({ ios: 28, android: 24, default: 24 });

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: theme.color.text.secondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.color.accent.gold,
    minWidth: 44,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: THUMB_SIZE,
  },
});
