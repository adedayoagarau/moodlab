#!/usr/bin/env tsx
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LutDefinition, LutPack } from '../../packages/shared/src/index.js';
import { loadRegistry } from './load-registry.js';
import { DEFAULT_CUBE_SIZE, lutCubePath, REPO_ROOT } from './types.js';

function main(): void {
  const registry = loadRegistry();

  const lutIdsByPack = new Map<string, string[]>();
  for (const lut of registry.luts) {
    const list = lutIdsByPack.get(lut.packId) ?? [];
    list.push(lut.id);
    lutIdsByPack.set(lut.packId, list);
  }

  const packs: LutPack[] = registry.packs.map((pack) => ({
    id: pack.id,
    name: pack.name,
    description: pack.description,
    categories: pack.categories as LutPack['categories'],
    plan: pack.plan,
    coverColor: pack.coverColor,
    lutIds: (lutIdsByPack.get(pack.id) ?? []).sort(),
  }));

  const luts: LutDefinition[] = registry.luts.map((lut) => {
    const entry: LutDefinition = {
      id: lut.id,
      name: lut.name,
      packId: lut.packId,
      categories: lut.categories,
      file: lutCubePath(lut.id),
      cubeSize: DEFAULT_CUBE_SIZE,
      defaultStrength: lut.metadata.defaultStrength,
      skinProtectionDefault: lut.metadata.skinProtectionDefault,
      plan: lut.plan,
    };
    if (lut.metadata.recommendedEffects) {
      entry.recommendedEffects = lut.metadata.recommendedEffects;
    }
    if (lut.tags?.length) {
      entry.tags = lut.tags;
    }
    return entry;
  });

  const catalog = { packs, luts };
  const outPath = join(REPO_ROOT, 'data/lut_catalog.json');
  writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`Synced ${luts.length} LUT(s) and ${packs.length} pack(s) → data/lut_catalog.json`);

  for (const pack of packs) {
    console.log(`  ${pack.id}: [${pack.lutIds.join(', ')}]`);
  }
}

main();
