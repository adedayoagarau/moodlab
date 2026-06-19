import { Platform } from 'react-native';

import { isSupabaseConfigured } from '@/lib/supabase';
import { isRevenueCatConfigured } from '@/lib/purchases';

export type IntegrationStatus = {
  skia: boolean;
  mlKit: boolean;
  visionNative: boolean;
  supabase: boolean;
  revenueCat: boolean;
  references: string[];
};

export async function loadIntegrationStatus(): Promise<IntegrationStatus> {
  let visionNative = false;
  if (Platform.OS === 'ios') {
    try {
      const native = await import('moodlab-render-core');
      visionNative = native.isNativeRenderCoreAvailable();
    } catch {
      visionNative = false;
    }
  }

  let mlKit = false;
  if (Platform.OS !== 'web') {
    try {
      require('@react-native-ml-kit/face-detection');
      mlKit = true;
    } catch {
      mlKit = false;
    }
  }

  return {
    skia: true,
    mlKit,
    visionNative,
    supabase: isSupabaseConfigured(),
    revenueCat: isRevenueCatConfigured(),
    references: [
      'react-native-skia + SkSL (GPU LUT)',
      'FFmpeg lut3d / GPU Gems (cube validation)',
      'Hald CLUT layout (lut-creator-js / Skia #1436)',
      'Apple CIColorCube + Vision (moodlab-render-core)',
      'Google ML Kit Face Detection',
      'GPUImage-style GLES patterns (strip/Hald packers)',
      'Supabase + RevenueCat (when keys configured)',
    ],
  };
}
