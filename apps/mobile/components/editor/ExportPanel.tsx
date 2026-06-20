import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EditorPanelShell } from '@/components/editor/EditorPanelShell';
import { theme } from '@/constants/theme';
import { EXPORT_PRESETS, type ExportPresetId } from '@moodlab/shared';

type Props = {
  exporting?: boolean;
  onExport: (presetId: ExportPresetId) => void;
  onSaveProject: () => void;
};

const PRESET_IDS = Object.keys(EXPORT_PRESETS) as ExportPresetId[];

export function ExportPanel({ exporting, onExport, onSaveProject }: Props) {
  return (
    <EditorPanelShell
      title="Export"
      subtitle="Pick a format — share sheet opens with your edited image">
      <View style={styles.grid}>
        {PRESET_IDS.map((id) => {
          const preset = EXPORT_PRESETS[id];
          return (
            <Pressable
              key={id}
              style={[styles.exportBtn, exporting && styles.exportBtnDisabled]}
              disabled={exporting}
              onPress={() => onExport(id)}>
              <Text style={styles.exportLabel}>{preset.label}</Text>
              <Text style={styles.exportMeta}>
                {preset.aspect} · {preset.width}×{preset.height}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.saveBtn} onPress={onSaveProject} disabled={exporting}>
        <Text style={styles.saveBtnText}>Save project</Text>
      </Pressable>
      {exporting ? (
        <View style={styles.exportingRow}>
          <ActivityIndicator color={theme.color.accent.gold} />
          <Text style={styles.exportingText}>Rendering export…</Text>
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
  exportBtn: {
    width: '47%',
    minHeight: 64,
    padding: theme.space[3],
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface.elevated,
    justifyContent: 'center',
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  exportMeta: {
    fontSize: 11,
    color: theme.color.text.muted,
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: theme.color.accent.gold,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.surface.base,
  },
  exportingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingTop: 4,
  },
  exportingText: {
    fontSize: 13,
    color: theme.color.text.secondary,
  },
});
