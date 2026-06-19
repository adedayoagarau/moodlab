import type { ParsedCubeLut } from './cube-parser';

/** Hald CLUT layout for Skia shaders (8×8 grid of 64×64 slices → 512×512). */
export const HALD_TEXTURE_SIZE = 512;
export const HALD_GRID_DIM = 8;
export const HALD_SLICE_SIZE = 64;

export type HaldTexture = {
  width: number;
  height: number;
  gridDim: number;
  sliceSize: number;
  rgba: Uint8Array;
};

function sampleCubeTrilinear(
  lut: ParsedCubeLut,
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const { size, data } = lut;
  const max = size - 1;
  const rf = r * max;
  const gf = g * max;
  const bf = b * max;

  const r0 = Math.floor(rf);
  const g0 = Math.floor(gf);
  const b0 = Math.floor(bf);
  const r1 = Math.min(r0 + 1, max);
  const g1 = Math.min(g0 + 1, max);
  const b1 = Math.min(b0 + 1, max);

  const dr = rf - r0;
  const dg = gf - g0;
  const db = bf - b0;

  function at(ri: number, gi: number, bi: number): [number, number, number] {
    const idx = (bi * size * size + gi * size + ri) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  const c000 = at(r0, g0, b0);
  const c100 = at(r1, g0, b0);
  const c010 = at(r0, g1, b0);
  const c110 = at(r1, g1, b0);
  const c001 = at(r0, g0, b1);
  const c101 = at(r1, g0, b1);
  const c011 = at(r0, g1, b1);
  const c111 = at(r1, g1, b1);

  const mix = (a: number, b: number, t: number) => a + (b - a) * t;

  const out: [number, number, number] = [0, 0, 0];
  for (let ch = 0; ch < 3; ch++) {
    const c00 = mix(c000[ch], c100[ch], dr);
    const c01 = mix(c001[ch], c101[ch], dr);
    const c10 = mix(c010[ch], c110[ch], dr);
    const c11 = mix(c011[ch], c111[ch], dr);
    const c0 = mix(c00, c10, dg);
    const c1 = mix(c01, c11, dg);
    out[ch] = mix(c0, c1, db);
  }
  return out;
}

/**
 * Build 512×512 Hald RGBA for react-native-skia LUT shaders (discussion #1436).
 * Upsamples arbitrary cube size to 64³ via trilinear interpolation.
 */
export function cubeToHaldTexture(lut: ParsedCubeLut): HaldTexture {
  const rgba = new Uint8Array(HALD_TEXTURE_SIZE * HALD_TEXTURE_SIZE * 4);
  const sliceSize = HALD_SLICE_SIZE;
  const gridDim = HALD_GRID_DIM;

  for (let bi = 0; bi < sliceSize; bi++) {
    for (let gi = 0; gi < sliceSize; gi++) {
      for (let ri = 0; ri < sliceSize; ri++) {
        const r = ri / (sliceSize - 1);
        const g = gi / (sliceSize - 1);
        const b = bi / (sliceSize - 1);
        const [or, og, ob] = sampleCubeTrilinear(lut, r, g, b);

        const sliceIndex = bi;
        const tileX = sliceIndex % gridDim;
        const tileY = Math.floor(sliceIndex / gridDim);
        const x = tileX * sliceSize + ri;
        const y = tileY * sliceSize + gi;
        const dst = (y * HALD_TEXTURE_SIZE + x) * 4;
        rgba[dst] = Math.round(Math.min(1, Math.max(0, or)) * 255);
        rgba[dst + 1] = Math.round(Math.min(1, Math.max(0, og)) * 255);
        rgba[dst + 2] = Math.round(Math.min(1, Math.max(0, ob)) * 255);
        rgba[dst + 3] = 255;
      }
    }
  }

  return {
    width: HALD_TEXTURE_SIZE,
    height: HALD_TEXTURE_SIZE,
    gridDim,
    sliceSize,
    rgba,
  };
}
