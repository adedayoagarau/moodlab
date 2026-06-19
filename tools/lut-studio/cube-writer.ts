import { DEFAULT_CUBE_SIZE } from './types.js';

export function writeCubeFile(
  title: string,
  size: number,
  data: Float32Array,
  domainMin: [number, number, number] = [0, 0, 0],
  domainMax: [number, number, number] = [1, 1, 1],
): string {
  const lines: string[] = [
    `TITLE "${title}"`,
    `LUT_3D_SIZE ${size}`,
    `DOMAIN_MIN ${domainMin.map((v) => v.toFixed(1)).join(' ')}`,
    `DOMAIN_MAX ${domainMax.map((v) => v.toFixed(1)).join(' ')}`,
  ];

  const expected = size * size * size * 3;
  if (data.length !== expected) {
    throw new Error(`Cube data length ${data.length} !== expected ${expected}`);
  }

  // Blue → Green → Red iteration order
  for (let bi = 0; bi < size; bi++) {
    for (let gi = 0; gi < size; gi++) {
      for (let ri = 0; ri < size; ri++) {
        const idx = (bi * size * size + gi * size + ri) * 3;
        lines.push(
          `${data[idx]!.toFixed(6)} ${data[idx + 1]!.toFixed(6)} ${data[idx + 2]!.toFixed(6)}`,
        );
      }
    }
  }

  return lines.join('\n') + '\n';
}

export function buildCubeData(
  size: number,
  gradeFn: (r: number, g: number, b: number) => [number, number, number],
): Float32Array {
  const data = new Float32Array(size * size * size * 3);
  let offset = 0;

  for (let bi = 0; bi < size; bi++) {
    for (let gi = 0; gi < size; gi++) {
      for (let ri = 0; ri < size; ri++) {
        const r = ri / (size - 1);
        const g = gi / (size - 1);
        const b = bi / (size - 1);
        const [or, og, ob] = gradeFn(r, g, b);
        data[offset++] = or;
        data[offset++] = og;
        data[offset++] = ob;
      }
    }
  }

  return data;
}

export { DEFAULT_CUBE_SIZE };
