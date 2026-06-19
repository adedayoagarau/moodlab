/** Shared contracts for MoodLab mobile editor and platform API */

export const MOOD_PACK_CATEGORIES = [
  'Sunny',
  'Cinematic',
  'Dark',
  'Film',
  'Portrait',
  'Music Cover',
  'Streetwear',
  'Luxury',
  'Viral',
  'Black and White',
] as const;

export type MoodPackCategory = (typeof MOOD_PACK_CATEGORIES)[number];

export type PlanTier = 'free' | 'pro' | 'marketplace';

export type LutPack = {
  id: string;
  name: string;
  description: string;
  categories: MoodPackCategory[];
  plan: PlanTier;
  coverColor?: string;
  lutIds: string[];
};

export type LutDefinition = {
  id: string;
  name: string;
  packId: string;
  categories: string[];
  file: string;
  cubeSize: number;
  defaultStrength: number;
  skinProtectionDefault: 'off' | 'low' | 'medium' | 'high';
  recommendedEffects?: {
    grain?: number;
    glow?: number;
    vignette?: number;
    sharpen?: number;
  };
  plan: PlanTier;
  tags?: string[];
};

export type AdjustmentStack = {
  exposure?: number;
  contrast?: number;
  warmth?: number;
  tint?: number;
  saturation?: number;
  shadows?: number;
  highlights?: number;
  fade?: number;
  grain?: number;
  vignette?: number;
  sharpen?: number;
  glow?: number;
};

export type BeautySettings = {
  preset?: string;
  skinSmooth?: number;
  textureRestore?: number;
  evenTone?: number;
  reduceShine?: number;
  faceLight?: number;
  underEyeLift?: number;
  eyeBrightness?: number;
  lipColorBoost?: number;
  skinProtection?: 'off' | 'low' | 'medium' | 'high';
  faceLutStrength?: number;
  backgroundLutStrength?: number;
  melaninGuard?: boolean;
};

export type TextLayer = {
  id: string;
  text: string;
  templateId?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type EditRecipe = {
  version: 1;
  lutId?: string;
  lutStrength: number;
  adjustments: AdjustmentStack;
  beauty: BeautySettings;
  textLayers: TextLayer[];
  crop?: { aspect: string; rotation: number };
};

export type EditProject = {
  id: string;
  name: string;
  sourceUri: string;
  thumbnailUri?: string;
  recipe: EditRecipe;
  createdAt: string;
  updatedAt: string;
};

export type ExportPresetId =
  | 'instagram-4-5'
  | 'story-9-16'
  | 'cover-1-1'
  | 'youtube-16-9'
  | 'profile-1-1';

export const EXPORT_PRESETS: Record<
  ExportPresetId,
  { label: string; width: number; height: number; aspect: string }
> = {
  'instagram-4-5': { label: 'Instagram Post', width: 1080, height: 1350, aspect: '4:5' },
  'story-9-16': { label: 'Story / TikTok', width: 1080, height: 1920, aspect: '9:16' },
  'cover-1-1': { label: 'Cover Art', width: 3000, height: 3000, aspect: '1:1' },
  'youtube-16-9': { label: 'YouTube Thumb', width: 1920, height: 1080, aspect: '16:9' },
  'profile-1-1': { label: 'Profile', width: 1024, height: 1024, aspect: '1:1' },
};

export type ApiHealth = {
  status: 'ok';
  service: 'moodlab-api';
  version: string;
};

export const DEFAULT_EDIT_RECIPE: EditRecipe = {
  version: 1,
  lutStrength: 0.75,
  adjustments: {},
  beauty: {
    skinProtection: 'medium',
    faceLutStrength: 0.55,
    backgroundLutStrength: 1,
    melaninGuard: true,
  },
  textLayers: [],
};

export {
  clamp01,
  mergeEditRecipe,
  validateBeautyIntensity,
  skinProtectionMultiplier,
  type SkinProtectionLevel,
} from './editor-utils';

export {
  shaderAdjustmentUniforms,
  type ShaderAdjustmentUniforms,
} from './adjustment-uniforms';
