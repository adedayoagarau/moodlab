import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditorPanelShell } from '@/components/editor/EditorPanelShell';
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
    <EditorPanelShell title="Text" subtitle="Tap a template to add it to your image">
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
            <Text key={layer.id} style={styles.layerText} numberOfLines={2}>
              {layer.text}
            </Text>
          ))}
          <Pressable style={styles.clearBtn} onPress={onClear}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        </View>
      ) : null}
    </EditorPanelShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateBtn: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    justifyContent: 'center',
  },
  templateLabel: {
    fontSize: 14,
    color: theme.color.text.primary,
    fontWeight: '600',
  },
  layers: {
    gap: 8,
    marginTop: 4,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  layerText: {
    fontSize: 14,
    color: theme.color.text.primary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  clearBtn: {
    paddingVertical: 10,
  },
  clear: {
    fontSize: 14,
    color: theme.color.accent.red,
    fontWeight: '600',
  },
});
