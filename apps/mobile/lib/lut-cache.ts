import {
  cacheDirectory,
  writeAsStringAsync,
  getInfoAsync,
} from 'expo-file-system/legacy';
import {
  cubeToStripTexture,
  LUT_STRIP_SHADER_SOURCE,
  parseCubeFile,
} from '@moodlab/lut-engine';
import { API_BASE_URL } from './config';

type LutImageCache = {
  size: number;
  width: number;
  height: number;
  rgba: Uint8Array;
};

const cubeTextCache = new Map<string, string>();
const stripCache = new Map<string, LutImageCache>();

export async function fetchLutCubeText(lutId: string): Promise<string> {
  const cached = cubeTextCache.get(lutId);
  if (cached) return cached;

  const res = await fetch(`${API_BASE_URL}/api/v1/luts/${lutId}/cube`);
  if (!res.ok) {
    throw new Error(`Failed to load LUT cube (${res.status})`);
  }
  const text = await res.text();
  cubeTextCache.set(lutId, text);
  return text;
}

export async function getLutStripTexture(lutId: string): Promise<LutImageCache> {
  const cached = stripCache.get(lutId);
  if (cached) return cached;

  const cubeText = await fetchLutCubeText(lutId);
  const parsed = parseCubeFile(cubeText);
  const strip = cubeToStripTexture(parsed);
  const entry: LutImageCache = {
    size: strip.size,
    width: strip.width,
    height: strip.height,
    rgba: strip.rgba,
  };
  stripCache.set(lutId, entry);
  return entry;
}

export async function fetchLutCubePath(lutId: string): Promise<string> {
  const filename = `${lutId}.cube`;
  const path = `${cacheDirectory ?? ''}${filename}`;
  const info = await getInfoAsync(path);
  if (info.exists) {
    return path;
  }
  const text = await fetchLutCubeText(lutId);
  await writeAsStringAsync(path, text);
  return path;
}

export function getLutShaderSource(): string {
  return LUT_STRIP_SHADER_SOURCE;
}
