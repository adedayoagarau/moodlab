import { Alert, Platform } from 'react-native';
import type { RefObject } from 'react';
import type { CanvasRef } from '@shopify/react-native-skia';
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { EXPORT_PRESETS, type ExportPresetId } from '@moodlab/shared';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function shareCanvasExport(
  canvasRef: RefObject<CanvasRef | null>,
  presetId: ExportPresetId,
): Promise<void> {
  const preset = EXPORT_PRESETS[presetId];
  const snapshot = canvasRef.current?.makeImageSnapshot();
  if (!snapshot) {
    throw new Error('Could not capture editor preview — try again after the image loads');
  }

  const pngBytes = snapshot.encodeToBytes();
  if (!pngBytes) {
    throw new Error('PNG encode failed');
  }

  const filename = `moodlab-${presetId}-${Date.now()}.png`;
  const outPath = `${cacheDirectory ?? ''}${filename}`;
  await writeAsStringAsync(outPath, bytesToBase64(pngBytes), {
    encoding: EncodingType.Base64,
  });

  if (Platform.OS === 'web') {
    Alert.alert(
      'Export ready',
      `${preset.label} captured at preview resolution (${snapshot.width()}×${snapshot.height()}). Full ${preset.width}×${preset.height} export ships with RenderCore.`,
    );
    return;
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    Alert.alert('Export saved', `${preset.label} saved to cache.`);
    return;
  }

  await Sharing.shareAsync(outPath, {
    mimeType: 'image/png',
    dialogTitle: `Share ${preset.label}`,
  });
}
