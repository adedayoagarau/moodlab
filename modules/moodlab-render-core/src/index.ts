import { requireNativeModule, Platform } from 'expo-modules-core';

export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  source: 'vision' | 'mlkit' | 'heuristic';
};

type NativeModule = {
  detectFaceRegion: (uri: string) => Promise<NormalizedRect | null>;
  detectPersonRegion: (uri: string) => Promise<NormalizedRect | null>;
  exportWithColorCube: (
    sourceUri: string,
    cubePath: string,
    strength: number,
  ) => Promise<string>;
  isAvailable: () => boolean;
};

const Native = Platform.OS === 'ios'
  ? requireNativeModule<NativeModule>('MoodlabRenderCore')
  : null;

export function isNativeRenderCoreAvailable(): boolean {
  return Native?.isAvailable() ?? false;
}

export async function detectFaceRegionNative(uri: string): Promise<NormalizedRect | null> {
  if (!Native) return null;
  try {
    const result = await Native.detectFaceRegion(uri);
    return result ? { ...result, source: 'vision' } : null;
  } catch {
    return null;
  }
}

export async function detectPersonRegionNative(uri: string): Promise<NormalizedRect | null> {
  if (!Native) return null;
  try {
    const result = await Native.detectPersonRegion(uri);
    return result ? { ...result, source: 'vision' } : null;
  } catch {
    return null;
  }
}

export async function exportWithColorCubeNative(
  sourceUri: string,
  cubePath: string,
  strength: number,
): Promise<string | null> {
  if (!Native) return null;
  try {
    return await Native.exportWithColorCube(sourceUri, cubePath, strength);
  } catch {
    return null;
  }
}
