import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type ViewStyle } from 'react-native';
import {
  AlphaType,
  Canvas,
  ColorType,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import { skinProtectionMultiplier } from '@moodlab/shared';

import { detectFaceRegion, type FaceRegion, DEFAULT_FACE_REGION } from '@/lib/face-region';
import { getLutGpuTexture, getLutShaderSource, LUT_TEX_SIZE } from '@/lib/lut-cache';

type Props = {
  imageUri: string;
  lutId?: string;
  lutStrength: number;
  skinProtection?: 'off' | 'low' | 'medium' | 'high';
  faceLutStrength?: number;
  showOriginal?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
};

export function LutSkiaViewport({
  imageUri,
  lutId,
  lutStrength,
  skinProtection = 'medium',
  faceLutStrength = 0.55,
  showOriginal = false,
  style,
  children,
}: Props) {
  const photo = useImage(imageUri);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [lutTex, setLutTex] = useState<Awaited<ReturnType<typeof getLutGpuTexture>> | null>(null);
  const [lutError, setLutError] = useState(false);
  const [faceRegion, setFaceRegion] = useState<FaceRegion>(DEFAULT_FACE_REGION);

  useEffect(() => {
    if (!imageUri || showOriginal) return;
    let cancelled = false;
    detectFaceRegion(imageUri).then((region) => {
      if (!cancelled) setFaceRegion(region);
    });
    return () => {
      cancelled = true;
    };
  }, [imageUri, showOriginal]);

  useEffect(() => {
    if (!lutId || showOriginal) {
      setLutTex(null);
      setLutError(false);
      return;
    }
    let cancelled = false;
    getLutGpuTexture(lutId)
      .then((tex) => {
        if (!cancelled) {
          setLutTex(tex);
          setLutError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLutTex(null);
          setLutError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lutId, showOriginal]);

  const lutSkImage = useMemo(() => {
    if (!lutTex) return null;
    return Skia.Image.MakeImage(
      {
        width: lutTex.width,
        height: lutTex.height,
        alphaType: AlphaType.Opaque,
        colorType: ColorType.RGBA_8888,
      },
      Skia.Data.fromBytes(lutTex.rgba),
      lutTex.width * 4,
    );
  }, [lutTex]);

  const shaderEffect = useMemo(() => Skia.RuntimeEffect.Make(getLutShaderSource()), []);

  const skinStrength = lutStrength * faceLutStrength * skinProtectionMultiplier(skinProtection);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayout({ width, height });
    }
  }

  const canRenderLut =
    !showOriginal &&
    photo &&
    lutSkImage &&
    shaderEffect &&
    layout.width > 0 &&
    layout.height > 0 &&
    lutTex &&
    !lutError;

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {canRenderLut ? (
        <Canvas style={{ width: layout.width, height: layout.height }}>
          <Fill>
            <Shader
              source={shaderEffect}
              uniforms={{
                strength: lutStrength,
                skinStrength,
                lutSize: lutTex.size,
                gridDim: lutTex.gridDim,
                imageWidth: layout.width,
                imageHeight: layout.height,
                lutWidth: LUT_TEX_SIZE,
                lutHeight: LUT_TEX_SIZE,
                faceX: faceRegion.x,
                faceY: faceRegion.y,
                faceW: faceRegion.width,
                faceH: faceRegion.height,
              }}>
              <ImageShader
                image={photo}
                fit="contain"
                rect={{ x: 0, y: 0, width: layout.width, height: layout.height }}
              />
              <ImageShader
                image={lutSkImage}
                fit="none"
                rect={{
                  x: 0,
                  y: 0,
                  width: lutTex.width,
                  height: lutTex.height,
                }}
              />
            </Shader>
          </Fill>
        </Canvas>
      ) : photo && layout.width > 0 ? (
        <Canvas style={{ width: layout.width, height: layout.height }}>
          <Fill>
            <ImageShader
              image={photo}
              fit="contain"
              rect={{ x: 0, y: 0, width: layout.width, height: layout.height }}
            />
          </Fill>
        </Canvas>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
