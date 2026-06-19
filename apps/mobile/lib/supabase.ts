import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

import type { EditProject } from '@moodlab/shared';

const url =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  (Constants.expoConfig?.extra?.supabaseUrl as string | undefined);
const anonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined);

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(url!, anonKey!);
  }
  return client;
}

/** Mirror edit project to Supabase when configured (table: edit_projects). */
export async function syncProjectToSupabase(project: EditProject): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from('edit_projects').upsert({
    id: project.id,
    name: project.name,
    source_uri: project.sourceUri,
    thumbnail_uri: project.thumbnailUri,
    recipe_json: project.recipe,
    updated_at: project.updatedAt,
  });

  return !error;
}
