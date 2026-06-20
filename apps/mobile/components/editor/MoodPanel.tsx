import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { EditorPanelShell } from '@/components/editor/EditorPanelShell';
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
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(96, Math.max(80, width * 0.22));

  return (
    <EditorPanelShell title="Mood / LUT" scrollable={false}>
      <FlatList
        horizontal
        data={luts}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        style={styles.list}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          const locked = item.plan === 'pro' && !isPro;
          return (
            <Pressable
              style={[
                styles.lutCard,
                { width: cardWidth },
                selected && styles.lutCardSelected,
                locked && styles.lutCardLocked,
              ]}
              onPress={() => (locked ? onLockedLutPress(item) : onSelectLut(item))}>
              <LutThumbnail lut={item} size={cardWidth - 16} />
              {locked ? (
                <View style={[styles.lockOverlay, { width: cardWidth - 16, height: cardWidth - 16 }]}>
                  <Text style={styles.lockText}>🔒</Text>
                </View>
              ) : null}
              <Text style={styles.lutName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.plan === 'pro' ? <Text style={styles.proBadge}>PRO</Text> : null}
            </Pressable>
          );
        }}
      />
      <StrengthSlider label="Mood strength" value={strength} onChange={onStrengthChange} />
    </EditorPanelShell>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    marginBottom: theme.space[2],
  },
  carousel: {
    gap: 10,
    paddingVertical: 4,
  },
  lutCard: {
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
    opacity: 0.88,
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  lockText: {
    fontSize: 20,
  },
  lutName: {
    fontSize: 11,
    color: theme.color.text.primary,
    textAlign: 'center',
    marginTop: 6,
    minHeight: 28,
  },
  proBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.color.accent.gold,
    marginTop: 2,
  },
});
