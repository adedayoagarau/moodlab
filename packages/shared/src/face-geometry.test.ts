import { describe, expect, it } from 'vitest';
import { deriveFaceGeometry, DEFAULT_FACE_REGION } from './face-geometry';

describe('deriveFaceGeometry', () => {
  it('creates eye, under-eye, and lip zones inside face rect', () => {
    const g = deriveFaceGeometry(DEFAULT_FACE_REGION);
    expect(g.eyes.y).toBeGreaterThanOrEqual(g.face.y);
    expect(g.lips.y).toBeGreaterThan(g.eyes.y);
    expect(g.underEye.y).toBeGreaterThanOrEqual(g.eyes.y);
    expect(g.lips.x + g.lips.w).toBeLessThanOrEqual(g.face.x + g.face.w + 0.01);
  });
});
