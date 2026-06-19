import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCubeFile } from './cube-parser';
import { cubeToHaldTexture, HALD_TEXTURE_SIZE } from './cube-to-hald';
import { validateCubeLut } from './cube-validation';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('validateCubeLut', () => {
  it('accepts catalog sunny-cover-glow cube', () => {
    const content = readFileSync(
      join(root, 'luts', 'original', 'sunny-cover-glow.cube'),
      'utf-8',
    );
    const parsed = parseCubeFile(content);
    const result = validateCubeLut(parsed);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('cubeToHaldTexture', () => {
  it('builds 512x512 Hald texture', () => {
    const content = readFileSync(
      join(root, 'luts', 'original', 'melanin-gold.cube'),
      'utf-8',
    );
    const hald = cubeToHaldTexture(parseCubeFile(content));
    expect(hald.width).toBe(HALD_TEXTURE_SIZE);
    expect(hald.height).toBe(HALD_TEXTURE_SIZE);
    expect(hald.rgba.length).toBe(HALD_TEXTURE_SIZE * HALD_TEXTURE_SIZE * 4);
  });
});
