import { createClient } from '@supabase/supabase-js';

// SERVER-SIDE ONLY — never import in client components

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for the Supabase admin client.');
}

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required for the Supabase admin client.');
}

export const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
