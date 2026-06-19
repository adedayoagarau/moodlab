import { describe, expect, it } from 'vitest';
import { parseCubeFile } from './cube-parser';

const miniCube = `
LUT_3D_SIZE 2
DOMAIN_MIN 0.0 0.0 0.0
DOMAIN_MAX 1.0 1.0 1.0
0.0 0.0 0.0
1.0 0.0 0.0
0.0 1.0 0.0
1.0 1.0 0.0
0.0 0.0 1.0
1.0 0.0 1.0
0.0 1.0 1.0
1.0 1.0 1.0
`;

describe('parseCubeFile', () => {
  it('parses a 2x2x2 cube LUT', () => {
    const lut = parseCubeFile(miniCube);
    expect(lut.size).toBe(2);
    expect(lut.data.length).toBe(2 * 2 * 2 * 3);
    expect(lut.domainMax).toEqual([1, 1, 1]);
  });
});
