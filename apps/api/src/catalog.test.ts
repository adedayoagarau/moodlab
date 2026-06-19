import { describe, expect, it } from 'vitest';
import { getLuts, getPacks } from './catalog.js';

describe('catalog', () => {
  it('loads LUT packs from data/lut_catalog.json', () => {
    const packs = getPacks();
    expect(packs.length).toBeGreaterThan(0);
    const luts = getLuts();
    expect(luts.length).toBe(20);
  });
});
