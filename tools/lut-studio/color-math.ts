import type { Rgb } from './types.js';

export function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h, s, v];
}

export function hsvToRgb(h: number, s: number, v: number): Rgb {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    default:
      return [v, p, q];
  }
}

/** Luminance-preserving saturation adjustment */
export function adjustSaturation(r: number, g: number, b: number, amount: number): Rgb {
  const [h, s, v] = rgbToHsv(r, g, b);
  return hsvToRgb(h, clamp(s + amount), v);
}

/** Contrast around 0.18 gray pivot */
export function adjustContrast(r: number, g: number, b: number, amount: number): Rgb {
  const pivot = 0.18;
  return [
    clamp((r - pivot) * (1 + amount) + pivot),
    clamp((g - pivot) * (1 + amount) + pivot),
    clamp((b - pivot) * (1 + amount) + pivot),
  ];
}

/** Lift shadows/mids */
export function adjustLift(r: number, g: number, b: number, amount: number): Rgb {
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const weight = 1 - luma;
  return [
    clamp(r + amount * weight * 0.5),
    clamp(g + amount * weight * 0.5),
    clamp(b + amount * weight * 0.5),
  ];
}

/** Warmth: push R up, B down proportionally */
export function adjustWarmth(r: number, g: number, b: number, amount: number): Rgb {
  return [clamp(r + amount * 0.5), g, clamp(b - amount * 0.5)];
}

/** Cool: push B up, R down */
export function adjustCool(r: number, g: number, b: number, amount: number): Rgb {
  return [clamp(r - amount * 0.5), g, clamp(b + amount * 0.5)];
}

/** Fade: lift blacks */
export function adjustFade(r: number, g: number, b: number, amount: number): Rgb {
  return [clamp(r + amount * (1 - r)), clamp(g + amount * (1 - g)), clamp(b + amount * (1 - b))];
}

/** Skin-tone region: hue roughly 20-50 deg, moderate saturation */
export function isSkinToneRegion(r: number, g: number, b: number): boolean {
  const [h, s, v] = rgbToHsv(r, g, b);
  const hueDeg = h * 360;
  return s > 0.08 && s < 0.65 && v > 0.15 && v < 0.92 && hueDeg >= 15 && hueDeg <= 55;
}

/** Reduce grade strength in skin-tone voxels */
export function protectSkinTone(
  input: Rgb,
  output: Rgb,
  protection: number,
): Rgb {
  const [r, g, b] = input;
  if (!isSkinToneRegion(r, g, b)) return output;
  const t = 1 - protection;
  return [
    clamp(r + (output[0] - r) * t),
    clamp(g + (output[1] - g) * t),
    clamp(b + (output[2] - b) * t),
  ];
}

export function blendGrade(input: Rgb, graded: Rgb, weight: number): Rgb {
  const w = clamp(weight);
  return [
    clamp(input[0] * (1 - w) + graded[0] * w),
    clamp(input[1] * (1 - w) + graded[1] * w),
    clamp(input[2] * (1 - w) + graded[2] * w),
  ];
}

/** Grade weight stronger away from pure black (matches legacy Python script) */
export function legacyWeight(r: number, g: number, b: number, base = 0.35): number {
  return base + 0.65 * Math.max(r, g, b);
}
