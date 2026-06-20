import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export type EditorTool = 'mood' | 'adjust' | 'beauty' | 'text' | 'export';

const TOOLS: { id: EditorTool; label: string }[] = [
  { id: 'mood', label: 'Mood' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'text', label: 'Text' },
  { id: 'export', label: 'Export' },
];

type Props = {
  active: EditorTool;
  onSelect: (tool: EditorTool) => void;
  bottomInset?: number;
};

export function EditorToolbar({ active, onSelect, bottomInset = 0 }: Props) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottomInset, 8) }]}>
      {TOOLS.map((tool) => {
        const isActive = tool.id === active;
        return (
          <Pressable
            key={tool.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(tool.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tool.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.color.surface.elevated,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  tabActive: {
    backgroundColor: theme.color.surface.raised,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.color.text.muted,
  },
  tabTextActive: {
    color: theme.color.accent.gold,
    fontWeight: '700',
  },
});
