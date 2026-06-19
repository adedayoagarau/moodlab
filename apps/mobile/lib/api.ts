import type {
  EditProject,
  EditRecipe,
  LutDefinition,
  LutPack,
} from '@moodlab/shared';
import { API_BASE_URL } from './config';

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    const err = payload as { error?: string };
    throw new Error(err.error ?? `Request failed (${response.status})`);
  }
  return payload as T;
}

export async function fetchPacks(): Promise<LutPack[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/packs`);
  const body = await parseJson<{ data: LutPack[] }>(res);
  return body.data;
}

export async function fetchLuts(): Promise<LutDefinition[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/luts`);
  const body = await parseJson<{ data: LutDefinition[] }>(res);
  return body.data;
}

export async function fetchManifest(): Promise<{
  beautyPresets: { id: string; name: string; plan: string }[];
  textTemplates: { id: string; label: string; text: string }[];
  buildMyPost: { id: string; title: string; subtitle: string }[];
}> {
  const res = await fetch(`${API_BASE_URL}/api/v1/manifest`);
  const body = await parseJson<{ data: Record<string, unknown> }>(res);
  return body.data as {
    beautyPresets: { id: string; name: string; plan: string }[];
    textTemplates: { id: string; label: string; text: string }[];
    buildMyPost: { id: string; title: string; subtitle: string }[];
  };
}

export async function fetchProjects(): Promise<EditProject[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/projects`);
  const body = await parseJson<{ data: EditProject[] }>(res);
  return body.data;
}

export async function saveProject(input: {
  name: string;
  sourceUri: string;
  recipe: EditRecipe;
}): Promise<EditProject> {
  const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await parseJson<{ data: EditProject }>(res);
  return body.data;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
