import type { AdjustmentStack, LutDefinition } from '@moodlab/shared';
import { skinProtectionMultiplier } from '@moodlab/shared';

/** JS-layer preview tint until native RenderCore applies real .cube grades. */
export type PreviewTint = {
  overlay: string;
  opacity: number;
};

const LUT_TINTS: Record<string, PreviewTint> = {
  'sunny-cover-glow': { overlay: '#F5B85B', opacity: 0.22 },
  'afrobeat-warm-cover': { overlay: '#E8A040', opacity: 0.24 },
  'dark-room-blue': { overlay: '#4A6FA5', opacity: 0.28 },
  'luxury-matte-black': { overlay: '#2A2A30', opacity: 0.35 },
  'film-memory-gold': { overlay: '#D4A84B', opacity: 0.22 },
  'street-flash': { overlay: '#FF9A5C', opacity: 0.2 },
  'melanin-gold': { overlay: '#C4923A', opacity: 0.26 },
  'lagos-night': { overlay: '#3D4F7C', opacity: 0.3 },
  'clean-viral': { overlay: '#FFFFFF', opacity: 0.12 },
  'analog-fade': { overlay: '#C4B8A8', opacity: 0.18 },
  'green-remover': { overlay: '#8BC4A0', opacity: 0.15 },
  'blue-sky-summer': { overlay: '#6CA7FF', opacity: 0.2 },
  'brown-editorial': { overlay: '#8B5E3C', opacity: 0.24 },
  'highlife-soft': { overlay: '#E8C4A0', opacity: 0.18 },
  'rnb-purple-night': { overlay: '#7B5EA7', opacity: 0.28 },
  'golden-hour-film': { overlay: '#FFB347', opacity: 0.24 },
  'amapiano-neon-warm': { overlay: '#FF7A33', opacity: 0.22 },
  'magazine-bw': { overlay: '#888888', opacity: 0.35 },
  'creamy-indoor': { overlay: '#F5E6D3', opacity: 0.16 },
  'shadow-skin': { overlay: '#6B5B55', opacity: 0.2 },
};

export function getLutPreviewTint(lut: LutDefinition | undefined): PreviewTint | null {
  if (!lut) return null;
  return LUT_TINTS[lut.id] ?? { overlay: '#F5B85B', opacity: 0.2 };
}

export function computePreviewOpacity(
  lutStrength: number,
  skinProtection: 'off' | 'low' | 'medium' | 'high' | undefined,
  faceLutStrength = 0.55,
): { full: number; face: number } {
  const protection = skinProtectionMultiplier(skinProtection);
  return {
    full: lutStrength,
    face: lutStrength * faceLutStrength * protection,
  };
}

export function adjustmentPreviewStyle(adjustments: AdjustmentStack): {
  brightness: number;
  contrast: number;
} {
  const exposure = adjustments.exposure ?? 0;
  const contrast = adjustments.contrast ?? 0;
  return {
    brightness: 1 + exposure * 0.4,
    contrast: 1 + contrast * 0.5,
  };
}
