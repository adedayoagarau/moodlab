import { describe, expect, it } from 'vitest';
import { DEFAULT_EDIT_RECIPE, mergeEditRecipe } from './index';
import { skinProtectionMultiplier, validateBeautyIntensity } from './editor-utils';

describe('edit recipe helpers', () => {
  it('merges nested adjustment stacks', () => {
    const merged = mergeEditRecipe(DEFAULT_EDIT_RECIPE, {
      adjustments: { grain: 0.2 },
      lutStrength: 0.9,
    });
    expect(merged.lutStrength).toBe(0.9);
    expect(merged.adjustments.grain).toBe(0.2);
    expect(merged.beauty.skinProtection).toBe('medium');
  });

  it('caps beauty intensity', () => {
    expect(validateBeautyIntensity(1)).toBeLessThanOrEqual(0.75);
  });

  it('reduces LUT on skin with higher protection', () => {
    expect(skinProtectionMultiplier('high')).toBeLessThan(skinProtectionMultiplier('low'));
  });
});
