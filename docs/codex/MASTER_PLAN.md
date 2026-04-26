# SlabHaul Codex Master Plan

Version: 1.0
Date: 2026-04-26
Owner: M.O. Eckel III
Source audit: `AUDIT.md` (Codex production-readiness audit, 2026-04-26)

This document is the strategic plan that translates the 25 audit findings into seven sequenced engineering tracks, each shippable as one or more pull requests. Read `AGENTS.md` first for house rules. Read this second for sequencing and definitions of done. Read `AUDIT.md` for finding-level detail.

---

## 1. Locked decisions

These were resolved by the owner before track work begins. They are not open for re-litigation in any track.

### 1.1 Pricing
- Monthly: $8.99
- Annual: $59.99
- Free trial: 7 days
- Founding Angler tier: deferred. Do not scaffold.
- This pricing must appear identically in: the in-app paywall, `SUBSCRIPTION.md`, the landing page, `paywall_gate.dart`, RevenueCat product config (when introduced), and any marketing surface.

### 1.2 First launch posture
- **Android: open beta, free during beta.** No paywall enforcement at first promotion. RevenueCat does not have to ship before Android beta promotion.
- **iOS: TestFlight, then App Store.** Comes after Android beta is stable.
- **Paid launch (RevenueCat live, real entitlement enforcement): deferred 30 to 60 days** from Android beta promotion.
- This means Track A and Track D ship before Track C. Marketing copy must say "Free during beta," not advertise paid pricing as live, until Track C completes.

### 1.3 Tournament Mode
- Parked for a later version.
- The current local SharedPreferences toggle remains in the codebase as a quiet AI-off mode.
- All marketing claims of "tournament-legal," "tournament-verified," or similar are removed from `slabhaul-landing` and from in-app copy as part of Track D.
- A future, properly architected Tournament Mode (signed sessions, director QR verification, backend audit, Edge Function lockdown) is on the long-term roadmap. Do not start it until explicitly scoped.

### 1.4 Lake ID canonicalization
- Lake registry IDs are the canonical form (e.g. `reelfoot`, not `reelfoot_lake_tn`).
- The attractor JSON's `lake_id` field must match the registry. Any mismatch is a bug.
- This normalization happens in Track G.

### 1.5 Domain split
- Marketing: `slabhaul.ai` (slabhaul-landing repo, Cloudflare Pages).
- App: `slabhaulapp.com` (Flutter web build, OAuth/deep-link target).
- Auth handoff between the two must use Supabase PKCE or a one-time exchange code. Token-fragment forwarding is removed in Track D.

---

## 2. Brand and copy invariants

These are referenced by Track D and any future copy edits.

- Tone: angler-to-angler, direct, energetic, plain-spoken.
- The promise: SlabHaul is the most complete crappie-specific companion. Public attractor scale, Match-the-Hatch rigor, spider rig calculator, lake conditions, AI guide.
- Counter-position vs Deep Dive: crappie-specific depth, lower price, real public attractor data growth, offline field resilience.
- Claims that must currently be removed or softened until code supports them:
  - "Available on App Store and Google Play" until the listings are actually live.
  - Any tournament-legal claim.
  - "Nightly knowledge updates" until the ingestion pipeline exists.
  - "Uncle Slab voice narration" until ElevenLabs is wired.
  - Any pricing other than $8.99/$59.99 with 7-day trial. During the free-during-beta window, replace pricing tiles with "Free during beta. Founding Angler pricing coming soon."

---

## 3. Track sequence

Tracks run sequentially, not in parallel. Each track is one focused mission for Codex. The dependency reasons are noted because Codex needs to understand why the order matters.

| # | Track | Findings in scope | Why this position |
|---|---|---|---|
| 1 | **G. Foundation and maintainability** | F02, F11, F19, F22, F23, F24, lake ID normalization for F04 | Clean build/test must work before any other track is even safely measurable. Also fixes a runtime crash (F19) and the schema risk (F23). |
| 2 | **A. Android open beta readiness** | F11 (release signing), Android deep links / assetlinks, Play signing docs, smoke tests | Smallest scope to a real shippable artifact. Unblocks distribution and gives the user real testers. |
| 3 | **D. Marketing truthfulness and auth handoff** | F03, F15, F18, F20, F25 | Pure copy plus a token-fragment fix. Cheap. Removes credibility and security risk. Must precede paid launch so the landing page is honest about beta status. |
| 4 | **E. Data coverage and importer** | F04 (post-normalization), F14 | The Deep Dive differentiator. Build the importer once, then ingest forever. Independent of paid launch. |
| 5 | **F. Offline resilience** | F07, F09, F16 | Critical for "on the water" credibility. Trip log durable storage (F09) becomes table-stakes once paid is live. |
| 6 | **C. Paid launch (RevenueCat)** | F01, F06, F13, F17, F21 | The revenue unlock. Comes after foundation, beta distribution, and durable storage are proven. Includes the LLM/entitlement hardening because they are coupled to the paid surface. |
| 7 | **B. iOS TestFlight and App Store** | F08, plus Apple-side StoreKit/RevenueCat config and SIWA verification | Last because iOS deserves a stable Android-proven foundation under it. |

Track G's networking consolidation (F10) is allowed to slot into whichever later track most needs it. It is not its own mission.

---

## 4. Definitions of done per track

Codex must hit every numbered item before claiming a track complete. PR descriptions must show evidence for each.

### Track G. Foundation and maintainability
1. `flutter pub get && flutter analyze && flutter test` succeed from a clean checkout with no `.env` file present.
2. `.env` is removed from `pubspec.yaml` assets. dotenv loads optionally.
3. Android release build fails fast with a clear error message when keystore properties are missing. Debug fallback removed.
4. The `null!` crash in `fishing_details_screen.dart` (F19) is fixed without changing the user-facing flow.
5. Stale setup scripts (F22) are deleted or rewritten. A single `docs/release/android.md` exists. iOS doc may stub out, but no contradicting old docs remain.
6. `tournaments.lake_id` schema mismatch (F23) is corrected via a new migration. Tested against current data.
7. AI provider disabled-state copy (F24) renders provider-specific guidance.
8. Lake ID normalization: `attractors.json` `lake_id` values match the lake registry. A unit test asserts referential integrity for the bundled JSON.
9. Analyzer issue count baseline established and recorded in `OVERNIGHT-LOG.md`. Future tracks may not exceed it.
10. CI job runs `flutter analyze` and `flutter test` on every PR.

### Track A. Android open beta readiness
1. Release AAB builds with the upload keystore. Build fails without it. Documented in `docs/release/android.md`.
2. `assetlinks.json` is published at `https://slabhaulapp.com/.well-known/assetlinks.json` and verified by Play Console.
3. Deep-link smoke test: tapping a Supabase magic-link email on a clean Android device opens the app to the correct authenticated state.
4. Play Data Safety form answers drafted as `docs/release/android-data-safety.md`. Owner reviews before submission.
5. Internal-testing track AAB uploaded successfully. Internal-to-open promotion checklist documented but not executed (owner decision).
6. Release smoke tests checklist in `docs/release/android-smoke.md`.

### Track D. Marketing truthfulness and auth handoff
1. Landing CTAs no longer claim live App Store / Google Play availability. They say "Join Android beta" and "Join TestFlight waitlist" until listings are live.
2. Pricing on landing matches AGENTS.md locked pricing or shows "Free during beta. Founding Angler pricing coming soon." Single source of truth for price strings, ideally a `config.js` or build-time injection, so a future change is one edit.
3. All tournament-legal marketing claims removed from landing and in-app copy.
4. "Nightly knowledge updates" and "Uncle Slab voice" claims either removed or softened to roadmap language until the implementations exist.
5. Auth handoff from `slabhaul.ai` to `slabhaulapp.com` no longer forwards `access_token` or `refresh_token` in URL fragments. Replaced with Supabase PKCE redirect to `/auth/callback` or a one-time exchange code.
6. Deletion request link parity: `/delete-account` reachable from the landing footer.
7. Tailwind CDN replaced with built CSS, or pinned with SRI. Lighthouse performance score recorded.

### Track E. Data coverage and importer
1. `tools/attractors/import_state_feed.dart` exists and ingests at least one state DNR feed end to end.
2. `tools/attractors/sources.yaml` registers source URLs, formats, licensing, and last-pulled timestamps.
3. GPX, CSV, and KML parsers normalize to the `Attractor` schema.
4. Duplicate-radius dedupe (configurable, default ~10m) implemented and tested with fixtures.
5. CI fixture test confirms the importer produces stable output for a frozen input fixture.
6. Coverage report generator emits per-state counts and writes `docs/data/attractor-coverage.md`.
7. At least one new state's worth of attractors is merged. The README claim of "36 lakes with initial data for 3" is updated to truth.

### Track F. Offline resilience
1. Weather, lake-level, wind, tides, and streamflow services persist last-known responses with timestamps. Stale-badge UI shown when a cached response is served.
2. Trip log migrates from SharedPreferences JSON to local SQLite (Drift recommended) with a one-way migration path. Existing on-device data survives upgrade.
3. Supabase sync tables for trips/catches scaffolded but **not enforced as Pro-only** until Track C. Free users get local-only; the cloud sync columns exist but are gated by entitlement when Track C lands.
4. Map: at least one lake supports offline tile pack download (proof of concept). Storage limit and clear-cache UX implemented.
5. Offline-status banner appears in app shell when the device is offline.

### Track C. Paid launch (RevenueCat)
1. `purchases_flutter` integrated. `RevenueCatSubscriptionService` implements purchase, restore, entitlement refresh, customer-info stream, and offline grace period.
2. RevenueCat dashboard configured with monthly ($8.99) and annual ($59.99) products, 7-day intro trial. Product IDs documented.
3. RevenueCat webhook to a Supabase Edge Function mirrors customer info into the `subscriptions` table.
4. AI proxy Edge Function checks `has_active_subscription(user.id)` before forwarding any LLM call. Denied attempts logged.
5. `FeatureEntitlement` enum is the single source of truth for free/Pro feature boundaries. All route gates and widget gates reference it.
6. Trip log free quota enforced (number TBD by owner; recommend 3 active trips for free). Bait browser quota enforced if applicable.
7. Prompt assembly hardened (F17): user transcript quoted as data, system instructions delimited, server enforces tournament/entitlement state.
8. LLM client refactored to immutable per-settings instance (F21). Token usage moved to a separate repository.
9. End-to-end purchase test on a real Android device using a license-tester account. Restore-purchase path tested.

### Track B. iOS TestFlight and App Store
1. `Runner.entitlements` includes `applinks:slabhaulapp.com`. AASA published and verified.
2. Sign in with Apple wired via Supabase and native entitlement. Tested on device.
3. RevenueCat StoreKit configuration matches Track C product IDs. Sandbox purchase verified.
4. Microphone permission removed from Info.plist unless a recording feature actually exists. Same audit for any other unjustified permission.
5. App Store privacy nutrition labels mapped against actual data flows. Drafted in `docs/release/ios-privacy.md`.
6. TestFlight build distributed to internal testers. Crash-free for at least 48 hours of usage.
7. App Store submission checklist drafted in `docs/release/ios-submission.md`.

---

## 5. Mission prompt (per-track template)

Each session opens with this short prompt. AGENTS.md and this MASTER_PLAN.md fill in the rest.

```
Mission: Track <letter> per docs/codex/MASTER_PLAN.md.
Findings in scope: <list from MASTER_PLAN.md>.
Branch: feature/<letter>-<short-name>.

Read AGENTS.md, MASTER_PLAN.md, and the relevant AUDIT.md sections.
Propose your 3 to 7 step plan. Wait for approval before writing code.
```

That's it. Everything else is governed by the standing files.

---

## 6. Risk register

These are not findings. They are second-order risks the owner should keep in mind across tracks.

| Risk | Track that surfaces it | Mitigation |
|---|---|---|
| RevenueCat product ID drift between iOS and Android | C, B | Document IDs in `docs/release/products.md`. One-table source of truth. |
| Importer ingests bad public data and ships duplicates | E | Required validation report and human review before merging any new state. No auto-merge from CI. |
| Trip log migration loses user data | F | One-way migration, with a backup-to-JSON fallback retained for 30 days. Logged migration result. |
| Supabase Edge Functions accidentally use `SUPABASE_ANON_KEY` while needing service-role | C | Rename env var to `SUPABASE_SERVICE_ROLE_KEY` in Track C. Refuse to start if absent. |
| Marketing site re-introduces an em dash or a tournament claim during edits | D and beyond | Add a pre-commit lint that scans for the em dash character and flagged phrases. |

---

## 7. Out of scope reminder

Per AGENTS.md section 9, the following projects are siloed and never touched in a SlabHaul session: BenchBook.AI, BenchMark Standard, FlightForge, Walk With HIM, Sayada.ai, WarrantWorks TN, Tipton County court projects, Open Brain.

---

## 8. Change log

- 1.0 (2026-04-26): Initial plan derived from `AUDIT.md`. Owner-locked pricing, beta posture, and Tournament Mode parking confirmed.
