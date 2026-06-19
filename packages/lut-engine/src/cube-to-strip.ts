import type { ParsedCubeLut } from './cube-parser';

/** 2D strip layout for GPU LUT sampling: width = size², height = size. */
export type LutStripTexture = {
  width: number;
  height: number;
  size: number;
  rgba: Uint8Array;
};

/**
 * Pack a parsed .cube LUT into RGBA bytes for Skia ImageShader.
 * Cube iteration order: blue → green → red (standard .cube layout).
 */
export function cubeToStripTexture(lut: ParsedCubeLut): LutStripTexture {
  const { size, data } = lut;
  const width = size * size;
  const height = size;
  const rgba = new Uint8Array(width * height * 4);

  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        const src = (b * size * size + g * size + r) * 3;
        const x = g * size + r;
        const y = b;
        const dst = (y * width + x) * 4;
        rgba[dst] = Math.round(clamp01(data[src]) * 255);
        rgba[dst + 1] = Math.round(clamp01(data[src + 1]) * 255);
        rgba[dst + 2] = Math.round(clamp01(data[src + 2]) * 255);
        rgba[dst + 3] = 255;
      }
    }
  }

  return { width, height, size, rgba };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
