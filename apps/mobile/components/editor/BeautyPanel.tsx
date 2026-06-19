import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { BeautySettings } from '@moodlab/shared';

const SKIN_LEVELS: BeautySettings['skinProtection'][] = ['off', 'low', 'medium', 'high'];

const SKIN_SLIDERS: { key: keyof BeautySettings; label: string; steps: number[] }[] = [
  { key: 'skinSmooth', label: 'Smooth', steps: [0, 0.15, 0.3] },
  { key: 'textureRestore', label: 'Texture', steps: [0.4, 0.55, 0.7] },
  { key: 'evenTone', label: 'Even Tone', steps: [0, 0.2, 0.35] },
  { key: 'faceLight', label: 'Face Light', steps: [0, 0.15, 0.3] },
  { key: 'underEyeLift', label: 'Under-eye', steps: [0, 0.15, 0.25] },
];

type Props = {
  beauty: BeautySettings;
  onChange: (patch: Partial<BeautySettings>) => void;
};

export function BeautyPanel({ beauty, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Beauty Studio</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Melanin Guard</Text>
        <Switch
          value={beauty.melaninGuard ?? true}
          onValueChange={(v) => onChange({ melaninGuard: v })}
          trackColor={{ false: theme.color.surface.raised, true: theme.color.accent.gold }}
        />
      </View>

      <Text style={styles.subLabel}>Skin Protection (LUT)</Text>
      <View style={styles.steps}>
        {SKIN_LEVELS.map((level) => (
          <Pressable
            key={level}
            style={[
              styles.stepBtn,
              beauty.skinProtection === level && styles.stepBtnActive,
            ]}
            onPress={() => onChange({ skinProtection: level })}>
            <Text style={styles.stepText}>{level}</Text>
          </Pressable>
        ))}
      </View>

      {SKIN_SLIDERS.map((slider) => (
        <View key={slider.key} style={styles.row}>
          <Text style={styles.label}>{slider.label}</Text>
          <View style={styles.steps}>
            {slider.steps.map((step) => {
              const current = (beauty[slider.key] as number | undefined) ?? 0;
              const active = Math.abs(current - step) < 0.05;
              return (
                <Pressable
                  key={step}
                  style={[styles.stepBtn, active && styles.stepBtnActive]}
                  onPress={() => onChange({ [slider.key]: step })}>
                  <Text style={styles.stepText}>{Math.round(step * 100)}%</Text>
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
  subLabel: {
    fontSize: 12,
    color: theme.color.text.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
    backgroundColor: theme.color.surface.raised,
  },
  stepText: {
    fontSize: 11,
    color: theme.color.text.primary,
    fontWeight: '500',
  },
});
