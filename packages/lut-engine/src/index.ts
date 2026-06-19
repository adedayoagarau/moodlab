export { parseCubeFile, type ParsedCubeLut } from './cube-parser';

/** Blend factor for LUT strength (0 = original, 1 = full LUT). */
export function blendLutStrength(strength: number): number {
  return Math.min(1, Math.max(0, strength));
}

/**
 * Effective LUT strength on skin regions when skin protection is enabled.
 * Native RenderCore will apply this; JS layer uses it for preview metadata.
 */
export function effectiveSkinLutStrength(
  lutStrength: number,
  skinProtection: 'off' | 'low' | 'medium' | 'high',
  faceLutStrength = 0.55,
): number {
  const base = blendLutStrength(lutStrength) * faceLutStrength;
  switch (skinProtection) {
    case 'off':
      return blendLutStrength(lutStrength);
    case 'low':
      return base * 0.85;
    case 'medium':
      return base * 0.7;
    case 'high':
      return base * 0.5;
    default:
      return base;
  }
}
