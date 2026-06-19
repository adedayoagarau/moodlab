import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EditProject, EditRecipe } from '@moodlab/shared';

const STORAGE_KEY = 'moodlab:local-projects';

export type LocalProject = EditProject;

function nowIso() {
  return new Date().toISOString();
}

export async function loadLocalProjects(): Promise<LocalProject[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalProject[];
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch {
    return [];
  }
}

async function persist(projects: LocalProject[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export async function saveLocalProject(input: {
  id?: string;
  name: string;
  sourceUri: string;
  recipe: EditRecipe;
}): Promise<LocalProject> {
  const projects = await loadLocalProjects();
  const ts = nowIso();
  const existing = input.id ? projects.find((p) => p.id === input.id) : undefined;

  const project: LocalProject = existing
    ? { ...existing, name: input.name, sourceUri: input.sourceUri, recipe: input.recipe, updatedAt: ts }
    : {
        id: input.id ?? `local-${Date.now()}`,
        name: input.name,
        sourceUri: input.sourceUri,
        recipe: input.recipe,
        createdAt: ts,
        updatedAt: ts,
      };

  const next = existing
    ? projects.map((p) => (p.id === project.id ? project : p))
    : [project, ...projects];

  await persist(next.slice(0, 50));
  return project;
}

export async function deleteLocalProject(id: string): Promise<void> {
  const projects = await loadLocalProjects();
  await persist(projects.filter((p) => p.id !== id));
}
