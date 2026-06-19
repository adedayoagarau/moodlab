/**
 * SkSL: LUT grade + comprehensive face-aware Beauty Studio pipeline.
 * Single-pass GPU beauty: skin smooth, even tone, texture restore, shine control,
 * face/eye/under-eye/lip zones, Melanin Guard + ash/warmth protection.
 */
export const LUT_STRIP_SHADER_SOURCE = `
uniform shader image;
uniform shader lutImage;
uniform shader skinMaskImage;
uniform float strength;
uniform float skinStrength;
uniform float lutSize;
uniform float imageWidth;
uniform float imageHeight;
uniform float useSkinMask;
uniform float faceX;
uniform float faceY;
uniform float faceW;
uniform float faceH;
uniform float eyeX;
uniform float eyeY;
uniform float eyeW;
uniform float eyeH;
uniform float underEyeX;
uniform float underEyeY;
uniform float underEyeW;
uniform float underEyeH;
uniform float lipX;
uniform float lipY;
uniform float lipW;
uniform float lipH;
uniform float exposure;
uniform float contrast;
uniform float warmth;
uniform float saturation;
uniform float vignette;
uniform float grain;
uniform float glow;
uniform float faceLight;
uniform float melaninGuard;
uniform float skinSmooth;
uniform float textureRestore;
uniform float evenTone;
uniform float reduceShine;
uniform float underEyeLift;
uniform float eyeBrightness;
uniform float lipColorBoost;
uniform float melaninAshFix;
uniform float melaninWarmthProtect;
uniform float bgLutStrength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float luminance(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float regionWeight(vec2 uv, float rx, float ry, float rw, float rh) {
  if (rw <= 0.0 || rh <= 0.0) return 0.0;
  vec2 center = vec2(rx + rw * 0.5, ry + rh * 0.5);
  vec2 halfSize = vec2(rw, rh) * 0.5;
  vec2 d = (uv - center) / max(halfSize, vec2(0.001));
  return smoothstep(1.08, 0.22, length(d));
}

bool inFaceRegion(vec2 uv) {
  return regionWeight(uv, faceX, faceY, faceW, faceH) > 0.01;
}

vec3 sampleOriginal(vec2 pos) {
  return clamp(image.eval(pos).rgb, 0.0, 1.0);
}

vec4 main(vec2 pos) {
  vec4 originalColor = image.eval(pos);
  vec3 orig = clamp(originalColor.rgb, 0.0, 1.0);
  vec3 c = orig;
  vec3 scaled = c * (lutSize - 1.0);

  float b0 = floor(scaled.b);
  float b1 = min(b0 + 1.0, lutSize - 1.0);
  float bf = scaled.b - b0;
  vec2 rg = vec2(scaled.r, scaled.g);

  vec2 lutCoord(vec2 rgVal, float slice) {
    return vec2(rgVal.y * lutSize + rgVal.x + 0.5, slice + 0.5);
  }

  vec4 lut1 = lutImage.eval(lutCoord(rg, b0));
  vec4 lut2 = lutImage.eval(lutCoord(rg, b1));
  vec4 lutColor = mix(lut1, lut2, bf);

  vec2 uv = imageWidth > 0.0 && imageHeight > 0.0
    ? pos / vec2(imageWidth, imageHeight)
    : vec2(0.0);

  float faceWgt = regionWeight(uv, faceX, faceY, faceW, faceH);
  if (useSkinMask > 0.5) {
    float maskVal = skinMaskImage.eval(pos).r;
    faceWgt = max(faceWgt, maskVal);
  }
  float eyeWgt = regionWeight(uv, eyeX, eyeY, eyeW, eyeH);
  float underEyeWgt = regionWeight(uv, underEyeX, underEyeY, underEyeW, underEyeH);
  float lipWgt = regionWeight(uv, lipX, lipY, lipW, lipH);

  float mixStrength = strength * bgLutStrength;
  if (faceWgt > 0.01) {
    mixStrength = mix(mixStrength, skinStrength, faceWgt);
  }

  vec3 graded = mix(orig, lutColor.rgb, clamp(mixStrength, 0.0, 1.0));

  // Melanin Guard — preserve luminance + undertone in face
  if (melaninGuard > 0.5 && faceWgt > 0.01) {
    float origLum = luminance(orig);
    vec3 neutral = vec3(luminance(graded));
    graded = mix(graded, mix(neutral, graded, 0.62), 0.5 * faceWgt);
    graded = mix(vec3(origLum), graded, clamp(mixStrength + 0.12, 0.0, 1.0) * faceWgt);
  }

  // Ash fix — lift blue/purple in face shadows
  if (melaninAshFix > 0.001 && faceWgt > 0.01) {
    float lum = luminance(graded);
    float shadow = smoothstep(0.45, 0.0, lum);
    graded.r += melaninAshFix * shadow * 0.06 * faceWgt;
    graded.b -= melaninAshFix * shadow * 0.08 * faceWgt;
  }

  // Warmth protect — counter over-orange on skin
  if (melaninWarmthProtect > 0.001 && faceWgt > 0.01) {
    float warmBias = max(0.0, graded.r - graded.b);
    graded.r -= warmBias * melaninWarmthProtect * 0.15 * faceWgt;
    graded.b += warmBias * melaninWarmthProtect * 0.08 * faceWgt;
  }

  // Skin smooth — 4-tap low-pass blend in face
  if (skinSmooth > 0.001 && faceWgt > 0.01) {
    vec2 px = vec2(1.0 / max(imageWidth, 1.0), 1.0 / max(imageHeight, 1.0)) * 4.0;
    vec3 blur = (
      sampleOriginal(pos + vec2(px.x, 0.0)) +
      sampleOriginal(pos - vec2(px.x, 0.0)) +
      sampleOriginal(pos + vec2(0.0, px.y)) +
      sampleOriginal(pos - vec2(0.0, px.y))
    ) * 0.25;
    vec3 smoothGrade = mix(blur, lutColor.rgb, clamp(mixStrength, 0.0, 1.0));
    graded = mix(graded, smoothGrade, skinSmooth * 0.55 * faceWgt);
  }

  // Even tone — flatten local variance toward face mean luminance
  if (evenTone > 0.001 && faceWgt > 0.01) {
    float target = luminance(graded);
    graded = mix(graded, vec3(target), evenTone * 0.35 * faceWgt);
  }

  // Texture restore — blend original high-frequency detail back
  if (textureRestore > 0.001 && faceWgt > 0.01) {
    vec3 detail = orig - vec3(luminance(orig));
    graded = graded + detail * textureRestore * 0.85 * faceWgt;
  }

  // Reduce shine — compress face highlights
  if (reduceShine > 0.001 && faceWgt > 0.01) {
    float lum = luminance(graded);
    float shine = smoothstep(0.62, 0.95, lum);
    graded = mix(graded, graded * (1.0 - shine * reduceShine * 0.45), faceWgt);
  }

  // Face light
  if (faceLight > 0.001 && faceWgt > 0.01) {
    graded += vec3(faceLight * 0.32 * faceWgt);
  }

  // Under-eye lift
  if (underEyeLift > 0.001 && underEyeWgt > 0.01) {
    graded += vec3(underEyeLift * 0.28 * underEyeWgt);
  }

  // Eye brightness + clarity
  if (eyeBrightness > 0.001 && eyeWgt > 0.01) {
    graded += vec3(eyeBrightness * 0.22 * eyeWgt);
    float lum = luminance(graded);
    graded = mix(graded, graded * (1.0 + eyeBrightness * 0.12), eyeWgt);
  }

  // Lip color boost
  if (lipColorBoost > 0.001 && lipWgt > 0.01) {
    float lum = luminance(graded);
    graded.r += lipColorBoost * 0.08 * lipWgt;
    graded = mix(vec3(lum), graded, 1.0 + lipColorBoost * 0.35 * lipWgt);
  }

  // Global adjustments
  graded = graded * (1.0 + exposure);
  graded = (graded - 0.5) * (1.0 + contrast) + 0.5;
  graded.r += warmth * 0.12;
  graded.b -= warmth * 0.12;

  float lum = luminance(graded);
  graded = mix(vec3(lum), graded, 1.0 + saturation);

  if (glow > 0.001) {
    float highlight = smoothstep(0.55, 0.95, lum);
    graded += vec3(highlight * glow * 0.25);
  }

  if (vignette > 0.001 && imageWidth > 0.0) {
    vec2 centered = (pos / vec2(imageWidth, imageHeight)) - 0.5;
    float dist = length(centered);
    float vig = smoothstep(0.25, 0.85, dist);
    graded *= 1.0 - vig * vignette * 0.85;
  }

  if (grain > 0.001) {
    float n = hash(pos * 0.75) - 0.5;
    graded += vec3(n * grain * 0.18);
  }

  return vec4(clamp(graded, 0.0, 1.0), originalColor.a);
}
`;
