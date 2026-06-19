import { Image, Platform } from 'react-native';

import {
  DEFAULT_FACE_GEOMETRY,
  DEFAULT_FACE_REGION,
  deriveFaceGeometry,
  deriveFaceGeometryFromLandmarks,
  mergeFaceGeometry,
  type FaceDetectionSource,
  type FaceGeometry,
  type FaceLandmarks,
  type FaceRegion,
} from '@moodlab/shared';

export {
  DEFAULT_FACE_GEOMETRY,
  DEFAULT_FACE_REGION,
  deriveFaceGeometry,
  type FaceDetectionSource,
  type FaceGeometry,
  type FaceRegion,
};

export type FaceDetectionResult = FaceGeometry & {
  source: FaceDetectionSource;
};

function measureImage(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      reject,
    );
  });
}

function normalizeBounds(
  frame: { left: number; top: number; width: number; height: number },
  imageWidth: number,
  imageHeight: number,
): FaceRegion {
  const padX = frame.width * 0.08;
  const padY = frame.height * 0.1;
  const x = Math.max(0, (frame.left - padX) / imageWidth);
  const y = Math.max(0, (frame.top - padY) / imageHeight);
  const w = Math.min(1 - x, (frame.width + 2 * padX) / imageWidth);
  const h = Math.min(1 - y, (frame.height + 2 * padY) / imageHeight);
  return { x, y, w, h };
}

function mlKitLandmarks(
  face: {
    leftEyePosition?: { x: number; y: number };
    rightEyePosition?: { x: number; y: number };
    mouthLeftPosition?: { x: number; y: number };
    mouthRightPosition?: { x: number; y: number };
    bottomMouthPosition?: { x: number; y: number };
  },
  imageWidth: number,
  imageHeight: number,
): FaceLandmarks | undefined {
  if (!face.leftEyePosition || !face.rightEyePosition) return undefined;
  const norm = (p: { x: number; y: number }) => ({
    x: p.x / imageWidth,
    y: p.y / imageHeight,
  });
  return {
    leftEye: norm(face.leftEyePosition),
    rightEye: norm(face.rightEyePosition),
    mouthLeft: face.mouthLeftPosition ? norm(face.mouthLeftPosition) : undefined,
    mouthRight: face.mouthRightPosition ? norm(face.mouthRightPosition) : undefined,
    mouthBottom: face.bottomMouthPosition ? norm(face.bottomMouthPosition) : undefined,
  };
}

async function detectWithNativeModule(uri: string): Promise<FaceDetectionResult | null> {
  if (Platform.OS === 'web') return null;
  try {
    const native = await import('moodlab-render-core');
    if (!native.isNativeRenderCoreAvailable()) return null;

    const [geometryResult, skinMask] = await Promise.all([
      native.detectFaceGeometryNative(uri),
      native.generateSkinMaskNative(uri).catch(() => null),
    ]);

    if (!geometryResult?.geometry) return null;

    const g = geometryResult.geometry;
    const base: FaceGeometry = {
      face: g.face,
      eyes: g.eyes,
      underEye: g.underEye,
      lips: g.lips,
      source: geometryResult.source,
      skinMaskUri: skinMask?.uri,
    };

    if (base.face.w < 0.05 || base.face.h < 0.05) return null;
    return { ...base, source: geometryResult.source };
  } catch {
    return null;
  }
}

async function detectWithMlKit(uri: string): Promise<FaceDetectionResult | null> {
  if (Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FaceDetection = require('@react-native-ml-kit/face-detection').default;
    const { width, height } = await measureImage(uri);
    const faces = await FaceDetection.detect(uri, {
      performanceMode: 'accurate',
      landmarkMode: 'all',
      contourMode: 'none',
    });
    if (!faces.length || !faces[0].frame) return null;

    const face = faces[0];
    const bounds = normalizeBounds(face.frame, width, height);
    const landmarks = mlKitLandmarks(face, width, height);
    const geometry = landmarks
      ? deriveFaceGeometryFromLandmarks(bounds, landmarks)
      : deriveFaceGeometry(bounds);

    return mergeFaceGeometry(geometry, { source: 'mlkit' }) as FaceDetectionResult;
  } catch {
    return null;
  }
}

async function detectWithHeuristic(uri: string): Promise<FaceDetectionResult> {
  const { Image: RNImage } = await import('react-native');
  return new Promise((resolve) => {
    RNImage.getSize(
      uri,
      (width, height) => {
        const portrait = height >= width * 1.05;
        const squareish = Math.abs(width - height) / Math.max(width, height) < 0.08;
        const face = portrait || squareish
          ? { x: 0.16, y: 0.1, w: 0.68, h: 0.45 }
          : { x: 0.22, y: 0.18, w: 0.56, h: 0.64 };
        resolve({
          ...deriveFaceGeometry(face),
          source: 'heuristic',
        });
      },
      () =>
        resolve({
          ...DEFAULT_FACE_GEOMETRY,
          source: 'heuristic',
        }),
    );
  });
}

/**
 * Detect face zones: native RenderCore (Vision / ML Kit) → JS ML Kit → heuristic.
 */
export async function detectFaceGeometry(imageUri: string): Promise<FaceDetectionResult> {
  const native = await detectWithNativeModule(imageUri);
  if (native) return native;

  const mlkit = await detectWithMlKit(imageUri);
  if (mlkit) return mlkit;

  return detectWithHeuristic(imageUri);
}

/** @deprecated Use detectFaceGeometry */
export async function detectFaceRegion(imageUri: string): Promise<FaceRegion> {
  const result = await detectFaceGeometry(imageUri);
  return result.face;
}

export function skinProtectionToNative(beauty: {
  skinProtection?: 'off' | 'low' | 'medium' | 'high';
}): number {
  switch (beauty.skinProtection ?? 'medium') {
    case 'off':
      return 0;
    case 'low':
      return 0.25;
    case 'medium':
      return 0.5;
    case 'high':
      return 0.75;
    default:
      return 0.5;
  }
}

export async function isRenderCoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const native = await import('moodlab-render-core');
    return native.isNativeRenderCoreAvailable();
  } catch {
    return false;
  }
}
