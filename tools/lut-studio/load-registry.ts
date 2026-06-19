import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { LutRegistry } from './types.js';
import { REPO_ROOT } from './types.js';

const REGISTRY_PATH = join(REPO_ROOT, 'data/lut_registry.yaml');

export function loadRegistry(path = REGISTRY_PATH): LutRegistry {
  const raw = readFileSync(path, 'utf8');
  const parsed = parseYaml(raw) as LutRegistry;
  if (!parsed.packs?.length || !parsed.luts?.length) {
    throw new Error('Invalid lut_registry.yaml: missing packs or luts');
  }
  return parsed;
}

export function getRegistryLut(id: string, registry = loadRegistry()) {
  const lut = registry.luts.find((l) => l.id === id);
  if (!lut) throw new Error(`LUT not found in registry: ${id}`);
  return lut;
}
