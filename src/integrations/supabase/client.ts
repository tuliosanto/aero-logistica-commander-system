// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nxpjuvaifiiwbguqrydm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cGp1dmFpZmlpd2JndXFyeWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzA2MTAsImV4cCI6MjA2NDI0NjYxMH0.nPgluKuUqfQU64a3mts9er8lkVCTCP4hy_prKSGVAB4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);