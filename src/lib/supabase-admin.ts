import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// This key MUST stay on the server. Never prefix with NEXT_PUBLIC_
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  if (typeof window === 'undefined') {
    console.warn("Supabase Admin credentials missing. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment.");
  }
}

/**
 * Supabase client for server-side operations.
 * Bypasses Row Level Security (RLS).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
