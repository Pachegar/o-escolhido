
import { createClient } from '@supabase/supabase-js';

// Estas são credenciais de exemplo - você precisa substituir pelas suas próprias
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuenFxb3p6dHJkdmN3ZWl6a3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MzU4MjAsImV4cCI6MjA1MDMxMTgyMH0.example-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
