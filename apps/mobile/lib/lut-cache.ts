import { File, Paths } from 'expo-file-system';

import {
  cubeToHaldTexture,
  HALD_GRID_DIM,
  HALD_SLICE_SIZE,
  HALD_TEXTURE_SIZE,
  LUT_HALD_SHADER_SOURCE,
  parseCubeFile,
  validateCubeLut,
} from '@moodlab/lut-engine';
import { API_BASE_URL } from './config';

type LutTextureCache = {
  mode: 'hald';
  size: number;
  gridDim: number;
  width: number;
  height: number;
  rgba: Uint8Array;
};

const cubeTextCache = new Map<string, string>();
const textureCache = new Map<string, LutTextureCache>();

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

export async function getLutGpuTexture(lutId: string): Promise<LutTextureCache> {
  const cached = textureCache.get(lutId);
  if (cached) return cached;

  const cubeText = await fetchLutCubeText(lutId);
  const parsed = parseCubeFile(cubeText);
  const validation = validateCubeLut(parsed);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }

  const hald = cubeToHaldTexture(parsed);
  const entry: LutTextureCache = {
    mode: 'hald',
    size: HALD_SLICE_SIZE,
    gridDim: HALD_GRID_DIM,
    width: hald.width,
    height: hald.height,
    rgba: hald.rgba,
  };
  textureCache.set(lutId, entry);
  return entry;
}

export function getLutShaderSource(): string {
  return LUT_HALD_SHADER_SOURCE;
}

export const LUT_TEX_SIZE = HALD_TEXTURE_SIZE;

/** Write fetched .cube to device cache for iOS CIColorCube export. */
export async function getLutCubeLocalPath(lutId: string): Promise<string> {
  const text = await fetchLutCubeText(lutId);
  const file = new File(Paths.cache, `lut-${lutId}.cube`);
  file.create({ overwrite: true });
  file.write(text);
  return file.uri;
}
