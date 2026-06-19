import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { TextLayer } from '@moodlab/shared';

type Template = { id: string; label: string; text: string };

type Props = {
  templates: Template[];
  layers: TextLayer[];
  onAddTemplate: (template: Template) => void;
  onClear: () => void;
};

export function TextPanel({ templates, layers, onAddTemplate, onClear }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Text templates</Text>
      <View style={styles.grid}>
        {templates.map((t) => (
          <Pressable key={t.id} style={styles.templateBtn} onPress={() => onAddTemplate(t)}>
            <Text style={styles.templateLabel}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      {layers.length > 0 ? (
        <View style={styles.layers}>
          <Text style={styles.subLabel}>Layers ({layers.length})</Text>
          {layers.map((layer) => (
            <Text key={layer.id} style={styles.layerText} numberOfLines={1}>
              {layer.text}
            </Text>
          ))}
          <Pressable onPress={onClear}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        </View>
      ) : null}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
  },
  templateLabel: {
    fontSize: 13,
    color: theme.color.text.primary,
    fontWeight: '500',
  },
  layers: {
    gap: 6,
  },
  subLabel: {
    fontSize: 12,
    color: theme.color.text.secondary,
  },
  layerText: {
    fontSize: 14,
    color: theme.color.text.primary,
    fontStyle: 'italic',
  },
  clear: {
    fontSize: 13,
    color: theme.color.accent.red,
    marginTop: 4,
  },
});
