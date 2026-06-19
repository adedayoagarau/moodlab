import {
  AlphaType,
  ColorType,
  FilterMode,
  MipmapMode,
  Skia,
  TileMode,
  processUniforms,
} from '@shopify/react-native-skia';

import { getLutShaderSource, getLutStripTexture } from '@/lib/lut-cache';
import { buildLutShaderUniforms } from '@/lib/shader-uniforms';
import type { FaceGeometry } from '@/lib/face-region';
import type { EditRecipe, ExportPresetId } from '@moodlab/shared';
import { EXPORT_PRESETS } from '@moodlab/shared';

function computeContainRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): { x: number; y: number; width: number; height: number } {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;
  if (srcAspect > dstAspect) {
    const h = dstW / srcAspect;
    return { x: 0, y: (dstH - h) / 2, width: dstW, height: h };
  }
  const w = dstH * srcAspect;
  return { x: (dstW - w) / 2, y: 0, width: w, height: dstH };
}

async function loadImageBytes(uri: string): Promise<Uint8Array> {
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    const { readAsStringAsync, EncodingType } = await import('expo-file-system/legacy');
    const base64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }
  const res = await fetch(uri);
  return new Uint8Array(await res.arrayBuffer());
}

function fitMatrix(
  srcW: number,
  srcH: number,
  dstRect: { x: number; y: number; width: number; height: number },
) {
  const m = Skia.Matrix();
  m.translate(dstRect.x, dstRect.y);
  m.scale(dstRect.width / srcW, dstRect.height / srcH);
  return m;
}

export async function renderRecipeToPngBytes(
  imageUri: string,
  recipe: EditRecipe,
  presetId: ExportPresetId,
  geometry: FaceGeometry,
): Promise<Uint8Array> {
  const preset = EXPORT_PRESETS[presetId];
  const bytes = await loadImageBytes(imageUri);
  const data = Skia.Data.fromBytes(bytes);
  const photo = Skia.Image.MakeImageFromEncoded(data);
  if (!photo) {
    throw new Error('Could not decode source image');
  }

  const outW = preset.width;
  const outH = preset.height;
  const surface = Skia.Surface.Make(outW, outH);
  if (!surface) {
    throw new Error('Could not create export surface');
  }

  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color('#000000'));

  const srcW = photo.width();
  const srcH = photo.height();
  const drawRect = computeContainRect(srcW, srcH, outW, outH);

  const shaderSource = getLutShaderSource();
  const effect = Skia.RuntimeEffect.Make(shaderSource);
  if (!effect) {
    throw new Error('Failed to compile LUT shader');
  }

  if (recipe.lutId) {
    const lutStrip = await getLutStripTexture(recipe.lutId);
    const lutSkImage = Skia.Image.MakeImage(
      {
        width: lutStrip.width,
        height: lutStrip.height,
        alphaType: AlphaType.Opaque,
        colorType: ColorType.RGBA_8888,
      },
      Skia.Data.fromBytes(lutStrip.rgba),
      lutStrip.width * 4,
    );
    if (!lutSkImage) {
      throw new Error('Failed to build LUT texture');
    }

    const uniforms = buildLutShaderUniforms({
      lutStrength: recipe.lutStrength,
      lutSize: lutStrip.size,
      canvasWidth: outW,
      canvasHeight: outH,
      geometry,
      adjustments: recipe.adjustments,
      beauty: recipe.beauty,
      hasSkinMask: Boolean(geometry.skinMaskUri),
    });

    let maskImage = photo;
    if (geometry.skinMaskUri) {
      try {
        const maskBytes = await loadImageBytes(geometry.skinMaskUri);
        const maskData = Skia.Data.fromBytes(maskBytes);
        const decodedMask = Skia.Image.MakeImageFromEncoded(maskData);
        if (decodedMask) {
          maskImage = decodedMask;
        }
      } catch {
        // Use photo as neutral mask fallback
      }
    }

    const imageMatrix = fitMatrix(srcW, srcH, drawRect);
    const imageShader = photo.makeShaderOptions(
      TileMode.Clamp,
      TileMode.Clamp,
      FilterMode.Linear,
      MipmapMode.None,
      imageMatrix,
    );

    const lutMatrix = Skia.Matrix();
    const lutShader = lutSkImage.makeShaderOptions(
      TileMode.Clamp,
      TileMode.Clamp,
      FilterMode.Nearest,
      MipmapMode.None,
      lutMatrix,
    );

    const maskMatrix = fitMatrix(
      maskImage.width(),
      maskImage.height(),
      drawRect,
    );
    const maskShader = maskImage.makeShaderOptions(
      TileMode.Clamp,
      TileMode.Clamp,
      FilterMode.Linear,
      MipmapMode.None,
      maskMatrix,
    );

    const uniformValues = processUniforms(effect, uniforms);
    const paintShader = effect.makeShaderWithChildren(uniformValues, [
      imageShader,
      lutShader,
      maskShader,
    ]);

    const paint = Skia.Paint();
    paint.setShader(paintShader);
    canvas.drawRect(Skia.XYWHRect(0, 0, outW, outH), paint);
  } else {
    const paint = Skia.Paint();
    canvas.drawImageRect(
      photo,
      Skia.XYWHRect(0, 0, srcW, srcH),
      Skia.XYWHRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height),
      paint,
    );
  }

  surface.flush();
  const snapshot = surface.makeImageSnapshot();
  if (!snapshot) {
    throw new Error('Export snapshot failed');
  }

  const png = snapshot.encodeToBytes();
  if (!png) {
    throw new Error('PNG encode failed');
  }
  return png;
}
