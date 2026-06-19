export type SkinProtection = 'off' | 'low' | 'medium' | 'high';

export type PlanTier = 'free' | 'pro' | 'marketplace';

export type RecommendedEffects = {
  grain?: number;
  glow?: number;
  vignette?: number;
  sharpen?: number;
};

export type GradeSpec = {
  type: string;
  params: Record<string, number>;
};

export type LutMetadata = {
  defaultStrength: number;
  skinProtectionDefault: SkinProtection;
  recommendedEffects?: RecommendedEffects;
};

export type LutRegistryEntry = {
  id: string;
  name: string;
  packId: string;
  categories: string[];
  plan: PlanTier;
  tags?: string[];
  grade: GradeSpec;
  metadata: LutMetadata;
};

export type PackRegistryEntry = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  plan: PlanTier;
  coverColor?: string;
};

export type LutRegistry = {
  packs: PackRegistryEntry[];
  luts: LutRegistryEntry[];
};

export type Rgb = [number, number, number];

export type GradeFn = (r: number, g: number, b: number, params: Record<string, number>) => Rgb;

export const DEFAULT_CUBE_SIZE = 33;

export const REPO_ROOT = new URL('../../..', import.meta.url).pathname.replace(/\/$/, '');

export function lutCubePath(id: string): string {
  return `luts/original/${id}.cube`;
}
