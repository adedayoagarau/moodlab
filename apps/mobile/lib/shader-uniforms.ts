import {
  shaderAdjustmentUniforms,
  skinProtectionMultiplier,
  type AdjustmentStack,
  type BeautySettings,
} from '@moodlab/shared';

import type { FaceRegion } from '@/lib/face-region';

export type LutShaderUniformMap = {
  strength: number;
  skinStrength: number;
  lutSize: number;
  imageWidth: number;
  imageHeight: number;
  faceX: number;
  faceY: number;
  faceW: number;
  faceH: number;
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

export function buildLutShaderUniforms(input: {
  lutStrength: number;
  lutSize: number;
  canvasWidth: number;
  canvasHeight: number;
  face: FaceRegion;
  adjustments?: AdjustmentStack;
  beauty?: BeautySettings;
}): LutShaderUniformMap {
  const beauty = input.beauty ?? {};
  const skinProtection = beauty.skinProtection ?? 'medium';
  const faceLutStrength = beauty.faceLutStrength ?? 0.55;
  const skinStrength =
    input.lutStrength * faceLutStrength * skinProtectionMultiplier(skinProtection);
  const postFx = shaderAdjustmentUniforms(input.adjustments, beauty);

  return {
    strength: input.lutStrength,
    skinStrength,
    lutSize: input.lutSize,
    imageWidth: input.canvasWidth,
    imageHeight: input.canvasHeight,
    faceX: input.face.x,
    faceY: input.face.y,
    faceW: input.face.w,
    faceH: input.face.h,
    ...postFx,
  };
}

export function uniformMapToSkiaRecord(
  uniforms: LutShaderUniformMap,
): Record<string, number> {
  return { ...uniforms };
}
