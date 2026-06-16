# AR-13B Cloudflare Public Config Redeploy

This documentation-only commit intentionally triggers a Cloudflare Pages
production rebuild for `slabhaul.ai`.

Cloudflare Pages production settings were already saved before this commit:

- Project: `slabhaul-landing`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `.`

The rebuild should use the saved public Supabase build environment variables
to generate `/config.js` during the production site build. Do not place public
key values, service-role keys, auth links, auth codes, session data, or URL
fragments in this file.

After deployment, verify:

1. `https://slabhaul.ai/config.js` returns JavaScript, not 404 or fallback
   HTML.
2. The public Supabase config is present and does not contain a service-role
   key.
3. The landing login initializes Supabase and no longer stalls because
   `SUPABASE_URL` or `_supabase` is undefined.
