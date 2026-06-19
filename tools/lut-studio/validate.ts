#!/usr/bin/env tsx
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCubeFile, validateCubeLut } from '../../packages/lut-engine/src/index.js';
import { loadRegistry } from './load-registry.js';
import { lutCubePath, REPO_ROOT } from './types.js';

type Issue = { level: 'error' | 'warn'; message: string };

function validateAll(): Issue[] {
  const issues: Issue[] = [];
  const registry = loadRegistry();

  const lutIdsByPack = new Map<string, string[]>();
  for (const lut of registry.luts) {
    const list = lutIdsByPack.get(lut.packId) ?? [];
    list.push(lut.id);
    lutIdsByPack.set(lut.packId, list);
  }

  for (const pack of registry.packs) {
    const expected = (lutIdsByPack.get(pack.id) ?? []).sort();
    // pack lutIds are derived at sync time; warn if catalog out of sync
    if (expected.length === 0) {
      issues.push({ level: 'warn', message: `Pack ${pack.id} has no LUTs in registry` });
    }
  }

  for (const lut of registry.luts) {
    const relPath = lutCubePath(lut.id);
    const absPath = join(REPO_ROOT, relPath);

    if (!existsSync(absPath)) {
      issues.push({ level: 'error', message: `Missing .cube file: ${relPath}` });
      continue;
    }

    const pack = registry.packs.find((p) => p.id === lut.packId);
    if (!pack) {
      issues.push({ level: 'error', message: `LUT ${lut.id}: unknown packId ${lut.packId}` });
    }

    const cubeText = readFileSync(absPath, 'utf8');
    let parsed;
    try {
      parsed = parseCubeFile(cubeText);
    } catch (e) {
      issues.push({
        level: 'error',
        message: `LUT ${lut.id}: parse error — ${e instanceof Error ? e.message : String(e)}`,
      });
      continue;
    }

    const validation = validateCubeLut(parsed);
    if (!validation.valid) {
      for (const err of validation.errors) {
        issues.push({ level: 'error', message: `LUT ${lut.id}: ${err}` });
      }
    }
    for (const warn of validation.warnings) {
      issues.push({ level: 'warn', message: `LUT ${lut.id}: ${warn}` });
    }

    if (parsed.size !== 33) {
      issues.push({ level: 'warn', message: `LUT ${lut.id}: non-standard size ${parsed.size} (preferred 33)` });
    }

    const portraitCategories = ['Portrait', 'Music Cover'];
    const isPortrait = lut.categories.some((c) => portraitCategories.includes(c));
    if (isPortrait && lut.metadata.skinProtectionDefault === 'off') {
      issues.push({
        level: 'warn',
        message: `LUT ${lut.id}: portrait LUT with skinProtectionDefault off`,
      });
    }
    const hasPortraitTag = lut.tags?.some((t) =>
      ['skin-safe', 'melanin', 'portrait'].includes(t),
    );
    if (isPortrait && !lut.categories.includes('Portrait') && !hasPortraitTag) {
      issues.push({
        level: 'warn',
        message: `LUT ${lut.id}: Music Cover LUT missing skin-safe/melanin/portrait tag`,
      });
    }
  }

  // Validate catalog sync if present
  const catalogPath = join(REPO_ROOT, 'data/lut_catalog.json');
  if (existsSync(catalogPath)) {
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as {
      packs: Array<{ id: string; lutIds: string[] }>;
      luts: Array<{ id: string; packId: string; cubeSize: number }>;
    };

    for (const regLut of registry.luts) {
      const catLut = catalog.luts.find((l) => l.id === regLut.id);
      if (!catLut) {
        issues.push({
          level: 'warn',
          message: `Catalog missing registry LUT: ${regLut.id} (run pnpm lut:sync-catalog)`,
        });
      }
    }

    for (const pack of catalog.packs) {
      const regIds = (lutIdsByPack.get(pack.id) ?? []).sort();
      const catIds = [...pack.lutIds].sort();
      if (JSON.stringify(regIds) !== JSON.stringify(catIds)) {
        issues.push({
          level: 'error',
          message: `Pack ${pack.id} lutIds mismatch — catalog: [${catIds.join(', ')}], registry: [${regIds.join(', ')}]. Run pnpm lut:sync-catalog`,
        });
      }
    }

    for (const catLut of catalog.luts) {
      const absPath = join(REPO_ROOT, lutCubePath(catLut.id));
      if (existsSync(absPath)) {
        const parsed = parseCubeFile(readFileSync(absPath, 'utf8'));
        if (catLut.cubeSize !== parsed.size) {
          issues.push({
            level: 'error',
            message: `Catalog cubeSize ${catLut.cubeSize} !== parsed size ${parsed.size} for ${catLut.id}`,
          });
        }
      }
    }
  }

  return issues;
}

function main(): void {
  const issues = validateAll();
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warn');

  for (const issue of issues) {
    const prefix = issue.level === 'error' ? 'ERROR' : 'WARN';
    console.log(`${prefix}: ${issue.message}`);
  }

  console.log(`\nValidation: ${errors.length} error(s), ${warnings.length} warning(s)`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
