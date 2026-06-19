import { Alert, Platform } from 'react-native';
import type { RefObject } from 'react';
import type { CanvasRef } from '@shopify/react-native-skia';
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { FaceGeometry } from '@/lib/face-region';
import { renderRecipeToPngBytes } from '@/lib/render-recipe-export';
import { EXPORT_PRESETS, type EditRecipe, type ExportPresetId } from '@moodlab/shared';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function writePngAndShare(outPath: string, pngBytes: Uint8Array, presetLabel: string) {
  await writeAsStringAsync(outPath, bytesToBase64(pngBytes), {
    encoding: EncodingType.Base64,
  });

  if (Platform.OS === 'web') {
    Alert.alert('Export ready', `${presetLabel} saved (${pngBytes.length} bytes).`);
    return;
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    Alert.alert('Export saved', `${presetLabel} saved to cache.`);
    return;
  }

  await Sharing.shareAsync(outPath, {
    mimeType: 'image/png',
    dialogTitle: `Share ${presetLabel}`,
  });
}

export async function shareRecipeExport(
  imageUri: string,
  recipe: EditRecipe,
  presetId: ExportPresetId,
  geometry: FaceGeometry,
  canvasRef?: RefObject<CanvasRef | null>,
): Promise<void> {
  const preset = EXPORT_PRESETS[presetId];
  const filename = `moodlab-${presetId}-${Date.now()}.png`;
  const outPath = `${cacheDirectory ?? ''}${filename}`;

  try {
    const pngBytes = await renderRecipeToPngBytes(imageUri, recipe, presetId, geometry);
    await writePngAndShare(
      outPath,
      pngBytes,
      `${preset.label} (${preset.width}×${preset.height})`,
    );
    return;
  } catch {
    // Fall back to preview-resolution canvas capture
  }

  const snapshot = canvasRef?.current?.makeImageSnapshot();
  if (!snapshot) {
    throw new Error('Export failed — ensure the image and mood are loaded');
  }

  const pngBytes = snapshot.encodeToBytes();
  if (!pngBytes) {
    throw new Error('PNG encode failed');
  }

  await writePngAndShare(
    outPath,
    pngBytes,
    `${preset.label} (preview ${snapshot.width()}×${snapshot.height()})`,
  );
}
