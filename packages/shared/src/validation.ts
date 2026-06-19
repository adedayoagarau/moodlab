import { MOOD_TAGS, type CreateMoodEntryInput, type MoodTag } from './index';

const MAX_TEXT_LENGTH = 4000;
const MAX_TONE_NOTES_LENGTH = 500;

export function validateCreateMoodEntry(body: unknown): CreateMoodEntryInput | string {
  if (!body || typeof body !== 'object') {
    return 'Body must be a JSON object';
  }

  const record = body as Record<string, unknown>;
  const text = record.text;

  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'text is required and must be a non-empty string';
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return `text must be at most ${MAX_TEXT_LENGTH} characters`;
  }

  const result: CreateMoodEntryInput = { text: text.trim() };

  if (record.moodTag !== undefined) {
    if (typeof record.moodTag !== 'string' || !MOOD_TAGS.includes(record.moodTag as MoodTag)) {
      return `moodTag must be one of: ${MOOD_TAGS.join(', ')}`;
    }
    result.moodTag = record.moodTag as MoodTag;
  }

  if (record.toneNotes !== undefined) {
    if (typeof record.toneNotes !== 'string') {
      return 'toneNotes must be a string';
    }
    if (record.toneNotes.length > MAX_TONE_NOTES_LENGTH) {
      return `toneNotes must be at most ${MAX_TONE_NOTES_LENGTH} characters`;
    }
    result.toneNotes = record.toneNotes.trim();
  }

  return result;
}
