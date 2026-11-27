import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const { CF_PAGES, CF_PAGES_BRANCH } = process.env;
let { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

// Cloudflare Pages builds every branch. The public Supabase values are
// saved for the production environment only, so a preview build (any
// branch other than main) used to stop here and the pull request check
// failed. A preview without the values now builds with sign-in turned
// off: the page shows its own "not configured" state. The production
// build still stops if a value is missing, so a site with broken sign-in
// can never be published.
const PRODUCTION_BRANCH = 'main';
const isPagesPreview =
  CF_PAGES === '1' && Boolean(CF_PAGES_BRANCH) && CF_PAGES_BRANCH !== PRODUCTION_BRANCH;

if (isPagesPreview && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    `Preview build for "${CF_PAGES_BRANCH}": public Supabase values are not set ` +
      'for the preview environment. Building with sign-in turned off.'
  );
  SUPABASE_URL = '';
  SUPABASE_ANON_KEY = '';
} else if (!SUPABASE_URL) {
  console.error('SUPABASE_URL is required.');
  process.exit(1);
}

if (!isPagesPreview && !SUPABASE_ANON_KEY) {
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
