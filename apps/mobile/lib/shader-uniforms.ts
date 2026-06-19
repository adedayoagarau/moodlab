import {
  beautyShaderUniforms,
  skinProtectionMultiplier,
  type AdjustmentStack,
  type BeautySettings,
} from '@moodlab/shared';

import type { FaceGeometry } from '@/lib/face-region';

export type LutShaderUniformMap = {
  strength: number;
  skinStrength: number;
  lutSize: number;
  imageWidth: number;
  imageHeight: number;
  useSkinMask: number;
  faceX: number;
  faceY: number;
  faceW: number;
  faceH: number;
  eyeX: number;
  eyeY: number;
  eyeW: number;
  eyeH: number;
  underEyeX: number;
  underEyeY: number;
  underEyeW: number;
  underEyeH: number;
  lipX: number;
  lipY: number;
  lipW: number;
  lipH: number;
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

function regionUniforms(r: { x: number; y: number; w: number; h: number }) {
  return { x: r.x, y: r.y, w: r.w, h: r.h };
}

export function buildLutShaderUniforms(input: {
  lutStrength: number;
  lutSize: number;
  canvasWidth: number;
  canvasHeight: number;
  geometry: FaceGeometry;
  adjustments?: AdjustmentStack;
  beauty?: BeautySettings;
  hasSkinMask?: boolean;
}): LutShaderUniformMap {
  const beauty = input.beauty ?? {};
  const skinProtection = beauty.skinProtection ?? 'medium';
  const faceLutStrength = beauty.faceLutStrength ?? 0.55;
  const skinStrength =
    input.lutStrength * faceLutStrength * skinProtectionMultiplier(skinProtection);
  const fx = beautyShaderUniforms(input.adjustments, beauty);
  const face = regionUniforms(input.geometry.face);
  const eyes = regionUniforms(input.geometry.eyes);
  const underEye = regionUniforms(input.geometry.underEye);
  const lips = regionUniforms(input.geometry.lips);

  return {
    strength: input.lutStrength,
    skinStrength,
    lutSize: input.lutSize,
    imageWidth: input.canvasWidth,
    imageHeight: input.canvasHeight,
    useSkinMask: input.hasSkinMask ? 1 : 0,
    faceX: face.x,
    faceY: face.y,
    faceW: face.w,
    faceH: face.h,
    eyeX: eyes.x,
    eyeY: eyes.y,
    eyeW: eyes.w,
    eyeH: eyes.h,
    underEyeX: underEye.x,
    underEyeY: underEye.y,
    underEyeW: underEye.w,
    underEyeH: underEye.h,
    lipX: lips.x,
    lipY: lips.y,
    lipW: lips.w,
    lipH: lips.h,
    ...fx,
  };
}
