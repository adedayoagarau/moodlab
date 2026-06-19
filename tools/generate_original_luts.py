#!/usr/bin/env python3
"""Generate original MoodLab .cube LUTs for catalog entries (33³, DOMAIN 0-1)."""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "luts" / "original"
SIZE = 33

# Per-LUT RGB shift multipliers at mid-gray — stylized placeholders until artist grades ship.
LUT_STYLES: dict[str, tuple[float, float, float]] = {
    "sunny-cover-glow.cube": (1.08, 1.04, 0.92),
    "afrobeat-warm-cover.cube": (1.12, 0.98, 0.88),
    "dark-room-blue.cube": (0.82, 0.88, 1.14),
    "luxury-matte-black.cube": (0.88, 0.86, 0.84),
    "film-memory-gold.cube": (1.06, 0.96, 0.82),
    "street-flash.cube": (1.1, 1.02, 0.95),
    "melanin-gold.cube": (1.14, 0.94, 0.78),
    "lagos-night.cube": (0.75, 0.82, 1.1),
    "clean-viral.cube": (1.05, 1.05, 1.05),
    "analog-fade.cube": (0.95, 0.92, 0.88),
    "green-remover.cube": (1.02, 0.98, 0.96),
    "blue-sky-summer.cube": (0.92, 1.02, 1.12),
    "brown-editorial.cube": (1.08, 0.9, 0.82),
    "highlife-soft.cube": (1.04, 0.98, 0.94),
    "rnb-purple-night.cube": (0.88, 0.82, 1.12),
    "golden-hour-film.cube": (1.12, 0.94, 0.78),
    "amapiano-neon-warm.cube": (1.1, 0.92, 0.88),
    "magazine-bw.cube": (0.92, 0.92, 0.92),
    "creamy-indoor.cube": (1.06, 1.0, 0.94),
    "shadow-skin.cube": (0.94, 0.9, 0.88),
}


def clamp(v: float) -> float:
    return max(0.0, min(1.0, v))


def write_cube(path: Path, title: str, mult: tuple[float, float, float]) -> None:
    lines = [
        f"TITLE \"{title}\"",
        f"LUT_3D_SIZE {SIZE}",
        "DOMAIN_MIN 0.0 0.0 0.0",
        "DOMAIN_MAX 1.0 1.0 1.0",
    ]
    mr, mg, mb = mult
    for bi in range(SIZE):
        for gi in range(SIZE):
            for ri in range(SIZE):
                r = ri / (SIZE - 1)
                g = gi / (SIZE - 1)
                b = bi / (SIZE - 1)
                # Blend toward stylized grade; stronger effect away from black/white.
                weight = 0.35 + 0.65 * max(r, g, b)
                out_r = clamp(r * (1 - weight) + r * mr * weight)
                out_g = clamp(g * (1 - weight) + g * mg * weight)
                out_b = clamp(b * (1 - weight) + b * mb * weight)
                lines.append(f"{out_r:.6f} {out_g:.6f} {out_b:.6f}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, mult in LUT_STYLES.items():
        title = filename.replace(".cube", "").replace("-", " ").title()
        write_cube(OUT / filename, title, mult)
        print(f"Wrote {OUT / filename}")


if __name__ == "__main__":
    main()
