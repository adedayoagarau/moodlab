import { describe, expect, it } from 'vitest';
import { moodStore } from './store.js';

describe('moodStore', () => {
  it('creates and lists entries', () => {
    const before = moodStore.list().length;
    moodStore.create({ text: 'Test entry for the journal.' });
    expect(moodStore.list().length).toBe(before + 1);
  });
});
