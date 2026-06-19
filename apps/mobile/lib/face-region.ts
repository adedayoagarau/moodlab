import { Image, Platform } from 'react-native';

export type FaceRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  source: 'vision' | 'mlkit' | 'heuristic';
};

export const DEFAULT_FACE_REGION: FaceRegion = {
  x: 0.2,
  y: 0.22,
  width: 0.6,
  height: 0.38,
  source: 'heuristic',
};

function normalizeMlKitBounds(
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
  return { x, y, width: w, height: h, source: 'mlkit' };
}

export async function detectFaceRegion(imageUri: string): Promise<FaceRegion> {
  if (Platform.OS === 'web') {
    return DEFAULT_FACE_REGION;
  }

  // Apple Vision (iOS native module — CIColorCube + segmentation)
  try {
    const native = await import('moodlab-render-core');
    const person = await native.detectPersonRegionNative(imageUri);
    if (person && person.width > 0.1 && person.height > 0.1) {
      return person;
    }
    const face = await native.detectFaceRegionNative(imageUri);
    if (face && face.width > 0.05) {
      return face;
    }
  } catch {
    // Native module requires iOS dev build (expo prebuild / EAS)
  }

  // Google ML Kit Face Detection
  try {
    const FaceDetection = require('@react-native-ml-kit/face-detection').default;
    const { width, height } = await measureImage(imageUri);
    const faces = await FaceDetection.detect(imageUri, {
      performanceMode: 'fast',
      landmarkMode: 'none',
      contourMode: 'none',
    });
    if (faces.length > 0 && faces[0].frame) {
      return normalizeMlKitBounds(faces[0].frame, width, height);
    }
  } catch {
    // ML Kit requires dev client on device
  }

  return DEFAULT_FACE_REGION;
}

function measureImage(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      reject,
    );
  });
}

export async function exportWithNativeColorCube(
  sourceUri: string,
  cubePath: string,
  strength: number,
): Promise<string | null> {
  if (Platform.OS !== 'ios') return null;
  try {
    const native = await import('moodlab-render-core');
    return await native.exportWithColorCubeNative(sourceUri, cubePath, strength);
  } catch {
    return null;
  }
}
