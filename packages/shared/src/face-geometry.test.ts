import { describe, expect, it } from 'vitest';
import {
  deriveFaceGeometry,
  deriveFaceGeometryFromLandmarks,
  DEFAULT_FACE_REGION,
} from './face-geometry';

describe('deriveFaceGeometry', () => {
  it('creates eye, under-eye, and lip zones inside face rect', () => {
    const g = deriveFaceGeometry(DEFAULT_FACE_REGION);
    expect(g.eyes.y).toBeGreaterThanOrEqual(g.face.y);
    expect(g.lips.y).toBeGreaterThan(g.eyes.y);
    expect(g.underEye.y).toBeGreaterThanOrEqual(g.eyes.y);
    expect(g.lips.x + g.lips.w).toBeLessThanOrEqual(g.face.x + g.face.w + 0.01);
  });
});

describe('deriveFaceGeometryFromLandmarks', () => {
  it('positions eyes and lips from landmark centers', () => {
    const face = { x: 0.2, y: 0.15, w: 0.6, h: 0.5 };
    const g = deriveFaceGeometryFromLandmarks(face, {
      leftEye: { x: 0.38, y: 0.32 },
      rightEye: { x: 0.62, y: 0.32 },
      mouthLeft: { x: 0.42, y: 0.55 },
      mouthRight: { x: 0.58, y: 0.55 },
      mouthBottom: { x: 0.5, y: 0.58 },
    });
    expect(g.eyes.x).toBeLessThan(g.face.x + g.face.w);
    expect(g.lips.y).toBeGreaterThan(g.eyes.y);
    expect(g.source).toBeUndefined();
  });
});
