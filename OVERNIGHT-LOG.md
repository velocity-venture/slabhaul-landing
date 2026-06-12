# Overnight Build Session Log

## Track D Session, 2026-04-28

**Branch:** `feature/d-truthfulness`
**Mission track:** D. Marketing truthfulness and auth handoff

### What shipped

- F03: Replaced live App Store and Google Play claims with beta-truthful CTAs.
- F15: Removed token-fragment handoff from the landing login flow. Email login and OAuth now point to `https://slabhaulapp.com/auth/callback`.
- F18: Replaced paid pricing tiles with one beta pricing card: `Free during beta. Founding Angler pricing coming soon.`
- F20: Removed the Tournament Mode marketing section. Daily knowledge and voice claims are labeled as roadmap items.
- F25: Replaced runtime Tailwind CDN with a Tailwind CLI build pipeline and committed the compiled CSS.
- Added `/delete-account` footer parity through `delete-account.html` and `_redirects`.

### Starting and ending finding counts

- Starting in-scope findings: 5, F03, F15, F18, F20, F25.
- Ending in-scope findings: 0 open in this repo.

### Test evidence

- `npm run build`: passed.
- `npm run check`: passed.
- Claim scan: no `App Store`, `Google Play`, paid-price drift, token fragments, runtime Tailwind CDN, or Tournament Mode marketing text in landing surfaces.
- Token-fragment regression scan: landing HTML points to `https://slabhaulapp.com/auth/callback` and contains no `access_token=`, `refresh_token=`, or `#access_token`.
- Production header check: `curl -sI https://slabhaul.ai/` returned HTTP 200.

### Lighthouse evidence

- Before, production mobile at `https://slabhaul.ai/`: performance 66.
- Before, production desktop at `https://slabhaul.ai/`: performance 77.
- After, local branch mobile at `http://127.0.0.1:4173/`: performance 69.
- After, local branch desktop at `http://127.0.0.1:4173/`: performance 80.

### Deferred findings

- F01, F06, F13, F17, and F21 remain deferred to Track C.
- F04 and F14 remain deferred to Track E.
- F07, F09, and F16 remain deferred to Track F.
- F08 iOS universal links remain deferred to Track B.

### Blockers

- Live after-score Lighthouse on `https://slabhaul.ai/` requires this branch to deploy. Local after-score was recorded for this PR.
- Real Play Console and TestFlight URLs are not available yet, so beta CTAs use mailto waitlist placeholders.

### Suggested next mission

- Track E. Data coverage and importer.
