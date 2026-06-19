#!/usr/bin/env python3
"""Generate MoodLab .cube LUTs (33³) with S-curve tone mapping and split-tone styles."""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "luts" / "original"
SIZE = 33


def clamp(v: float) -> float:
    return max(0.0, min(1.0, v))


def s_curve(x: float, strength: float = 0.35) -> float:
    """Soft contrast S-curve centered at mid-gray."""
    t = x - 0.5
    return clamp(0.5 + t * (1.0 + strength * (1.0 - 4.0 * t * t)))


class LutStyle:
    def __init__(
        self,
        mult: tuple[float, float, float],
        shadow_tint: tuple[float, float, float] = (1.0, 1.0, 1.0),
        highlight_tint: tuple[float, float, float] = (1.0, 1.0, 1.0),
        curve: float = 0.3,
        saturation: float = 1.0,
    ):
        self.mult = mult
        self.shadow_tint = shadow_tint
        self.highlight_tint = highlight_tint
        self.curve = curve
        self.saturation = saturation


LUT_STYLES: dict[str, LutStyle] = {
    "sunny-cover-glow.cube": LutStyle(
        (1.1, 1.05, 0.92),
        shadow_tint=(0.95, 0.88, 0.82),
        highlight_tint=(1.12, 1.08, 0.95),
        curve=0.25,
        saturation=1.08,
    ),
    "afrobeat-warm-cover.cube": LutStyle(
        (1.14, 0.98, 0.86),
        shadow_tint=(0.9, 0.78, 0.68),
        highlight_tint=(1.18, 1.02, 0.82),
        curve=0.32,
        saturation=1.12,
    ),
    "dark-room-blue.cube": LutStyle(
        (0.78, 0.86, 1.16),
        shadow_tint=(0.62, 0.72, 1.05),
        highlight_tint=(0.92, 0.95, 1.08),
        curve=0.38,
        saturation=0.92,
    ),
    "luxury-matte-black.cube": LutStyle(
        (0.86, 0.84, 0.82),
        shadow_tint=(0.72, 0.7, 0.68),
        highlight_tint=(0.95, 0.93, 0.9),
        curve=0.42,
        saturation=0.85,
    ),
    "film-memory-gold.cube": LutStyle(
        (1.08, 0.94, 0.8),
        shadow_tint=(0.82, 0.72, 0.58),
        highlight_tint=(1.14, 0.98, 0.78),
        curve=0.28,
        saturation=1.05,
    ),
    "street-flash.cube": LutStyle(
        (1.12, 1.04, 0.96),
        shadow_tint=(0.88, 0.82, 0.78),
        highlight_tint=(1.2, 1.1, 1.0),
        curve=0.45,
        saturation=1.15,
    ),
    "melanin-gold.cube": LutStyle(
        (1.16, 0.94, 0.76),
        shadow_tint=(0.88, 0.72, 0.58),
        highlight_tint=(1.2, 1.0, 0.78),
        curve=0.22,
        saturation=1.1,
    ),
    "lagos-night.cube": LutStyle(
        (0.72, 0.8, 1.12),
        shadow_tint=(0.55, 0.65, 0.98),
        highlight_tint=(0.88, 0.92, 1.06),
        curve=0.4,
        saturation=0.88,
    ),
    "clean-viral.cube": LutStyle((1.05, 1.05, 1.05), curve=0.15, saturation=1.02),
    "analog-fade.cube": LutStyle(
        (0.94, 0.9, 0.86),
        shadow_tint=(0.88, 0.82, 0.78),
        highlight_tint=(1.02, 0.98, 0.92),
        curve=0.2,
        saturation=0.9,
    ),
    "green-remover.cube": LutStyle(
        (1.04, 1.02, 0.98),
        shadow_tint=(1.0, 0.95, 0.92),
        highlight_tint=(1.06, 1.04, 1.0),
        curve=0.18,
        saturation=0.95,
    ),
    "blue-sky-summer.cube": LutStyle(
        (0.9, 1.02, 1.14),
        shadow_tint=(0.82, 0.95, 1.08),
        highlight_tint=(0.95, 1.06, 1.18),
        curve=0.22,
        saturation=1.1,
    ),
    "brown-editorial.cube": LutStyle(
        (1.1, 0.88, 0.8),
        shadow_tint=(0.85, 0.68, 0.58),
        highlight_tint=(1.12, 0.92, 0.82),
        curve=0.35,
        saturation=1.0,
    ),
    "highlife-soft.cube": LutStyle(
        (1.06, 0.98, 0.94),
        shadow_tint=(0.92, 0.86, 0.82),
        highlight_tint=(1.1, 1.02, 0.98),
        curve=0.18,
        saturation=1.04,
    ),
    "rnb-purple-night.cube": LutStyle(
        (0.86, 0.8, 1.14),
        shadow_tint=(0.68, 0.62, 0.95),
        highlight_tint=(0.98, 0.9, 1.1),
        curve=0.36,
        saturation=1.08,
    ),
    "golden-hour-film.cube": LutStyle(
        (1.14, 0.92, 0.76),
        shadow_tint=(0.85, 0.68, 0.52),
        highlight_tint=(1.22, 0.98, 0.72),
        curve=0.3,
        saturation=1.12,
    ),
    "amapiano-neon-warm.cube": LutStyle(
        (1.12, 0.9, 0.86),
        shadow_tint=(0.82, 0.62, 0.72),
        highlight_tint=(1.18, 0.95, 0.88),
        curve=0.38,
        saturation=1.18,
    ),
    "magazine-bw.cube": LutStyle(
        (0.9, 0.9, 0.9),
        curve=0.4,
        saturation=0.0,
    ),
    "creamy-indoor.cube": LutStyle(
        (1.08, 1.02, 0.96),
        shadow_tint=(0.98, 0.92, 0.88),
        highlight_tint=(1.1, 1.06, 1.0),
        curve=0.16,
        saturation=0.96,
    ),
    "shadow-skin.cube": LutStyle(
        (0.92, 0.88, 0.86),
        shadow_tint=(0.78, 0.72, 0.7),
        highlight_tint=(1.0, 0.96, 0.94),
        curve=0.24,
        saturation=0.92,
    ),
}


def apply_saturation(r: float, g: float, b: float, amount: float) -> tuple[float, float, float]:
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if amount <= 0.01:
        return lum, lum, lum
    return (
        clamp(lum + (r - lum) * amount),
        clamp(lum + (g - lum) * amount),
        clamp(lum + (b - lum) * amount),
    )


def grade_rgb(r: float, g: float, b: float, style: LutStyle) -> tuple[float, float, float]:
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    shadow_w = clamp(1.0 - lum * 2.2)
    highlight_w = clamp(lum * 2.0 - 0.6)

    mr, mg, mb = style.mult
    sr, sg, sb = style.shadow_tint
    hr, hg, hb = style.highlight_tint

    r = r * (mr * (1 - shadow_w) + sr * shadow_w * mr)
    g = g * (mg * (1 - shadow_w) + sg * shadow_w * mg)
    b = b * (mb * (1 - shadow_w) + sb * shadow_w * mb)

    r = r * (1 - highlight_w) + r * hr * highlight_w
    g = g * (1 - highlight_w) + g * hg * highlight_w
    b = b * (1 - highlight_w) + b * hb * highlight_w

    r, g, b = apply_saturation(r, g, b, style.saturation)

    r = s_curve(r, style.curve)
    g = s_curve(g, style.curve)
    b = s_curve(b, style.curve)

    return clamp(r), clamp(g), clamp(b)


def write_cube(path: Path, title: str, style: LutStyle) -> None:
    lines = [
        f'TITLE "{title}"',
        f"LUT_3D_SIZE {SIZE}",
        "DOMAIN_MIN 0.0 0.0 0.0",
        "DOMAIN_MAX 1.0 1.0 1.0",
    ]
    for bi in range(SIZE):
        for gi in range(SIZE):
            for ri in range(SIZE):
                r = ri / (SIZE - 1)
                g = gi / (SIZE - 1)
                b = bi / (SIZE - 1)
                weight = 0.25 + 0.75 * max(r, g, b)
                base_r = r * (1 - weight) + r * weight
                base_g = g * (1 - weight) + g * weight
                base_b = b * (1 - weight) + b * weight
                out_r, out_g, out_b = grade_rgb(base_r, base_g, base_b, style)
                lines.append(f"{out_r:.6f} {out_g:.6f} {out_b:.6f}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, style in LUT_STYLES.items():
        title = filename.replace(".cube", "").replace("-", " ").title()
        write_cube(OUT / filename, title, style)
        print(f"Wrote {OUT / filename}")


if __name__ == "__main__":
    main()
