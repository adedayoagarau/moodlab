import type { AdjustmentStack, BeautySettings } from './index';

/** Normalized shader uniforms derived from edit recipe adjustments + beauty. */
export type ShaderAdjustmentUniforms = {
  exposure: number;
  contrast: number;
  warmth: number;
  saturation: number;
  vignette: number;
  grain: number;
  glow: number;
  faceLight: number;
  melaninGuard: number;
};

export function shaderAdjustmentUniforms(
  adjustments: AdjustmentStack = {},
  beauty: BeautySettings = {},
): ShaderAdjustmentUniforms {
  return {
    exposure: adjustments.exposure ?? 0,
    contrast: adjustments.contrast ?? 0,
    warmth: adjustments.warmth ?? 0,
    saturation: adjustments.saturation ?? 0,
    vignette: adjustments.vignette ?? 0,
    grain: adjustments.grain ?? 0,
    glow: adjustments.glow ?? 0,
    faceLight: beauty.faceLight ?? 0,
    melaninGuard: beauty.melaninGuard ? 1 : 0,
  };
}
