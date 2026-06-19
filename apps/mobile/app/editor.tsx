import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCanvasRef } from '@shopify/react-native-skia';

import { PaywallSheet } from '@/components/PaywallSheet';
import { AdjustPanel } from '@/components/editor/AdjustPanel';
import { BeautyPanel } from '@/components/editor/BeautyPanel';
import { EditorToolbar, type EditorTool } from '@/components/editor/EditorToolbar';
import { ExportPanel } from '@/components/editor/ExportPanel';
import { LutSkiaViewport } from '@/components/editor/LutSkiaViewport';
import { MoodPanel } from '@/components/editor/MoodPanel';
import { TextPanel } from '@/components/editor/TextPanel';
import { theme } from '@/constants/theme';
import { fetchLuts, fetchManifest, saveProject } from '@/lib/api';
import { hasProEntitlement, unlockProDemo } from '@/lib/entitlements';
import { shareRecipeExport } from '@/lib/export-image';
import { detectFaceRegion, DEFAULT_FACE_REGION, type FaceRegion } from '@/lib/face-region';
import { saveLocalProject } from '@/lib/local-projects';
import {
  DEFAULT_EDIT_RECIPE,
  mergeEditRecipe,
  type ExportPresetId,
  type LutDefinition,
  type TextLayer,
} from '@moodlab/shared';

const WORKFLOW_LUTS: Record<string, string> = {
  'beat-cover': 'afrobeat-warm-cover',
  'artist-release': 'film-memory-gold',
  portrait: 'sunny-cover-glow',
  thumbnail: 'street-flash',
};

export default function EditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const canvasRef = useCanvasRef();
  const savedProjectId = useRef<string | undefined>(undefined);
  const params = useLocalSearchParams<{
    uri?: string;
    workflow?: string;
    projectId?: string;
    recipe?: string;
  }>();
  const imageUri = params.uri ? decodeURIComponent(params.uri) : '';

  const [tool, setTool] = useState<EditorTool>('mood');
  const [luts, setLuts] = useState<LutDefinition[]>([]);
  const [textTemplates, setTextTemplates] = useState<
    { id: string; label: string; text: string }[]
  >([]);
  const [recipe, setRecipe] = useState(DEFAULT_EDIT_RECIPE);
  const [showOriginal, setShowOriginal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [paywallLut, setPaywallLut] = useState<LutDefinition | null>(null);
  const [faceRegion, setFaceRegion] = useState<FaceRegion>(DEFAULT_FACE_REGION);

  useEffect(() => {
    if (!imageUri) return;
    detectFaceRegion(imageUri).then(setFaceRegion);
  }, [imageUri]);

  useEffect(() => {
    hasProEntitlement().then(setIsPro);
  }, []);

  useEffect(() => {
    if (params.recipe) {
      try {
        const parsed = JSON.parse(decodeURIComponent(params.recipe));
        setRecipe((r) => mergeEditRecipe(r, parsed));
      } catch {
        // ignore malformed recipe param
      }
    }
    if (params.projectId) {
      savedProjectId.current = params.projectId;
    }
  }, [params.recipe, params.projectId]);

  useEffect(() => {
    fetchLuts()
      .then((items) => {
        setLuts(items);
        if (recipe.lutId) return;

        const workflowLut = params.workflow ? WORKFLOW_LUTS[params.workflow] : undefined;
        const preferred = workflowLut
          ? items.find((l) => l.id === workflowLut)
          : items.find((l) => l.plan === 'free');
        const first = preferred ?? items[0];
        if (!first) return;

        setRecipe((r) =>
          mergeEditRecipe(r, {
            lutId: first.id,
            lutStrength: first.defaultStrength,
            beauty: {
              ...r.beauty,
              skinProtection: first.skinProtectionDefault,
              melaninGuard: true,
            },
            adjustments: {
              ...r.adjustments,
              grain: first.recommendedEffects?.grain ?? r.adjustments.grain,
              vignette: first.recommendedEffects?.vignette ?? r.adjustments.vignette,
              glow: first.recommendedEffects?.glow ?? r.adjustments.glow,
            },
          }),
        );
      })
      .catch(() => setLuts([]));

    fetchManifest()
      .then((m) => setTextTemplates(m.textTemplates))
      .catch(() => setTextTemplates([]));
  }, [params.workflow]);

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
        glow: lut.recommendedEffects?.glow ?? recipe.adjustments.glow,
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
      const name = selectedLut?.name ?? 'Untitled edit';
      const local = await saveLocalProject({
        id: savedProjectId.current,
        name,
        sourceUri: imageUri,
        recipe,
      });
      savedProjectId.current = local.id;

      try {
        await saveProject({ name, sourceUri: imageUri, recipe });
      } catch {
        // API optional — local save is source of truth for V1
      }

      Alert.alert('Saved', `"${name}" saved to Projects.`);
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  async function handleExport(presetId: ExportPresetId) {
    setExporting(true);
    try {
      await shareRecipeExport(imageUri, recipe, presetId, faceRegion, canvasRef);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Could not export');
    } finally {
      setExporting(false);
    }
  }

  async function handleUnlockPro() {
    await unlockProDemo();
    setIsPro(true);
    setPaywallLut(null);
    if (paywallLut) {
      selectLut(paywallLut);
    }
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
          canvasRef={canvasRef}
          imageUri={imageUri}
          lutId={recipe.lutId}
          lutStrength={recipe.lutStrength}
          adjustments={recipe.adjustments}
          beauty={recipe.beauty}
          skinProtection={recipe.beauty.skinProtection}
          faceLutStrength={recipe.beauty.faceLutStrength}
          faceRegion={faceRegion}
          showOriginal={showOriginal}
          style={styles.viewport}>
          {recipe.textLayers.map((layer) => (
            <View
              key={layer.id}
              style={[
                styles.textOverlay,
                {
                  left: `${Math.round(layer.x * 100)}%`,
                  top: `${Math.round(layer.y * 100)}%`,
                  transform: [{ translateX: -80 }, { scale: layer.scale }],
                },
              ]}
              pointerEvents="none">
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
            isPro={isPro}
            onSelectLut={selectLut}
            onStrengthChange={(v) => updateRecipe({ lutStrength: v })}
            onLockedLutPress={(lut) => setPaywallLut(lut)}
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
            exporting={exporting}
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

      <PaywallSheet
        visible={paywallLut !== null}
        lutName={paywallLut?.name}
        onClose={() => setPaywallLut(null)}
        onUnlockDemo={handleUnlockPro}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: theme.radius.sm,
    maxWidth: '80%',
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
