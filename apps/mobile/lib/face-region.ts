import {
  DEFAULT_FACE_GEOMETRY,
  DEFAULT_FACE_REGION,
  deriveFaceGeometry,
  type FaceGeometry,
  type FaceRegion,
} from '@moodlab/shared';

export {
  DEFAULT_FACE_GEOMETRY,
  DEFAULT_FACE_REGION,
  deriveFaceGeometry,
  type FaceGeometry,
  type FaceRegion,
};

/**
 * Estimate face region from image orientation.
 * V1.5 heuristic — replace with ML Kit / Vision in dev build (see RENDER_CORE.md).
 */
export async function detectFaceRegion(imageUri: string): Promise<FaceRegion> {
  const { Image } = await import('react-native');

  return new Promise((resolve) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        const portrait = height >= width * 1.05;
        const squareish = Math.abs(width - height) / Math.max(width, height) < 0.08;

        if (portrait || squareish) {
          resolve({
            x: 0.16,
            y: 0.1,
            w: 0.68,
            h: 0.45,
          });
          return;
        }

        resolve({
          x: 0.22,
          y: 0.18,
          w: 0.56,
          h: 0.64,
        });
      },
      () => resolve(DEFAULT_FACE_REGION),
    );
  });
}

export async function detectFaceGeometry(imageUri: string): Promise<FaceGeometry> {
  const face = await detectFaceRegion(imageUri);
  return deriveFaceGeometry(face);
}
