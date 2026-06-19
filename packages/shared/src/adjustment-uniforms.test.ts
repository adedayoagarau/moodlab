import { describe, expect, it } from 'vitest';
import { beautyShaderUniforms } from './adjustment-uniforms';

describe('beautyShaderUniforms', () => {
  it('maps full beauty stack to shader floats', () => {
    const u = beautyShaderUniforms(
      { exposure: 0.1, grain: 0.12 },
      {
        faceLight: 0.2,
        skinSmooth: 0.25,
        melaninGuard: true,
        melaninAshFix: 0.3,
        lipColorBoost: 0.15,
        backgroundLutStrength: 1.1,
      },
    );
    expect(u.exposure).toBe(0.1);
    expect(u.skinSmooth).toBe(0.25);
    expect(u.melaninGuard).toBe(1);
    expect(u.melaninAshFix).toBe(0.3);
    expect(u.lipColorBoost).toBe(0.15);
    expect(u.bgLutStrength).toBe(1.1);
  });
});
