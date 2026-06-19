/**
 * SkSL runtime shader for 3D LUT in strip texture layout.
 * Trilinear sampling; optional face rect for skin-safe LUT strength.
 * Patterns informed by react-native-skia discussion #1436 (community).
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

  float mixStrength = strength;
  if (faceW > 0.0 && faceH > 0.0 && imageWidth > 0.0 && imageHeight > 0.0) {
    vec2 uv = pos / vec2(imageWidth, imageHeight);
    bool inFace = uv.x >= faceX && uv.x <= faceX + faceW
      && uv.y >= faceY && uv.y <= faceY + faceH;
    if (inFace) {
      mixStrength = skinStrength;
    }
  }

  vec3 blended = mix(originalColor.rgb, lutColor.rgb, mixStrength);
  return vec4(blended, originalColor.a);
}
`;
