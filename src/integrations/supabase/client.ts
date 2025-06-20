
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Check if the Supabase URL and key are available
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pmegtynmywosnjtlieyf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWd0eW5teXdvc25qdGxpZXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMTk3ODEsImV4cCI6MjA1MzU5NTc4MX0.aFxMFxEiG3VnS_iwPcflYOtlBkVvsl1y5Zly8YkhXts";

// Warn if environment variables are not set (in development only)
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('VITE_SUPABASE_URL not set, using fallback value. Set this variable in your .env file.');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('VITE_SUPABASE_ANON_KEY not set, using fallback value. Set this variable in your .env file.');
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
