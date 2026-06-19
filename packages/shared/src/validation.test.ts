import { describe, expect, it } from 'vitest';
import { validateCreateMoodEntry } from './validation';

describe('validateCreateMoodEntry', () => {
  it('accepts valid input', () => {
    const result = validateCreateMoodEntry({ text: 'A quiet morning.', moodTag: 'calm' });
    expect(result).toEqual({ text: 'A quiet morning.', moodTag: 'calm' });
  });

  it('rejects empty text', () => {
    expect(validateCreateMoodEntry({ text: '' })).toBe('text is required and must be a non-empty string');
  });

  it('rejects invalid mood tag', () => {
    expect(validateCreateMoodEntry({ text: 'hello', moodTag: 'angry' })).toContain('moodTag');
  });
});
