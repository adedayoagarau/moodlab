import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { AdjustmentStack } from '@moodlab/shared';

const SLIDERS: { key: keyof AdjustmentStack; label: string; steps: number[] }[] = [
  { key: 'exposure', label: 'Exposure', steps: [-0.3, 0, 0.3] },
  { key: 'contrast', label: 'Contrast', steps: [-0.2, 0, 0.3] },
  { key: 'warmth', label: 'Warmth', steps: [-0.2, 0, 0.3] },
  { key: 'saturation', label: 'Saturation', steps: [-0.2, 0, 0.2] },
  { key: 'grain', label: 'Grain', steps: [0, 0.15, 0.3] },
  { key: 'vignette', label: 'Vignette', steps: [0, 0.15, 0.3] },
];

type Props = {
  adjustments: AdjustmentStack;
  onChange: (key: keyof AdjustmentStack, value: number) => void;
};

export function AdjustPanel({ adjustments, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Adjust</Text>
      {SLIDERS.map((slider) => (
        <View key={slider.key} style={styles.row}>
          <Text style={styles.label}>{slider.label}</Text>
          <View style={styles.steps}>
            {slider.steps.map((step) => {
              const current = adjustments[slider.key] ?? 0;
              const active = Math.abs(current - step) < 0.05;
              return (
                <Pressable
                  key={step}
                  style={[styles.stepBtn, active && styles.stepBtnActive]}
                  onPress={() => onChange(slider.key, step)}>
                  <Text style={styles.stepText}>
                    {step === 0 ? '0' : step > 0 ? `+${step}` : String(step)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.space[4],
    backgroundColor: theme.color.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
    gap: 12,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    letterSpacing: 0.5,
  },
  row: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: theme.color.text.secondary,
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
  },
  stepBtnActive: {
    backgroundColor: theme.color.surface.raised,
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  stepText: {
    fontSize: 12,
    color: theme.color.text.primary,
    fontWeight: '500',
  },
});
