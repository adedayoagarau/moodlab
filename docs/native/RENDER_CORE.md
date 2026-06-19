# RenderCore — native LUT pipeline

MoodLab editing must feel **local and instant**. The JS layer (`apps/mobile/lib/render-preview.ts`) provides a tint-based preview until native RenderCore ships.

## Architecture split

| Layer | Responsibility |
|-------|----------------|
| **JS (Expo)** | UI, edit recipe, catalog, preview tint, export orchestration |
| **iOS RenderCore** | Core Image / Metal — `CIColorCube` with parsed `.cube` data |
| **Android RenderCore** | GPU shader path — AGSL / Skia / OpenGL LUT sampling |
| **lut-engine** | Parse `.cube` files (`packages/lut-engine`) — shared parser for workers and native bridges |

## iOS direction

- Parse `.cube` → `Float32Array` RGB cube (`LUT_3D_SIZE`, domain min/max)
- Build `CIColorCube` filter with `cubeData` and `cubeDimension`
- Chain: orientation fix → LUT → adjustments → beauty masks → text overlays → export
- Face/skin: Vision person segmentation + reduced LUT strength on skin mask

## Android direction

- Load cube into GPU 3D texture or 2D strip layout
- `RenderEffect` + runtime shader where supported
- ML Kit face landmarks for skin-safe LUT blending

## LUT assets

Original placeholder grades live in `luts/original/*.cube` (20 files). Catalog metadata in `data/lut_catalog.json`.

Regenerate stylized placeholders:

```bash
python3 tools/generate_original_luts.py
```

## Export pipeline

1. Start from full-resolution source (not preview bitmap)
2. Apply full recipe stack on native thread
3. Crop to `EXPORT_PRESETS` dimensions from `@moodlab/shared`
4. Write JPEG/PNG to app cache → share sheet

## Do not

- Upload photos to API for normal LUT application
- Block UI on network for editing
- Apply LUT only in JS for final export quality
