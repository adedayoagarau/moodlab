import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdjustPanel } from '@/components/editor/AdjustPanel';
import { BeautyPanel } from '@/components/editor/BeautyPanel';
import { EditorToolbar, type EditorTool } from '@/components/editor/EditorToolbar';
import { ExportPanel, showExportAlert } from '@/components/editor/ExportPanel';
import { LutSkiaViewport } from '@/components/editor/LutSkiaViewport';
import { MoodPanel } from '@/components/editor/MoodPanel';
import { TextPanel } from '@/components/editor/TextPanel';
import { theme } from '@/constants/theme';
import { fetchLuts, fetchManifest, saveProject } from '@/lib/api';
import { exportWithNativeColorCube } from '@/lib/face-region';
import { getLutCubeLocalPath } from '@/lib/lut-cache';
import { syncProjectToSupabase } from '@/lib/supabase';
import {
  DEFAULT_EDIT_RECIPE,
  EXPORT_PRESETS,
  mergeEditRecipe,
  type ExportPresetId,
  type LutDefinition,
  type TextLayer,
} from '@moodlab/shared';

export default function EditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ uri?: string }>();
  const imageUri = params.uri ? decodeURIComponent(params.uri) : '';

  const [tool, setTool] = useState<EditorTool>('mood');
  const [luts, setLuts] = useState<LutDefinition[]>([]);
  const [textTemplates, setTextTemplates] = useState<
    { id: string; label: string; text: string }[]
  >([]);
  const [recipe, setRecipe] = useState(DEFAULT_EDIT_RECIPE);
  const [showOriginal, setShowOriginal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLuts()
      .then((items) => {
        setLuts(items);
        if (!recipe.lutId && items[0]) {
          setRecipe((r) =>
            mergeEditRecipe(r, {
              lutId: items[0].id,
              lutStrength: items[0].defaultStrength,
              beauty: {
                ...r.beauty,
                skinProtection: items[0].skinProtectionDefault,
              },
            }),
          );
        }
      })
      .catch(() => setLuts([]));

    fetchManifest()
      .then((m) => setTextTemplates(m.textTemplates))
      .catch(() => setTextTemplates([]));
  }, []);

  const selectedLut = useMemo(
    () => luts.find((l) => l.id === recipe.lutId),
    [luts, recipe.lutId],
  );

  const updateRecipe = useCallback((patch: Partial<typeof recipe>) => {
    setRecipe((r) => mergeEditRecipe(r, patch));
  }, []);

  function selectLut(lut: LutDefinition) {
    updateRecipe({
      lutId: lut.id,
      lutStrength: lut.defaultStrength,
      beauty: {
        ...recipe.beauty,
        skinProtection: lut.skinProtectionDefault,
      },
      adjustments: {
        ...recipe.adjustments,
        grain: lut.recommendedEffects?.grain ?? recipe.adjustments.grain,
        vignette: lut.recommendedEffects?.vignette ?? recipe.adjustments.vignette,
      },
    });
  }

  function addTextTemplate(template: { id: string; label: string; text: string }) {
    const layer: TextLayer = {
      id: `text-${Date.now()}`,
      text: template.text,
      templateId: template.id,
      x: 0.5,
      y: 0.75,
      scale: 1,
      rotation: 0,
    };
    updateRecipe({ textLayers: [...recipe.textLayers, layer] });
  }

  async function handleSaveProject() {
    if (!imageUri) return;
    setSaving(true);
    try {
      const project = await saveProject({
        name: selectedLut?.name ?? 'Untitled edit',
        sourceUri: imageUri,
        recipe,
      });
      const synced = await syncProjectToSupabase(project);
      Alert.alert(
        'Saved',
        synced ? 'Project saved locally and synced to Supabase.' : 'Project saved to API store.',
      );
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  async function handleExport(presetId: ExportPresetId) {
    const label = EXPORT_PRESETS[presetId].label;
    if (recipe.lutId) {
      try {
        const cubePath = await getLutCubeLocalPath(recipe.lutId);
        const exported = await exportWithNativeColorCube(
          imageUri,
          cubePath,
          recipe.lutStrength,
        );
        if (exported) {
          Alert.alert('Exported', `${label} via Apple CIColorCube.\n${exported}`);
          return;
        }
      } catch {
        // fall through to scaffold message
      }
    }
    showExportAlert(label);
  }

  if (!imageUri) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No image selected.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.topAction}>Close</Text>
        </Pressable>
        <Text style={styles.topTitle}>{selectedLut?.name ?? 'Editor'}</Text>
        <Pressable onPress={() => setShowOriginal((v) => !v)} hitSlop={12}>
          <Text style={styles.topAction}>{showOriginal ? 'After' : 'Before'}</Text>
        </Pressable>
      </View>

      <View style={styles.canvas}>
        <LutSkiaViewport
          imageUri={imageUri}
          lutId={recipe.lutId}
          lutStrength={recipe.lutStrength}
          skinProtection={recipe.beauty.skinProtection}
          faceLutStrength={recipe.beauty.faceLutStrength}
          showOriginal={showOriginal}
          style={styles.viewport}>
          {recipe.textLayers.map((layer) => (
            <View key={layer.id} style={styles.textOverlay} pointerEvents="none">
              <Text style={styles.overlayText}>{layer.text}</Text>
            </View>
          ))}
        </LutSkiaViewport>
      </View>

      <View style={styles.panel}>
        {tool === 'mood' ? (
          <MoodPanel
            luts={luts}
            selectedId={recipe.lutId}
            strength={recipe.lutStrength}
            onSelectLut={selectLut}
            onStrengthChange={(v) => updateRecipe({ lutStrength: v })}
          />
        ) : null}
        {tool === 'adjust' ? (
          <AdjustPanel
            adjustments={recipe.adjustments}
            onChange={(key, value) =>
              updateRecipe({ adjustments: { ...recipe.adjustments, [key]: value } })
            }
          />
        ) : null}
        {tool === 'beauty' ? (
          <BeautyPanel
            beauty={recipe.beauty}
            onChange={(patch) => updateRecipe({ beauty: { ...recipe.beauty, ...patch } })}
          />
        ) : null}
        {tool === 'text' ? (
          <TextPanel
            templates={textTemplates}
            layers={recipe.textLayers}
            onAddTemplate={addTextTemplate}
            onClear={() => updateRecipe({ textLayers: [] })}
          />
        ) : null}
        {tool === 'export' ? (
          <ExportPanel
            onExport={handleExport}
            onSaveProject={handleSaveProject}
          />
        ) : null}
      </View>

      <EditorToolbar active={tool} onSelect={setTool} />
      {saving ? (
        <View style={styles.savingBanner}>
          <Text style={styles.savingText}>Saving…</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
  },
  topAction: {
    fontSize: 15,
    color: theme.color.accent.gold,
    fontWeight: '600',
  },
  topTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  canvas: {
    flex: 1,
    backgroundColor: theme.color.surface.default,
  },
  viewport: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: '18%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: theme.radius.sm,
  },
  overlayText: {
    color: theme.color.text.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  panel: {
    maxHeight: 280,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.surface.base,
    gap: 12,
  },
  emptyText: {
    color: theme.color.text.secondary,
  },
  backLink: {
    color: theme.color.accent.gold,
    fontWeight: '600',
  },
  savingBanner: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: theme.color.glass,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
  },
  savingText: {
    color: theme.color.text.primary,
    fontSize: 13,
  },
});
