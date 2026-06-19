#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCubeData, DEFAULT_CUBE_SIZE, writeCubeFile } from './cube-writer.js';
import { loadRegistry } from './load-registry.js';
import { getRecipe } from './recipes/index.js';
import { lutCubePath, REPO_ROOT } from './types.js';

function parseArgs(): { id?: string; all: boolean } {
  const args = process.argv.slice(2);
  let id: string | undefined;
  let all = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      id = args[++i];
    } else if (args[i] === '--all') {
      all = true;
    }
  }
  if (!id && !all) all = true;
  return { id, all };
}

function generateLut(id: string, title: string, gradeType: string, params: Record<string, number>): void {
  const recipe = getRecipe(gradeType);
  const data = buildCubeData(DEFAULT_CUBE_SIZE, (r, g, b) => recipe(r, g, b, params));
  const cubeText = writeCubeFile(title, DEFAULT_CUBE_SIZE, data);
  const relPath = lutCubePath(id);
  const absPath = join(REPO_ROOT, relPath);
  mkdirSync(join(REPO_ROOT, 'luts/original'), { recursive: true });
  writeFileSync(absPath, cubeText, 'utf8');
  console.log(`Wrote ${relPath}`);
}

function main(): void {
  const { id, all } = parseArgs();
  const registry = loadRegistry();
  const targets = all ? registry.luts : registry.luts.filter((l) => l.id === id);

  if (!all && targets.length === 0) {
    console.error(`LUT not found in registry: ${id}`);
    process.exit(1);
  }

  for (const lut of targets) {
    generateLut(lut.id, lut.name, lut.grade.type, lut.grade.params);
  }

  console.log(`Generated ${targets.length} LUT(s)`);
}

main();
