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

import { getLutShaderSource, getLutStripTexture } from '@/lib/lut-cache';

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
  const [lutStrip, setLutStrip] = useState<{
    size: number;
    width: number;
    height: number;
    rgba: Uint8Array;
  } | null>(null);
  const [lutError, setLutError] = useState(false);

  useEffect(() => {
    if (!lutId || showOriginal) {
      setLutStrip(null);
      setLutError(false);
      return;
    }
    let cancelled = false;
    getLutStripTexture(lutId)
      .then((strip) => {
        if (!cancelled) {
          setLutStrip(strip);
          setLutError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLutStrip(null);
          setLutError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lutId, showOriginal]);

  const lutSkImage = useMemo(() => {
    if (!lutStrip) return null;
    return Skia.Image.MakeImage(
      {
        width: lutStrip.width,
        height: lutStrip.height,
        alphaType: AlphaType.Opaque,
        colorType: ColorType.RGBA_8888,
      },
      Skia.Data.fromBytes(lutStrip.rgba),
      lutStrip.width * 4,
    );
  }, [lutStrip]);

  const shaderEffect = useMemo(() => Skia.RuntimeEffect.Make(getLutShaderSource()), []);

  const skinStrength = lutStrength * faceLutStrength * skinProtectionMultiplier(skinProtection);

  // Normalized face band — approximate portrait region for skin-safe LUT.
  const faceX = 0.2;
  const faceY = 0.22;
  const faceW = 0.6;
  const faceH = 0.38;

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
    lutStrip &&
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
                lutSize: lutStrip.size,
                imageWidth: layout.width,
                imageHeight: layout.height,
                faceX,
                faceY,
                faceW,
                faceH,
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
                  width: lutStrip.width,
                  height: lutStrip.height,
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
