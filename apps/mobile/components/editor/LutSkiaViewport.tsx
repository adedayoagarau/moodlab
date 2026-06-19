import { useEffect, useMemo, useState, type ReactNode, type RefObject } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type ViewStyle } from 'react-native';
import {
  AlphaType,
  Canvas,
  ColorType,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useCanvasRef,
  useImage,
  type CanvasRef,
} from '@shopify/react-native-skia';
import {
  shaderAdjustmentUniforms,
  skinProtectionMultiplier,
  type AdjustmentStack,
  type BeautySettings,
} from '@moodlab/shared';

import { getLutShaderSource, getLutStripTexture } from '@/lib/lut-cache';

type Props = {
  imageUri: string;
  lutId?: string;
  lutStrength: number;
  adjustments?: AdjustmentStack;
  beauty?: BeautySettings;
  skinProtection?: 'off' | 'low' | 'medium' | 'high';
  faceLutStrength?: number;
  showOriginal?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
  canvasRef?: RefObject<CanvasRef | null>;
};

export function LutSkiaViewport({
  imageUri,
  lutId,
  lutStrength,
  adjustments = {},
  beauty = {},
  skinProtection = 'medium',
  faceLutStrength = 0.55,
  showOriginal = false,
  style,
  children,
  canvasRef,
}: Props) {
  const internalCanvasRef = useCanvasRef();
  const activeCanvasRef = canvasRef ?? internalCanvasRef;
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
  const postFx = useMemo(
    () => shaderAdjustmentUniforms(adjustments, beauty),
    [adjustments, beauty],
  );

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

  const shaderUniforms = {
    strength: lutStrength,
    skinStrength,
    lutSize: lutStrip?.size ?? 33,
    imageWidth: layout.width,
    imageHeight: layout.height,
    faceX,
    faceY,
    faceW,
    faceH,
    ...postFx,
  };

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {canRenderLut ? (
        <Canvas ref={activeCanvasRef} style={{ width: layout.width, height: layout.height }}>
          <Fill>
            <Shader source={shaderEffect} uniforms={shaderUniforms}>
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
        <Canvas ref={activeCanvasRef} style={{ width: layout.width, height: layout.height }}>
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
