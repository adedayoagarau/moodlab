export type FaceRegion = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Fallback portrait band when detection unavailable. */
export const DEFAULT_FACE_REGION: FaceRegion = {
  x: 0.2,
  y: 0.22,
  w: 0.6,
  h: 0.38,
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
          // Upper-center face band for portraits and cover-art squares
          resolve({
            x: 0.16,
            y: 0.1,
            w: 0.68,
            h: 0.45,
          });
          return;
        }

        // Landscape — subject often center-left or center
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
