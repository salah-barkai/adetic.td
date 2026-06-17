import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const start = Date.now();
(async () => {
  const { data, error } = await supabase
    .from('actualites')
    .select('*')
    .order('id', { ascending: false });

  const elapsed = Date.now() - start;
  console.log('elapsed_ms:', elapsed);
  if (error) {
    console.error('fetch error:', error);
    process.exit(1);
  }
  console.log('items:', data?.length);
  console.log(JSON.stringify(data, null, 2));
})();