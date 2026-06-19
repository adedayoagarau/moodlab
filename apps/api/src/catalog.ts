import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LutDefinition, LutPack } from '@moodlab/shared';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const catalogPath = join(root, 'data', 'lut_catalog.json');
const manifestPath = join(root, 'data', 'preset_manifest.json');

type CatalogFile = { packs: LutPack[]; luts: LutDefinition[] };

let catalogCache: CatalogFile | null = null;

function loadCatalog(): CatalogFile {
  if (!catalogCache) {
    catalogCache = JSON.parse(readFileSync(catalogPath, 'utf-8')) as CatalogFile;
  }
  return catalogCache;
}

export function getPacks(): LutPack[] {
  return loadCatalog().packs;
}

export function getPack(id: string): LutPack | undefined {
  return getPacks().find((p) => p.id === id);
}

export function getLuts(): LutDefinition[] {
  return loadCatalog().luts;
}

export function getLut(id: string): LutDefinition | undefined {
  return getLuts().find((l) => l.id === id);
}

export function getLutCubePath(lut: LutDefinition): string {
  return join(root, lut.file);
}

export function readLutCubeContent(id: string): string | undefined {
  const lut = getLut(id);
  if (!lut) return undefined;
  const path = getLutCubePath(lut);
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return undefined;
  }
}

export function getLutsForPack(packId: string): LutDefinition[] {
  return getLuts().filter((l) => l.packId === packId);
}

export function getPresetManifest() {
  return JSON.parse(readFileSync(manifestPath, 'utf-8'));
}
