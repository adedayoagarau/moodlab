import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditorPanelShell } from '@/components/editor/EditorPanelShell';
import { StrengthSlider } from '@/components/editor/StrengthSlider';
import { theme } from '@/constants/theme';
import type { AdjustmentStack } from '@moodlab/shared';

const CONTROLS: {
  key: keyof AdjustmentStack;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: 'exposure', label: 'Exposure', min: -0.5, max: 0.5, step: 0.01 },
  { key: 'contrast', label: 'Contrast', min: -0.4, max: 0.5, step: 0.01 },
  { key: 'warmth', label: 'Warmth', min: -0.4, max: 0.4, step: 0.01 },
  { key: 'tint', label: 'Tint', min: -0.3, max: 0.3, step: 0.01 },
  { key: 'saturation', label: 'Saturation', min: -0.4, max: 0.4, step: 0.01 },
  { key: 'shadows', label: 'Shadows', min: -0.4, max: 0.4, step: 0.01 },
  { key: 'highlights', label: 'Highlights', min: -0.4, max: 0.4, step: 0.01 },
  { key: 'fade', label: 'Fade', min: 0, max: 0.5, step: 0.01 },
  { key: 'grain', label: 'Grain', min: 0, max: 0.5, step: 0.01 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 0.5, step: 0.01 },
  { key: 'sharpen', label: 'Sharpen', min: 0, max: 0.5, step: 0.01 },
  { key: 'glow', label: 'Glow', min: 0, max: 0.4, step: 0.01 },
];

type Props = {
  adjustments: AdjustmentStack;
  onChange: (key: keyof AdjustmentStack, value: number) => void;
  onReset?: () => void;
};

export function AdjustPanel({ adjustments, onChange, onReset }: Props) {
  return (
    <EditorPanelShell
      title="Adjust"
      subtitle="Drag sliders for live grade control — bipolar for tone, 0–100% for effects">
      {CONTROLS.map((control) => (
        <StrengthSlider
          key={control.key}
          label={control.label}
          value={adjustments[control.key] ?? 0}
          min={control.min}
          max={control.max}
          step={control.step}
          onChange={(v) => onChange(control.key, v)}
        />
      ))}
      {onReset ? (
        <Pressable style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetText}>Reset adjustments</Text>
        </Pressable>
      ) : null}
    </EditorPanelShell>
  );
}

const styles = StyleSheet.create({
  resetBtn: {
    marginTop: theme.space[2],
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.color.stroke.subtle,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.text.secondary,
  },
});
