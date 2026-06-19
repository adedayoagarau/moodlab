import { describe, expect, it } from 'vitest';
import { applyBeautyPreset, getBeautyPreset } from './beauty-presets';

describe('beauty presets', () => {
  it('returns melanin-gold preset with guard flags', () => {
    const preset = getBeautyPreset('melanin-gold');
    expect(preset?.plan).toBe('pro');
    expect(preset?.settings.melaninGuard).toBe(true);
    expect(preset?.settings.melaninAshFix).toBeGreaterThan(0);
  });

  it('applyBeautyPreset merges settings and sets preset id', () => {
    const result = applyBeautyPreset({ skinSmooth: 0.5 }, 'clean-skin');
    expect(result.preset).toBe('clean-skin');
    expect(result.skinSmooth).toBe(0.18);
    expect(result.melaninGuard).toBe(true);
  });
});
