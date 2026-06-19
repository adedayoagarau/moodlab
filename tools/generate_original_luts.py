#!/usr/bin/env python3
"""Deprecated — use pnpm lut:generate instead.

This script now delegates to the TypeScript lut-studio generator.
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    print("Note: generate_original_luts.py is deprecated. Use: pnpm lut:generate --all")
    result = subprocess.run(
        ["pnpm", "lut:generate", "--all"],
        cwd=ROOT,
        check=False,
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
