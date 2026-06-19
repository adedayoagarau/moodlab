import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { EditRecipe } from '@moodlab/shared';
import { DEFAULT_EDIT_RECIPE } from '@moodlab/shared';
import {
  getLut,
  getLuts,
  getLutsForPack,
  getPack,
  getPacks,
  getPresetManifest,
} from './catalog.js';
import { projectStore } from './store.js';

const app = new Hono();
const port = Number(process.env.PORT ?? 8787);
const version = '0.2.0';

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

app.get('/api/v1/packs', (c) => c.json({ data: getPacks() }));

app.get('/api/v1/packs/:id', (c) => {
  const pack = getPack(c.req.param('id'));
  if (!pack) return c.json({ error: 'Pack not found' }, 404);
  return c.json({ data: { pack, luts: getLutsForPack(pack.id) } });
});

app.get('/api/v1/luts', (c) => c.json({ data: getLuts() }));

app.get('/api/v1/luts/:id', (c) => {
  const lut = getLut(c.req.param('id'));
  if (!lut) return c.json({ error: 'LUT not found' }, 404);
  return c.json({ data: lut });
});

app.get('/api/v1/manifest', (c) => c.json({ data: getPresetManifest() }));

app.get('/api/v1/projects', (c) => c.json({ data: projectStore.list() }));

app.get('/api/v1/projects/:id', (c) => {
  const project = projectStore.get(c.req.param('id'));
  if (!project) return c.json({ error: 'Project not found' }, 404);
  return c.json({ data: project });
});

app.post('/api/v1/projects', async (c) => {
  const body = await c.req.json().catch(() => null) as {
    name?: string;
    sourceUri?: string;
    recipe?: EditRecipe;
  } | null;

  if (!body?.name || !body?.sourceUri) {
    return c.json({ error: 'name and sourceUri are required' }, 400);
  }

  const project = projectStore.create({
    name: body.name,
    sourceUri: body.sourceUri,
    recipe: body.recipe ?? DEFAULT_EDIT_RECIPE,
  });
  return c.json({ data: project }, 201);
});

app.patch('/api/v1/projects/:id', async (c) => {
  const body = await c.req.json().catch(() => null) as Partial<{
    name: string;
    recipe: EditRecipe;
    thumbnailUri: string;
  }> | null;

  if (!body) return c.json({ error: 'Body required' }, 400);

  const project = projectStore.update(c.req.param('id'), body);
  if (!project) return c.json({ error: 'Project not found' }, 404);
  return c.json({ data: project });
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`MoodLab API listening on http://localhost:${info.port}`);
});
