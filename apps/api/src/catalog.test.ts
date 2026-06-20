import { describe, expect, it } from 'vitest';
import { getLuts, getPacks, readLutCubeContent } from './catalog.js';

describe('catalog', () => {
  it('loads LUT packs from data/lut_catalog.json', () => {
    const packs = getPacks();
    expect(packs.length).toBeGreaterThan(0);
    const luts = getLuts();
    expect(luts.length).toBeGreaterThanOrEqual(51);
    expect(luts.some((l) => l.id === 'golden-studio')).toBe(true);
  });

  it('reads cube file for a catalog LUT', () => {
    const lut = getLuts()[0];
    const cube = readLutCubeContent(lut.id);
    expect(cube).toContain('LUT_3D_SIZE');
  });
});
