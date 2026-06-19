export type FaceDetectionSource = 'vision' | 'mlkit' | 'heuristic';

export type FaceRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Normalized landmark point (0–1, top-left origin). */
export type FaceLandmarkPoint = {
  x: number;
  y: number;
};

/** Optional ML Kit / Vision landmarks for accurate zone derivation. */
export type FaceLandmarks = {
  leftEye: FaceLandmarkPoint;
  rightEye: FaceLandmarkPoint;
  mouthLeft?: FaceLandmarkPoint;
  mouthRight?: FaceLandmarkPoint;
  mouthBottom?: FaceLandmarkPoint;
};

/** Portrait sub-zones derived from main face rect for targeted beauty. */
export type FaceGeometry = {
  face: FaceRegion;
  eyes: FaceRegion;
  underEye: FaceRegion;
  lips: FaceRegion;
  /** How face zones were detected. */
  source?: FaceDetectionSource;
  /** URI to a grayscale skin/person mask PNG when native segmentation ran. */
  skinMaskUri?: string;
};

export const DEFAULT_FACE_REGION: FaceRegion = {
  x: 0.16,
  y: 0.1,
  w: 0.68,
  h: 0.45,
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

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

/** Derive eye/lip/under-eye zones from ML Kit or Vision landmarks. */
export function deriveFaceGeometryFromLandmarks(
  face: FaceRegion,
  landmarks: FaceLandmarks,
): FaceGeometry {
  const { leftEye, rightEye } = landmarks;
  const eyeDist = Math.abs(rightEye.x - leftEye.x);
  const eyeCx = (leftEye.x + rightEye.x) / 2;
  const eyeCy = (leftEye.y + rightEye.y) / 2;

  const eyes: FaceRegion = {
    x: clamp01(eyeCx - eyeDist * 0.65),
    y: clamp01(eyeCy - eyeDist * 0.35),
    w: clamp01(Math.min(1 - (eyeCx - eyeDist * 0.65), eyeDist * 1.3)),
    h: clamp01(Math.min(1 - (eyeCy - eyeDist * 0.35), eyeDist * 0.55)),
  };

  const underEye: FaceRegion = {
    x: clamp01(eyes.x * 0.95 + face.x * 0.05),
    y: clamp01(eyeCy + eyeDist * 0.05),
    w: clamp01(eyes.w * 1.05),
    h: clamp01(Math.min(1 - (eyeCy + eyeDist * 0.05), eyeDist * 0.35)),
  };

  let lips: FaceRegion;
  if (landmarks.mouthLeft && landmarks.mouthRight && landmarks.mouthBottom) {
    const { mouthLeft, mouthRight, mouthBottom } = landmarks;
    const minX = Math.min(mouthLeft.x, mouthRight.x, mouthBottom.x);
    const maxX = Math.max(mouthLeft.x, mouthRight.x, mouthBottom.x);
    const minY = Math.min(mouthLeft.y, mouthRight.y, mouthBottom.y);
    const maxY = Math.max(mouthLeft.y, mouthRight.y, mouthBottom.y);
    const padX = (maxX - minX) * 0.15;
    const padY = (maxY - minY) * 0.2;
    lips = {
      x: clamp01(minX - padX),
      y: clamp01(minY - padY),
      w: clamp01(Math.min(1 - (minX - padX), maxX - minX + 2 * padX)),
      h: clamp01(Math.min(1 - (minY - padY), maxY - minY + 2 * padY)),
    };
  } else {
    lips = deriveFaceGeometry(face).lips;
  }

  return { face, eyes, underEye, lips };
}

export const DEFAULT_FACE_GEOMETRY: FaceGeometry = {
  ...deriveFaceGeometry(DEFAULT_FACE_REGION),
  source: 'heuristic',
};

export function mergeFaceGeometry(
  base: FaceGeometry,
  patch: Partial<FaceGeometry>,
): FaceGeometry {
  return {
    face: patch.face ?? base.face,
    eyes: patch.eyes ?? base.eyes,
    underEye: patch.underEye ?? base.underEye,
    lips: patch.lips ?? base.lips,
    source: patch.source ?? base.source,
    skinMaskUri: patch.skinMaskUri ?? base.skinMaskUri,
  };
}
