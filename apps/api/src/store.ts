import { randomUUID } from 'node:crypto';
import type { CreateMoodEntryInput, MoodEntry, UpdateMoodEntryInput } from '@moodlab/shared';

const entries = new Map<string, MoodEntry>();

function seed() {
  const now = new Date().toISOString();
  const sample: MoodEntry = {
    id: randomUUID(),
    text: 'The line landed softer than I expected — relief, not regret.',
    moodTag: 'tender',
    toneNotes: 'Warm register; short sentences; emotional turn at the end.',
    createdAt: now,
    updatedAt: now,
  };
  entries.set(sample.id, sample);
}

seed();

export const moodStore = {
  list(): MoodEntry[] {
    return [...entries.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  get(id: string): MoodEntry | undefined {
    return entries.get(id);
  },

  create(input: CreateMoodEntryInput): MoodEntry {
    const now = new Date().toISOString();
    const entry: MoodEntry = {
      id: randomUUID(),
      text: input.text,
      moodTag: input.moodTag,
      toneNotes: input.toneNotes,
      createdAt: now,
      updatedAt: now,
    };
    entries.set(entry.id, entry);
    return entry;
  },

  update(id: string, input: UpdateMoodEntryInput): MoodEntry | undefined {
    const existing = entries.get(id);
    if (!existing) return undefined;

    const updated: MoodEntry = {
      ...existing,
      text: input.text ?? existing.text,
      moodTag: input.moodTag ?? existing.moodTag,
      toneNotes: input.toneNotes ?? existing.toneNotes,
      updatedAt: new Date().toISOString(),
    };
    entries.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return entries.delete(id);
  },
};
