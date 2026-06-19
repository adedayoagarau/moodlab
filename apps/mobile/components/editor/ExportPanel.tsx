import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { EXPORT_PRESETS, type ExportPresetId } from '@moodlab/shared';

type Props = {
  onExport: (presetId: ExportPresetId) => void;
  onSaveProject: () => void;
};

const PRESET_IDS = Object.keys(EXPORT_PRESETS) as ExportPresetId[];

export function ExportPanel({ onExport, onSaveProject }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Export</Text>
      <View style={styles.grid}>
        {PRESET_IDS.map((id) => {
          const preset = EXPORT_PRESETS[id];
          return (
            <Pressable key={id} style={styles.exportBtn} onPress={() => onExport(id)}>
              <Text style={styles.exportLabel}>{preset.label}</Text>
              <Text style={styles.exportMeta}>{preset.aspect}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.saveBtn} onPress={onSaveProject}>
        <Text style={styles.saveBtnText}>Save project</Text>
      </Pressable>
      <Text style={styles.hint}>
        iOS: exports via Apple CIColorCube when dev build is installed. Other platforms: format
        selection scaffold until native export ships.
      </Text>
    </View>
  );
}

export function showExportAlert(presetLabel: string) {
  Alert.alert('Export ready', `${presetLabel} — native full-res export lands with RenderCore.`);
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
  exportBtn: {
    width: '47%',
    padding: theme.space[3],
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface.elevated,
  },
  exportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  exportMeta: {
    fontSize: 12,
    color: theme.color.text.muted,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: theme.color.accent.gold,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.surface.base,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.text.muted,
  },
});
