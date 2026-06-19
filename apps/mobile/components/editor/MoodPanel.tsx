import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { LutThumbnail } from '@/components/editor/LutThumbnail';
import { StrengthSlider } from '@/components/editor/StrengthSlider';
import { theme } from '@/constants/theme';
import type { LutDefinition } from '@moodlab/shared';

type Props = {
  luts: LutDefinition[];
  selectedId?: string;
  strength: number;
  isPro: boolean;
  onSelectLut: (lut: LutDefinition) => void;
  onStrengthChange: (value: number) => void;
  onLockedLutPress: (lut: LutDefinition) => void;
};

export function MoodPanel({
  luts,
  selectedId,
  strength,
  isPro,
  onSelectLut,
  onStrengthChange,
  onLockedLutPress,
}: Props) {
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
          const selected = item.id === selectedId;
          const locked = item.plan === 'pro' && !isPro;
          return (
            <Pressable
              style={[styles.lutCard, selected && styles.lutCardSelected, locked && styles.lutCardLocked]}
              onPress={() => (locked ? onLockedLutPress(item) : onSelectLut(item))}>
              <LutThumbnail lut={item} />
              {locked ? <View style={styles.lockOverlay}><Text style={styles.lockText}>🔒</Text></View> : null}
              <Text style={styles.lutName} numberOfLines={1}>{item.name}</Text>
              {item.plan === 'pro' ? <Text style={styles.proBadge}>PRO</Text> : null}
            </Pressable>
          );
        }}
      />
      <StrengthSlider label="Strength" value={strength} onChange={onStrengthChange} />
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
    position: 'relative',
  },
  lutCardSelected: {
    borderColor: theme.color.accent.gold,
  },
  lutCardLocked: {
    opacity: 0.85,
  },
  lockOverlay: {
    position: 'absolute',
    top: 16,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    fontSize: 18,
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
});
