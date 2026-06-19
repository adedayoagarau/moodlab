import { Platform } from 'react-native';
import {
  cacheDirectory,
  downloadAsync,
  writeAsStringAsync,
  EncodingType,
} from 'expo-file-system/legacy';

import { fetchLutCubePath } from '@/lib/lut-cache';
import { skinProtectionToNative } from '@/lib/face-region';
import type { EditRecipe, ExportPresetId } from '@moodlab/shared';
import { EXPORT_PRESETS } from '@moodlab/shared';

async function ensureCubeFile(lutId: string): Promise<string | null> {
  try {
    return await fetchLutCubePath(lutId);
  } catch {
    return null;
  }
}

export async function exportWithNativeRenderCore(
  imageUri: string,
  recipe: EditRecipe,
  presetId: ExportPresetId,
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const native = await import('moodlab-render-core');
    if (!native.isNativeRenderCoreAvailable()) return null;

    const preset = EXPORT_PRESETS[presetId];
    const beauty = recipe.beauty ?? {};
    const cubePath = recipe.lutId ? await ensureCubeFile(recipe.lutId) : null;

    const outUri = await native.exportWithBeautyPipelineNative({
      sourceUri: imageUri,
      cubePath: cubePath ?? undefined,
      lutStrength: recipe.lutStrength,
      skinSmooth: beauty.skinSmooth ?? 0,
      textureRestore: beauty.textureRestore ?? 0.55,
      evenTone: beauty.evenTone ?? 0,
      reduceShine: beauty.reduceShine ?? 0,
      faceLight: beauty.faceLight ?? 0,
      skinProtection: skinProtectionToNative(beauty),
      outputWidth: preset.width,
      outputHeight: preset.height,
    });

    if (!outUri) return null;

    // Copy to cache with predictable name for sharing
    const filename = `moodlab-native-${presetId}-${Date.now()}.jpg`;
    const dest = `${cacheDirectory ?? ''}${filename}`;
    if (outUri.startsWith('file://')) {
      const { readAsStringAsync } = await import('expo-file-system/legacy');
      const base64 = await readAsStringAsync(outUri, { encoding: EncodingType.Base64 });
      await writeAsStringAsync(dest, base64, { encoding: EncodingType.Base64 });
      return dest.startsWith('file://') ? dest : `file://${dest}`;
    }

    const downloaded = await downloadAsync(outUri, dest);
    return downloaded.uri;
  } catch {
    return null;
  }
}
