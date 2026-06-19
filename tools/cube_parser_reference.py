#!/usr/bin/env python3
"""Reference .cube LUT parser — use @moodlab/lut-engine in TypeScript for the app."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass
class CubeLut:
    size: int
    domain_min: tuple[float, float, float]
    domain_max: tuple[float, float, float]
    values: list[tuple[float, float, float]]


def parse_cube(path: Path) -> CubeLut:
    size = 0
    domain_min = (0.0, 0.0, 0.0)
    domain_max = (1.0, 1.0, 1.0)
    values: list[tuple[float, float, float]] = []

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("LUT_3D_SIZE"):
            size = int(line.split()[1])
        elif line.startswith("DOMAIN_MIN"):
            parts = [float(x) for x in line.split()[1:4]]
            domain_min = (parts[0], parts[1], parts[2])
        elif line.startswith("DOMAIN_MAX"):
            parts = [float(x) for x in line.split()[1:4]]
            domain_max = (parts[0], parts[1], parts[2])
        else:
            parts = line.split()
            if len(parts) >= 3:
                values.append((float(parts[0]), float(parts[1]), float(parts[2])))

    if size == 0:
        raise ValueError("LUT_3D_SIZE missing")
    expected = size ** 3
    if len(values) != expected:
        raise ValueError(f"expected {expected} entries, got {len(values)}")

    return CubeLut(size=size, domain_min=domain_min, domain_max=domain_max, values=values)


if __name__ == "__main__":
    import sys

    lut = parse_cube(Path(sys.argv[1]))
    print(f"size={lut.size} entries={len(lut.values)}")
