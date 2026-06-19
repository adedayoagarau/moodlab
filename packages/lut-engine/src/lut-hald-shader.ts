/**
 * Hald CLUT SkSL — trilinear blue-slice interpolation (react-native-skia #1436 / maxximee).
 */
export const LUT_HALD_SHADER_SOURCE = `
uniform shader image;
uniform shader lutImage;
uniform float strength;
uniform float skinStrength;
uniform float lutSize;
uniform float gridDim;
uniform float imageWidth;
uniform float imageHeight;
uniform float lutWidth;
uniform float lutHeight;
uniform float faceX;
uniform float faceY;
uniform float faceW;
uniform float faceH;

vec4 main(vec2 pos) {
  vec4 originalColor = image.eval(pos);
  vec3 c = clamp(originalColor.rgb, 0.0, 1.0);
  vec3 scaled = c * (lutSize - 1.0);

  float sliceIndex = floor(scaled.b);
  float sliceFrac = fract(scaled.b);

  float tileX = mod(sliceIndex, gridDim);
  float tileY = floor(sliceIndex / gridDim);
  vec2 tileSize = vec2(1.0 / gridDim, 1.0 / gridDim);
  vec2 uvWithinTile = (vec2(scaled.r, scaled.g) + 0.5) / lutSize;
  vec2 uv1 = (vec2(tileX, tileY) + uvWithinTile) * tileSize;

  float nextSliceIndex = min(sliceIndex + 1.0, lutSize - 1.0);
  float tileX2 = mod(nextSliceIndex, gridDim);
  float tileY2 = floor(nextSliceIndex / gridDim);
  vec2 uv2 = (vec2(tileX2, tileY2) + uvWithinTile) * tileSize;

  vec4 lutColor1 = lutImage.eval(uv1 * vec2(lutWidth, lutHeight));
  vec4 lutColor2 = lutImage.eval(uv2 * vec2(lutWidth, lutHeight));
  vec4 lutColor = mix(lutColor1, lutColor2, sliceFrac);

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
