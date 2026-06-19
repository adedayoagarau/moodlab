import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import {
  type CreateMoodEntryInput,
  type MoodEntry,
  type UpdateMoodEntryInput,
  validateCreateMoodEntry,
} from '@moodlab/shared';
import { moodStore } from './store.js';

const app = new Hono();

const port = Number(process.env.PORT ?? 8787);
const version = '0.1.0';

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.get('/health', (c) =>
  c.json({ status: 'ok', service: 'moodlab-api', version }),
);

app.get('/api/v1/moods', (c) => {
  const entries = moodStore.list();
  return c.json({ data: entries });
});

app.get('/api/v1/moods/:id', (c) => {
  const entry = moodStore.get(c.req.param('id'));
  if (!entry) {
    return c.json({ error: 'Mood entry not found' }, 404);
  }
  return c.json({ data: entry });
});

app.post('/api/v1/moods', async (c) => {
  const body = await c.req.json().catch(() => null);
  const validated = validateCreateMoodEntry(body);

  if (typeof validated === 'string') {
    return c.json({ error: validated }, 400);
  }

  const entry = moodStore.create(validated);
  return c.json({ data: entry }, 201);
});

app.patch('/api/v1/moods/:id', async (c) => {
  const body = (await c.req.json().catch(() => null)) as UpdateMoodEntryInput | null;
  if (!body || typeof body !== 'object') {
    return c.json({ error: 'Body must be a JSON object' }, 400);
  }

  const entry = moodStore.update(c.req.param('id'), body);
  if (!entry) {
    return c.json({ error: 'Mood entry not found' }, 404);
  }
  return c.json({ data: entry });
});

app.delete('/api/v1/moods/:id', (c) => {
  const removed = moodStore.delete(c.req.param('id'));
  if (!removed) {
    return c.json({ error: 'Mood entry not found' }, 404);
  }
  return c.json({ data: { id: c.req.param('id') } });
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`MoodLab API listening on http://localhost:${info.port}`);
});

export type { CreateMoodEntryInput, MoodEntry };
