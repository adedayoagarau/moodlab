import {
  adjustContrast,
  adjustCool,
  adjustFade,
  adjustLift,
  adjustSaturation,
  adjustWarmth,
  blendGrade,
  clamp,
  legacyWeight,
  protectSkinTone,
} from '../color-math.js';
import type { GradeFn, Rgb } from '../types.js';

function applyChain(input: Rgb, steps: Array<(c: Rgb) => Rgb>): Rgb {
  return steps.reduce((c, fn) => fn(c), input);
}

export const rgbMultiply: GradeFn = (r, g, b, params) => {
  const mr = params.rMult ?? 1;
  const mg = params.gMult ?? 1;
  const mb = params.bMult ?? 1;
  const weight = legacyWeight(r, g, b, params.weightBase ?? 0.35);
  return [
    clamp(r * (1 - weight) + r * mr * weight),
    clamp(g * (1 - weight) + g * mg * weight),
    clamp(b * (1 - weight) + b * mb * weight),
  ];
};

export const warmGlow: GradeFn = (r, g, b, params) => {
  const warmth = params.warmth ?? 0.1;
  const lift = params.lift ?? 0.03;
  const saturation = params.saturation ?? 0.05;
  const input: Rgb = [r, g, b];
  let out = applyChain(input, [
    (c) => adjustWarmth(c[0], c[1], c[2], warmth),
    (c) => adjustLift(c[0], c[1], c[2], lift),
    (c) => adjustSaturation(c[0], c[1], c[2], saturation),
  ]);
  const w = legacyWeight(r, g, b);
  out = blendGrade(input, out, w);
  return out;
};

export const coolMoody: GradeFn = (r, g, b, params) => {
  const cool = params.cool ?? 0.12;
  const saturation = params.saturation ?? -0.05;
  const lift = params.lift ?? 0;
  const input: Rgb = [r, g, b];
  let out = applyChain(input, [
    (c) => adjustCool(c[0], c[1], c[2], cool),
    (c) => adjustSaturation(c[0], c[1], c[2], saturation),
    (c) => adjustLift(c[0], c[1], c[2], lift),
  ]);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const cinematicTealOrange: GradeFn = (r, g, b, params) => {
  const teal = params.teal ?? 0.1;
  const warmth = params.warmth ?? 0.08;
  const saturation = params.saturation ?? 0.04;
  const input: Rgb = [r, g, b];
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const shadowWeight = 1 - luma;
  const highlightWeight = luma;
  let out: Rgb = [r, g, b];
  out = adjustCool(out[0], out[1], out[2], teal * shadowWeight);
  out = adjustWarmth(out[0], out[1], out[2], warmth * highlightWeight);
  out = adjustSaturation(out[0], out[1], out[2], saturation);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const filmFade: GradeFn = (r, g, b, params) => {
  const fade = params.fade ?? 0.08;
  const saturation = params.saturation ?? -0.08;
  const warmth = params.warmth ?? 0;
  const contrast = params.contrast ?? 0;
  const input: Rgb = [r, g, b];
  let out = applyChain(input, [
    (c) => adjustFade(c[0], c[1], c[2], fade),
    (c) => adjustSaturation(c[0], c[1], c[2], saturation),
    (c) => adjustWarmth(c[0], c[1], c[2], warmth),
    (c) => adjustContrast(c[0], c[1], c[2], contrast),
  ]);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const bwEditorial: GradeFn = (r, g, b, params) => {
  const contrast = params.contrast ?? 0.08;
  const fade = params.fade ?? 0;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const input: Rgb = [r, g, b];
  let out: Rgb = [luma, luma, luma];
  out = adjustFade(out[0], out[1], out[2], fade);
  out = adjustContrast(out[0], out[1], out[2], contrast);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const neonWarm: GradeFn = (r, g, b, params) => {
  const warmth = params.warmth ?? 0.1;
  const contrast = params.contrast ?? 0.1;
  const saturation = params.saturation ?? 0.08;
  const input: Rgb = [r, g, b];
  let out = applyChain(input, [
    (c) => adjustWarmth(c[0], c[1], c[2], warmth),
    (c) => adjustContrast(c[0], c[1], c[2], contrast),
    (c) => adjustSaturation(c[0], c[1], c[2], saturation),
  ]);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const skinSafePortrait: GradeFn = (r, g, b, params) => {
  const warmth = params.warmth ?? 0.1;
  const saturation = params.saturation ?? 0.04;
  const lift = params.lift ?? 0.03;
  const skinProtection = params.skinProtection ?? 0.5;
  const input: Rgb = [r, g, b];
  let out = applyChain(input, [
    (c) => adjustWarmth(c[0], c[1], c[2], warmth),
    (c) => adjustLift(c[0], c[1], c[2], lift),
    (c) => adjustSaturation(c[0], c[1], c[2], saturation),
  ]);
  out = protectSkinTone(input, out, skinProtection);
  const w = legacyWeight(r, g, b);
  return blendGrade(input, out, w);
};

export const RECIPES: Record<string, GradeFn> = {
  rgb_multiply: rgbMultiply,
  warm_glow: warmGlow,
  cool_moody: coolMoody,
  cinematic_teal_orange: cinematicTealOrange,
  film_fade: filmFade,
  bw_editorial: bwEditorial,
  neon_warm: neonWarm,
  skin_safe_portrait: skinSafePortrait,
};

export function getRecipe(type: string): GradeFn {
  const recipe = RECIPES[type];
  if (!recipe) {
    throw new Error(`Unknown recipe type: ${type}. Available: ${Object.keys(RECIPES).join(', ')}`);
  }
  return recipe;
}
