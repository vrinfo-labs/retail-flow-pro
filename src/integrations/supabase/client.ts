import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// IMPORTANT: These are not real secrets, they are just the default public keys for a Supabase project
const supabaseUrl = 'https://zmknswejgdcbsbmgcsde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpta25zd2VqZ2RjYnNibWdjc2RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzg3NDgwNCwiZXhwIjoyMDgzNDUwODA0fQ.x80VWhdF52lLKyoTBeNc7TJajjAvLCt7qfg3gL9-Aks';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);