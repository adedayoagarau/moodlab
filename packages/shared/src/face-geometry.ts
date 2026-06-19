export type FaceRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Portrait sub-zones derived from main face rect for targeted beauty. */
export type FaceGeometry = {
  face: FaceRegion;
  eyes: FaceRegion;
  underEye: FaceRegion;
  lips: FaceRegion;
};

export const DEFAULT_FACE_REGION: FaceRegion = {
  x: 0.16,
  y: 0.1,
  w: 0.68,
  h: 0.45,
};

export function deriveFaceGeometry(face: FaceRegion): FaceGeometry {
  return {
    face,
    eyes: {
      x: face.x + face.w * 0.12,
      y: face.y + face.h * 0.06,
      w: face.w * 0.76,
      h: face.h * 0.28,
    },
    underEye: {
      x: face.x + face.w * 0.1,
      y: face.y + face.h * 0.3,
      w: face.w * 0.8,
      h: face.h * 0.2,
    },
    lips: {
      x: face.x + face.w * 0.26,
      y: face.y + face.h * 0.62,
      w: face.w * 0.48,
      h: face.h * 0.24,
    },
  };
}

export const DEFAULT_FACE_GEOMETRY = deriveFaceGeometry(DEFAULT_FACE_REGION);
