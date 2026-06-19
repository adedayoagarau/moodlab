import type { BeautySettings, EditRecipe } from './index';

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function mergeEditRecipe(base: EditRecipe, patch: Partial<EditRecipe>): EditRecipe {
  return {
    ...base,
    ...patch,
    adjustments: { ...base.adjustments, ...patch.adjustments },
    beauty: { ...base.beauty, ...patch.beauty },
    textLayers: patch.textLayers ?? base.textLayers,
  };
}

export function validateBeautyIntensity(value: number, max = 0.75): number {
  return clamp01(value / max) * max;
}

export type SkinProtectionLevel = BeautySettings['skinProtection'];

export function skinProtectionMultiplier(level: SkinProtectionLevel | undefined): number {
  switch (level) {
    case 'off':
      return 1;
    case 'low':
      return 0.85;
    case 'medium':
      return 0.65;
    case 'high':
      return 0.45;
    default:
      return 0.65;
  }
}
