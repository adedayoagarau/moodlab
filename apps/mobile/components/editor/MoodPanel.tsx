import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { LutDefinition } from '@moodlab/shared';
import { getLutPreviewTint } from '@/lib/render-preview';

type Props = {
  luts: LutDefinition[];
  selectedId?: string;
  strength: number;
  onSelectLut: (lut: LutDefinition) => void;
  onStrengthChange: (value: number) => void;
};

export function MoodPanel({ luts, selectedId, strength, onSelectLut, onStrengthChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mood / LUT</Text>
      <FlatList
        horizontal
        data={luts}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        renderItem={({ item }) => {
          const tint = getLutPreviewTint(item);
          const selected = item.id === selectedId;
          return (
            <Pressable
              style={[styles.lutCard, selected && styles.lutCardSelected]}
              onPress={() => onSelectLut(item)}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: tint?.overlay ?? theme.color.accent.gold },
                ]} />
              <Text style={styles.lutName} numberOfLines={1}>{item.name}</Text>
              {item.plan === 'pro' ? <Text style={styles.proBadge}>PRO</Text> : null}
            </Pressable>
          );
        }}
      />
      <View style={styles.sliderRow}>
        <Text style={styles.sliderLabel}>Strength</Text>
        <View style={styles.strengthButtons}>
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <Pressable
              key={v}
              style={[styles.strengthBtn, Math.abs(strength - v) < 0.05 && styles.strengthBtnActive]}
              onPress={() => onStrengthChange(v)}>
              <Text style={styles.strengthBtnText}>{Math.round(v * 100)}%</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.space[4],
    backgroundColor: theme.color.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    marginBottom: theme.space[3],
    letterSpacing: 0.5,
  },
  carousel: {
    gap: 10,
    paddingBottom: theme.space[3],
  },
  lutCard: {
    width: 88,
    alignItems: 'center',
    padding: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface.elevated,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  lutCardSelected: {
    borderColor: theme.color.accent.gold,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.sm,
    marginBottom: 6,
  },
  lutName: {
    fontSize: 11,
    color: theme.color.text.primary,
    textAlign: 'center',
  },
  proBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.color.accent.gold,
    marginTop: 2,
  },
  sliderRow: {
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: theme.color.text.secondary,
    marginBottom: 8,
  },
  strengthButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  strengthBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
  },
  strengthBtnActive: {
    backgroundColor: theme.color.accent.gold,
  },
  strengthBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
});
