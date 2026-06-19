/**
 * SkSL runtime shader for 3D LUT in strip texture layout.
 * Trilinear sampling; face rect for skin-safe LUT strength;
 * post-LUT adjustments (exposure, contrast, warmth, saturation, vignette, grain, glow);
 * Melanin Guard reduces chroma shift in skin regions; face light lifts portrait exposure.
 */
export const LUT_STRIP_SHADER_SOURCE = `
uniform shader image;
uniform shader lutImage;
uniform float strength;
uniform float skinStrength;
uniform float lutSize;
uniform float imageWidth;
uniform float imageHeight;
uniform float faceX;
uniform float faceY;
uniform float faceW;
uniform float faceH;
uniform float exposure;
uniform float contrast;
uniform float warmth;
uniform float saturation;
uniform float vignette;
uniform float grain;
uniform float glow;
uniform float faceLight;
uniform float melaninGuard;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

bool inFaceRegion(vec2 uv) {
  return faceW > 0.0 && faceH > 0.0
    && uv.x >= faceX && uv.x <= faceX + faceW
    && uv.y >= faceY && uv.y <= faceY + faceH;
}

vec4 main(vec2 pos) {
  vec4 originalColor = image.eval(pos);
  vec3 c = clamp(originalColor.rgb, 0.0, 1.0);
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

  float mixStrength = strength;
  bool inFace = inFaceRegion(uv);
  if (inFace) {
    mixStrength = skinStrength;
  }

  vec3 graded = mix(originalColor.rgb, lutColor.rgb, mixStrength);

  // Melanin Guard: preserve skin luminance, reduce aggressive hue shifts in face region.
  if (melaninGuard > 0.5 && inFace) {
    float origLum = dot(originalColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    float gradedLum = dot(graded, vec3(0.2126, 0.7152, 0.0722));
    vec3 neutral = vec3(gradedLum);
    graded = mix(graded, mix(neutral, graded, 0.65), 0.55);
    graded = mix(vec3(origLum), graded, clamp(mixStrength + 0.15, 0.0, 1.0));
  }

  // Face light: lift exposure in portrait region.
  if (faceLight > 0.001 && inFace) {
    graded += vec3(faceLight * 0.35);
  }

  // Exposure & contrast
  graded = graded * (1.0 + exposure);
  graded = (graded - 0.5) * (1.0 + contrast) + 0.5;

  // Warmth (shift red/blue)
  graded.r += warmth * 0.12;
  graded.b -= warmth * 0.12;

  // Saturation
  float lum = dot(graded, vec3(0.2126, 0.7152, 0.0722));
  graded = mix(vec3(lum), graded, 1.0 + saturation);

  // Soft glow on highlights
  if (glow > 0.001) {
    float highlight = smoothstep(0.55, 0.95, lum);
    graded += vec3(highlight * glow * 0.25);
  }

  // Vignette
  if (vignette > 0.001 && imageWidth > 0.0) {
    vec2 centered = (pos / vec2(imageWidth, imageHeight)) - 0.5;
    float dist = length(centered);
    float vig = smoothstep(0.25, 0.85, dist);
    graded *= 1.0 - vig * vignette * 0.85;
  }

  // Film grain
  if (grain > 0.001) {
    float n = hash(pos * 0.75) - 0.5;
    graded += vec3(n * grain * 0.18);
  }

  return vec4(clamp(graded, 0.0, 1.0), originalColor.a);
}
`;
