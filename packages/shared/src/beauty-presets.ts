import type { BeautySettings } from './index';

export type BeautyPresetDefinition = {
  id: string;
  name: string;
  plan: 'free' | 'pro';
  description: string;
  settings: Partial<BeautySettings>;
};

/** MVP + signature presets — values tuned for Clean default intensity. */
export const BEAUTY_PRESETS: BeautyPresetDefinition[] = [
  {
    id: 'natural',
    name: 'Natural',
    plan: 'free',
    description: 'Invisible cleanup — texture preserved',
    settings: {
      preset: 'natural',
      skinSmooth: 0.08,
      textureRestore: 0.72,
      evenTone: 0.1,
      melaninGuard: true,
      skinProtection: 'high',
    },
  },
  {
    id: 'clean-skin',
    name: 'Clean Skin',
    plan: 'free',
    description: 'Polished but realistic',
    settings: {
      preset: 'clean-skin',
      skinSmooth: 0.18,
      textureRestore: 0.62,
      evenTone: 0.22,
      reduceShine: 0.12,
      faceLight: 0.12,
      melaninGuard: true,
      skinProtection: 'medium',
    },
  },
  {
    id: 'no-filter-skin',
    name: 'No Filter Skin',
    plan: 'free',
    description: 'LUT-safe with maximum identity',
    settings: {
      preset: 'no-filter-skin',
      skinSmooth: 0,
      textureRestore: 0.85,
      evenTone: 0.05,
      melaninGuard: true,
      skinProtection: 'high',
      faceLutStrength: 0.4,
    },
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    plan: 'free',
    description: 'Social-ready soft glam',
    settings: {
      preset: 'soft-glow',
      skinSmooth: 0.28,
      textureRestore: 0.55,
      evenTone: 0.28,
      faceLight: 0.22,
      reduceShine: 0.08,
      eyeBrightness: 0.12,
      lipColorBoost: 0.1,
      melaninGuard: true,
      skinProtection: 'medium',
    },
  },
  {
    id: 'melanin-gold',
    name: 'Melanin Gold',
    plan: 'pro',
    description: 'Warmth + depth protected for brown skin',
    settings: {
      preset: 'melanin-gold',
      skinSmooth: 0.2,
      textureRestore: 0.68,
      evenTone: 0.18,
      faceLight: 0.15,
      melaninGuard: true,
      melaninAshFix: 0.35,
      melaninWarmthProtect: 0.4,
      skinProtection: 'high',
      faceLutStrength: 0.5,
    },
  },
  {
    id: 'studio-face',
    name: 'Studio Face',
    plan: 'pro',
    description: 'Editorial face light + clarity',
    settings: {
      preset: 'studio-face',
      skinSmooth: 0.22,
      textureRestore: 0.58,
      evenTone: 0.3,
      faceLight: 0.28,
      underEyeLift: 0.2,
      eyeBrightness: 0.18,
      reduceShine: 0.15,
      melaninGuard: true,
      skinProtection: 'medium',
    },
  },
  {
    id: 'flash-fix',
    name: 'Flash Fix',
    plan: 'free',
    description: 'Recover harsh flash shine',
    settings: {
      preset: 'flash-fix',
      reduceShine: 0.35,
      faceLight: 0.08,
      evenTone: 0.2,
      textureRestore: 0.65,
      melaninGuard: true,
      skinProtection: 'high',
    },
  },
  {
    id: 'sunny-skin',
    name: 'Sunny Skin',
    plan: 'free',
    description: 'Warm outdoor portrait polish',
    settings: {
      preset: 'sunny-skin',
      skinSmooth: 0.15,
      faceLight: 0.18,
      evenTone: 0.15,
      lipColorBoost: 0.08,
      melaninWarmthProtect: 0.25,
      melaninGuard: true,
      skinProtection: 'medium',
    },
  },
  {
    id: 'brown-editorial',
    name: 'Brown Editorial',
    plan: 'pro',
    description: 'Cover-art editorial depth',
    settings: {
      preset: 'brown-editorial',
      skinSmooth: 0.25,
      textureRestore: 0.52,
      evenTone: 0.32,
      faceLight: 0.2,
      eyeBrightness: 0.14,
      melaninGuard: true,
      melaninAshFix: 0.28,
      melaninWarmthProtect: 0.35,
      skinProtection: 'high',
      backgroundLutStrength: 1.15,
    },
  },
  {
    id: 'glam',
    name: 'Glam',
    plan: 'pro',
    description: 'Makeup-forward cover look',
    settings: {
      preset: 'glam',
      skinSmooth: 0.38,
      textureRestore: 0.45,
      evenTone: 0.4,
      faceLight: 0.25,
      underEyeLift: 0.22,
      eyeBrightness: 0.22,
      lipColorBoost: 0.28,
      reduceShine: 0.1,
      melaninGuard: true,
      skinProtection: 'low',
      faceLutStrength: 0.65,
    },
  },
];

export function getBeautyPreset(id: string): BeautyPresetDefinition | undefined {
  return BEAUTY_PRESETS.find((p) => p.id === id);
}

export function applyBeautyPreset(
  current: BeautySettings,
  presetId: string,
): BeautySettings {
  const preset = getBeautyPreset(presetId);
  if (!preset) return current;
  return {
    ...current,
    ...preset.settings,
    preset: presetId,
  };
}
