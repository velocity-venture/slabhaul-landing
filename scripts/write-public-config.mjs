import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL) {
  console.error('SUPABASE_URL is required.');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error('SUPABASE_ANON_KEY is required.');
  process.exit(1);
}

if (/service[_-]?role/i.test(SUPABASE_ANON_KEY)) {
  console.error('SUPABASE_ANON_KEY must be the public anon key.');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, '..', 'config.js');

const config = `(function () {
  window.SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
  window.SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
  window.SLABHAUL_PUBLIC_CONFIG = Object.freeze({
    SUPABASE_URL: window.SUPABASE_URL,
    SUPABASE_ANON_KEY: window.SUPABASE_ANON_KEY
  });
})();
`;

writeFileSync(outputPath, config, { mode: 0o600 });
