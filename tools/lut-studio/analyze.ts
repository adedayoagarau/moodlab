#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCubeFile } from '../../packages/lut-engine/src/index.js';
import { rgbToHsv } from './color-math.js';
import { getRegistryLut, loadRegistry } from './load-registry.js';
import { lutCubePath, REPO_ROOT } from './types.js';
import type { RecommendedEffects, SkinProtection } from './types.js';

function parseArgs(): { id?: string } {
  const args = process.argv.slice(2);
  let id: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) id = args[++i];
  }
  return { id };
}

function sampleCubeStats(cubePath: string): {
  avgSaturation: number;
  avgWarmth: number;
  avgLuma: number;
} {
  const text = readFileSync(cubePath, 'utf8');
  const parsed = parseCubeFile(text);
  let satSum = 0;
  let warmSum = 0;
  let lumaSum = 0;
  const n = parsed.data.length / 3;

  for (let i = 0; i < parsed.data.length; i += 3) {
    const r = parsed.data[i]!;
    const g = parsed.data[i + 1]!;
    const b = parsed.data[i + 2]!;
    const [, s] = rgbToHsv(r, g, b);
    satSum += s;
    warmSum += r - b;
    lumaSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  return {
    avgSaturation: satSum / n,
    avgWarmth: warmSum / n,
    avgLuma: lumaSum / n,
  };
}

function inferSkinProtection(categories: string[], avgWarmth: number): SkinProtection {
  if (categories.includes('Portrait') || categories.includes('Music Cover')) {
    return avgWarmth > 0.05 ? 'high' : 'medium';
  }
  return 'medium';
}

function inferRecommendedEffects(
  categories: string[],
  avgSaturation: number,
): RecommendedEffects | undefined {
  const effects: RecommendedEffects = {};
  if (categories.includes('Film')) effects.grain = 0.15;
  if (categories.includes('Dark') || categories.includes('Cinematic')) effects.vignette = 0.15;
  if (categories.includes('Sunny') || categories.includes('Music Cover')) effects.glow = 0.12;
  if (categories.includes('Streetwear') || categories.includes('Viral')) effects.sharpen = 0.08;
  if (avgSaturation < 0.15 && categories.includes('Black and White')) {
    effects.grain = 0.12;
  }
  return Object.keys(effects).length > 0 ? effects : undefined;
}

function inferDefaultStrength(categories: string[]): number {
  if (categories.includes('Black and White')) return 0.85;
  if (categories.includes('Dark') || categories.includes('Cinematic')) return 0.78;
  if (categories.includes('Portrait')) return 0.72;
  return 0.75;
}

function analyzeLut(id: string): void {
  const registry = loadRegistry();
  const lut = getRegistryLut(id, registry);
  const cubePath = join(REPO_ROOT, lutCubePath(id));
  const stats = sampleCubeStats(cubePath);

  const suggested = {
    defaultStrength: inferDefaultStrength(lut.categories),
    skinProtectionDefault: inferSkinProtection(lut.categories, stats.avgWarmth),
    recommendedEffects: inferRecommendedEffects(lut.categories, stats.avgSaturation),
  };

  console.log(`Analysis: ${id}`);
  console.log(`  Cube stats: avgSat=${stats.avgSaturation.toFixed(3)}, avgWarmth=${stats.avgWarmth.toFixed(3)}, avgLuma=${stats.avgLuma.toFixed(3)}`);
  console.log(`  Current metadata:`, JSON.stringify(lut.metadata, null, 2));
  console.log(`  Suggested metadata:`, JSON.stringify(suggested, null, 2));
}

function main(): void {
  const { id } = parseArgs();
  const registry = loadRegistry();
  const targets = id ? [id] : registry.luts.map((l) => l.id);

  for (const lutId of targets) {
    analyzeLut(lutId);
    console.log('');
  }
}

main();
