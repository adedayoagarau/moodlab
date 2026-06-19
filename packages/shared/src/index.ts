/** Shared contracts between MoodLab mobile app and API */

export const MOOD_TAGS = [
  'calm',
  'joyful',
  'anxious',
  'melancholy',
  'energized',
  'tender',
  'frustrated',
  'hopeful',
] as const;

export type MoodTag = (typeof MOOD_TAGS)[number];

export type MoodEntry = {
  id: string;
  text: string;
  moodTag?: MoodTag;
  toneNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMoodEntryInput = {
  text: string;
  moodTag?: MoodTag;
  toneNotes?: string;
};

export type UpdateMoodEntryInput = {
  text?: string;
  moodTag?: MoodTag;
  toneNotes?: string;
};

export type ApiHealth = {
  status: 'ok';
  service: 'moodlab-api';
  version: string;
};

export type ApiError = {
  error: string;
  details?: unknown;
};

export function isMoodTag(value: string): value is MoodTag {
  return (MOOD_TAGS as readonly string[]).includes(value);
}

export { validateCreateMoodEntry } from './validation';
