import type { AdjustmentStack, BeautySettings } from './index';

/** All GPU uniforms for the comprehensive beauty + grade shader. */
export type BeautyShaderUniforms = {
  exposure: number;
  contrast: number;
  warmth: number;
  saturation: number;
  vignette: number;
  grain: number;
  glow: number;
  faceLight: number;
  melaninGuard: number;
  skinSmooth: number;
  textureRestore: number;
  evenTone: number;
  reduceShine: number;
  underEyeLift: number;
  eyeBrightness: number;
  lipColorBoost: number;
  melaninAshFix: number;
  melaninWarmthProtect: number;
  bgLutStrength: number;
};

export function beautyShaderUniforms(
  adjustments: AdjustmentStack = {},
  beauty: BeautySettings = {},
): BeautyShaderUniforms {
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
    skinSmooth: beauty.skinSmooth ?? 0,
    textureRestore: beauty.textureRestore ?? 0.55,
    evenTone: beauty.evenTone ?? 0,
    reduceShine: beauty.reduceShine ?? 0,
    underEyeLift: beauty.underEyeLift ?? 0,
    eyeBrightness: beauty.eyeBrightness ?? 0,
    lipColorBoost: beauty.lipColorBoost ?? 0,
    melaninAshFix: beauty.melaninAshFix ?? 0,
    melaninWarmthProtect: beauty.melaninWarmthProtect ?? 0,
    bgLutStrength: beauty.backgroundLutStrength ?? 1,
  };
}

/** @deprecated Use beautyShaderUniforms */
export function shaderAdjustmentUniforms(
  adjustments: AdjustmentStack = {},
  beauty: BeautySettings = {},
): BeautyShaderUniforms {
  return beautyShaderUniforms(adjustments, beauty);
}

export type ShaderAdjustmentUniforms = BeautyShaderUniforms;
