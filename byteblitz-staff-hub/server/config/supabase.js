const { createClient } = require('@supabase/supabase-js');

// Initialize a Supabase client using environment variables.
// The service role key is used to allow the API server to perform
// unrestricted reads and writes.  Never expose this key in the
// frontend; it must stay on the server only.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase URL or service key missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;