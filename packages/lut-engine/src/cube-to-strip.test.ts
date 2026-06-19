import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCubeFile } from './cube-parser';
import { cubeToStripTexture } from './cube-to-strip';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('cubeToStripTexture', () => {
  it('packs sunny-cover-glow cube into strip RGBA', () => {
    const cubePath = join(root, 'luts', 'original', 'sunny-cover-glow.cube');
    const content = readFileSync(cubePath, 'utf-8');
    const parsed = parseCubeFile(content);
    const strip = cubeToStripTexture(parsed);

    expect(strip.size).toBe(33);
    expect(strip.width).toBe(33 * 33);
    expect(strip.height).toBe(33);
    expect(strip.rgba.length).toBe(strip.width * strip.height * 4);
    expect(strip.rgba[3]).toBe(255);
  });
});
