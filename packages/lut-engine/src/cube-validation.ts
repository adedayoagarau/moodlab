import type { ParsedCubeLut } from './cube-parser';

export type CubeValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validates .cube structure aligned with common LUT_3D_SIZE / DOMAIN rules
 * (see FFmpeg lut3d and interchange conventions).
 */
export function validateCubeLut(lut: ParsedCubeLut): CubeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { size, domainMin, domainMax, data } = lut;

  if (!Number.isInteger(size) || size < 2) {
    errors.push('LUT_3D_SIZE must be an integer >= 2');
  }

  const commonSizes = [16, 17, 32, 33, 64, 65];
  if (!commonSizes.includes(size)) {
    warnings.push(`LUT_3D_SIZE ${size} is uncommon; 33 or 64 are typical for display LUTs`);
  }

  for (let i = 0; i < 3; i++) {
    if (domainMin[i] > domainMax[i]) {
      errors.push(`DOMAIN_MIN[${i}] exceeds DOMAIN_MAX[${i}]`);
    }
  }

  const expected = size * size * size * 3;
  if (data.length !== expected) {
    errors.push(`Expected ${expected} RGB values, got ${data.length}`);
  }

  let outOfDomain = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v < domainMin[i % 3] - 0.01 || v > domainMax[i % 3] + 0.01) {
      outOfDomain++;
    }
    if (v < 0 || v > 1) {
      warnings.push('Some RGB values fall outside [0,1]; GPU paths may clamp');
      break;
    }
  }
  if (outOfDomain > size) {
    warnings.push(`${outOfDomain} samples appear outside declared DOMAIN range`);
  }

  return { valid: errors.length === 0, errors, warnings };
}
