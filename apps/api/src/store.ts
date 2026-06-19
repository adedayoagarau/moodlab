import { randomUUID } from 'node:crypto';
import type { EditProject, EditRecipe } from '@moodlab/shared';
import { DEFAULT_EDIT_RECIPE } from '@moodlab/shared';

const projects = new Map<string, EditProject>();

function seed() {
  const now = new Date().toISOString();
  const recipe: EditRecipe = {
    ...DEFAULT_EDIT_RECIPE,
    lutId: 'sunny-cover-glow',
    lutStrength: 0.78,
    adjustments: { grain: 0.12, glow: 0.18 },
  };
  const sample: EditProject = {
    id: randomUUID(),
    name: 'Sample portrait',
    sourceUri: 'asset://sample',
    recipe,
    createdAt: now,
    updatedAt: now,
  };
  projects.set(sample.id, sample);
}

seed();

export const projectStore = {
  list(): EditProject[] {
    return [...projects.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  get(id: string): EditProject | undefined {
    return projects.get(id);
  },

  create(input: { name: string; sourceUri: string; recipe?: EditRecipe }): EditProject {
    const now = new Date().toISOString();
    const project: EditProject = {
      id: randomUUID(),
      name: input.name,
      sourceUri: input.sourceUri,
      recipe: input.recipe ?? { ...DEFAULT_EDIT_RECIPE },
      createdAt: now,
      updatedAt: now,
    };
    projects.set(project.id, project);
    return project;
  },

  update(id: string, patch: Partial<Pick<EditProject, 'name' | 'recipe' | 'thumbnailUri'>>): EditProject | undefined {
    const existing = projects.get(id);
    if (!existing) return undefined;
    const updated: EditProject = {
      ...existing,
      ...patch,
      recipe: patch.recipe ?? existing.recipe,
      updatedAt: new Date().toISOString(),
    };
    projects.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return projects.delete(id);
  },
};
