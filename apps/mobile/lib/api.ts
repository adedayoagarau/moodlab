import type { CreateMoodEntryInput, MoodEntry, MoodTag } from '@moodlab/shared';
import { API_BASE_URL } from './config';

type ApiListResponse = { data: MoodEntry[] };
type ApiItemResponse = { data: MoodEntry };
type ApiErrorResponse = { error: string };

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    const err = payload as ApiErrorResponse;
    throw new Error(err.error ?? `Request failed (${response.status})`);
  }
  return payload as T;
}

export async function fetchMoodEntries(): Promise<MoodEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/moods`);
  const body = await parseJson<ApiListResponse>(response);
  return body.data;
}

export async function createMoodEntry(input: CreateMoodEntryInput): Promise<MoodEntry> {
  const response = await fetch(`${API_BASE_URL}/api/v1/moods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await parseJson<ApiItemResponse>(response);
  return body.data;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export const moodTagLabels: Record<MoodTag, string> = {
  calm: 'Calm',
  joyful: 'Joyful',
  anxious: 'Anxious',
  melancholy: 'Melancholy',
  energized: 'Energized',
  tender: 'Tender',
  frustrated: 'Frustrated',
  hopeful: 'Hopeful',
};
