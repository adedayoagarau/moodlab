/**
 * Minimal .cube 3D LUT parser for MoodLab.
 * Supports LUT_3D_SIZE, DOMAIN_MIN, DOMAIN_MAX, and RGB triplets.
 */

export type ParsedCubeLut = {
  title?: string;
  size: number;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
  data: Float32Array;
};

export function parseCubeFile(content: string): ParsedCubeLut {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  let title: string | undefined;
  let size = 0;
  const domainMin: [number, number, number] = [0, 0, 0];
  const domainMax: [number, number, number] = [1, 1, 1];
  const values: number[] = [];

  for (const line of lines) {
    if (line.startsWith('TITLE')) {
      title = line.replace(/^TITLE\s+/i, '').replace(/^"|"$/g, '');
      continue;
    }
    if (line.startsWith('LUT_3D_SIZE')) {
      size = Number(line.split(/\s+/)[1]);
      continue;
    }
    if (line.startsWith('DOMAIN_MIN')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      domainMin[0] = parts[0] ?? 0;
      domainMin[1] = parts[1] ?? 0;
      domainMin[2] = parts[2] ?? 0;
      continue;
    }
    if (line.startsWith('DOMAIN_MAX')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      domainMax[0] = parts[0] ?? 1;
      domainMax[1] = parts[1] ?? 1;
      domainMax[2] = parts[2] ?? 1;
      continue;
    }

    const parts = line.split(/\s+/).map(Number);
    if (parts.length >= 3 && parts.every((n) => !Number.isNaN(n))) {
      values.push(parts[0], parts[1], parts[2]);
    }
  }

  if (!size) {
    throw new Error('LUT_3D_SIZE is required in .cube file');
  }

  const expected = size * size * size * 3;
  if (values.length !== expected) {
    throw new Error(`Expected ${expected} RGB values, got ${values.length}`);
  }

  return {
    title,
    size,
    domainMin,
    domainMax,
    data: Float32Array.from(values),
  };
}
