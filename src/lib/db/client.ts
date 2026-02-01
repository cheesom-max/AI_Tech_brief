import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getDbClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export async function initializeDatabase(): Promise<void> {
  // Supabase tables are created via the dashboard or migrations
  // This function is kept for compatibility but does nothing for Supabase
  console.log('Database initialization skipped - use Supabase dashboard to create tables');
}

export function resetDbClient(): void {
  supabaseClient = null;
}
