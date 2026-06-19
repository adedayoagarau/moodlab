import { requireNativeModule, Platform } from 'expo-modules-core';

/** Serializable face zone rects (normalized 0–1, top-left origin). */
export type NativeFaceRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type NativeFaceGeometry = {
  face: NativeFaceRegion;
  eyes: NativeFaceRegion;
  underEye: NativeFaceRegion;
  lips: NativeFaceRegion;
};

export type FaceDetectionSource = 'vision' | 'mlkit' | 'heuristic';

export type DetectFaceGeometryResult = {
  geometry: NativeFaceGeometry;
  source: FaceDetectionSource;
  confidence: number;
};

export type SkinMaskResult = {
  uri: string;
  width: number;
  height: number;
};

export type NativeBeautyExportInput = {
  sourceUri: string;
  cubePath?: string;
  lutStrength: number;
  skinSmooth?: number;
  textureRestore?: number;
  evenTone?: number;
  reduceShine?: number;
  faceLight?: number;
  skinProtection?: number;
  outputWidth?: number;
  outputHeight?: number;
};

type NativeModule = {
  isAvailable: () => boolean;
  detectFaceGeometry: (uri: string) => Promise<DetectFaceGeometryResult | null>;
  generateSkinMask: (uri: string) => Promise<SkinMaskResult | null>;
  exportWithBeautyPipeline: (options: NativeBeautyExportInput) => Promise<string>;
  exportWithColorCube: (
    sourceUri: string,
    cubePath: string,
    strength: number,
  ) => Promise<string>;
};

let nativeModule: NativeModule | null | undefined;

function getNativeModule(): NativeModule | null {
  if (nativeModule !== undefined) {
    return nativeModule;
  }
  if (Platform.OS === 'web') {
    nativeModule = null;
    return null;
  }
  try {
    nativeModule = requireNativeModule<NativeModule>('MoodlabRenderCore');
  } catch {
    nativeModule = null;
  }
  return nativeModule;
}

export function isNativeRenderCoreAvailable(): boolean {
  try {
    return getNativeModule()?.isAvailable() ?? false;
  } catch {
    return false;
  }
}

export async function detectFaceGeometryNative(
  uri: string,
): Promise<DetectFaceGeometryResult | null> {
  const native = getNativeModule();
  if (!native) return null;
  try {
    return await native.detectFaceGeometry(uri);
  } catch {
    return null;
  }
}

export async function generateSkinMaskNative(uri: string): Promise<SkinMaskResult | null> {
  const native = getNativeModule();
  if (!native) return null;
  try {
    return await native.generateSkinMask(uri);
  } catch {
    return null;
  }
}

export async function exportWithBeautyPipelineNative(
  options: NativeBeautyExportInput,
): Promise<string | null> {
  const native = getNativeModule();
  if (!native) return null;
  try {
    return await native.exportWithBeautyPipeline(options);
  } catch {
    return null;
  }
}

export async function exportWithColorCubeNative(
  sourceUri: string,
  cubePath: string,
  strength: number,
): Promise<string | null> {
  const native = getNativeModule();
  if (!native) return null;
  try {
    return await native.exportWithColorCube(sourceUri, cubePath, strength);
  } catch {
    return null;
  }
}
