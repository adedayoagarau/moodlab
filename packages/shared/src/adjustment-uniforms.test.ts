import { describe, expect, it } from 'vitest';
import { shaderAdjustmentUniforms } from './adjustment-uniforms';

describe('shaderAdjustmentUniforms', () => {
  it('maps adjustments and melanin guard to shader floats', () => {
    const u = shaderAdjustmentUniforms(
      { exposure: 0.2, grain: 0.15, vignette: 0.1 },
      { faceLight: 0.25, melaninGuard: true },
    );
    expect(u.exposure).toBe(0.2);
    expect(u.grain).toBe(0.15);
    expect(u.vignette).toBe(0.1);
    expect(u.faceLight).toBe(0.25);
    expect(u.melaninGuard).toBe(1);
  });

  it('defaults missing values to zero/off', () => {
    const u = shaderAdjustmentUniforms({}, {});
    expect(u.exposure).toBe(0);
    expect(u.melaninGuard).toBe(0);
  });
});
