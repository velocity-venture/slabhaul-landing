# AGENTS.md

This file is read automatically by Codex (and other coding agents) at the start of every session in this repository. Treat it as standing orders. Do not violate these rules without an explicit override from the repository owner in the active session.

Repository owner: M.O. Eckel III, Velocity Venture Holdings LLC.
Project: SlabHaul (Flutter app at this repo) and slabhaul-landing (sibling repo).
Stack: Flutter, Dart, Supabase (Postgres, Edge Functions, Storage), Cloudflare Pages for the landing site, Doppler for secrets.

---

## 1. First steps for every session

1. Read this file in full.
2. Read `docs/codex/MASTER_PLAN.md`.
3. Read `AUDIT.md` (the production-readiness audit dated 2026-04-26).
4. Identify which track from MASTER_PLAN.md is the current mission. If the user has not stated one, ask before writing code.
5. Before writing code, propose a 3 to 7 step plan in chat and wait for approval.
6. Confirm you can build clean: `doppler run -- flutter pub get && doppler run -- flutter analyze && doppler run -- flutter test`. If any of those fail and the failure is not part of the mission scope, stop and report.

---

## 2. Mission discipline

- One track per session. Do not slide into adjacent tracks even if the diff looks small.
- If you discover a problem outside the current mission scope, log it in `OVERNIGHT-LOG.md` under "Deferred findings." Do not fix it in this session.
- Reference findings by their AUDIT.md ID (F01, F02, etc.) in commit messages and PR descriptions.
- No merges to `main`. Feature branches and PRs only.
- Branch naming: `feature/<track-letter>-<short-kebab>`. Example: `feature/g-clean-build-foundation`.

---

## 3. Locked product decisions

These are not open questions. Do not propose alternatives unless explicitly asked.

| Item | Value |
|---|---|
| Monthly price | `$8.99` |
| Annual price | `$59.99` |
| Free trial | 7 days |
| Founding Angler tier | Deferred. Do not implement yet. |
| Tournament Mode marketing claims | Removed from copy. The local toggle remains in code as a quiet AI-off switch but is not promoted as tournament-legal. Full Tournament Mode is parked for a later version. |
| First launch posture | Android open beta, free during beta. Paid launch (RevenueCat, StoreKit) deferred 30 to 60 days. |
| Canonical app domain | `slabhaulapp.com` |
| Canonical marketing domain | `slabhaul.ai` |
| Brand color, monetization, and copy source of truth | `docs/codex/MASTER_PLAN.md` section "Brand and copy invariants" |

If you find any other price, any other trial length, or any tournament-legal marketing claim anywhere in the codebase, treat it as a defect and fix it as part of the current track if it falls in scope, or log it for the next track if it does not.

---

## 4. House rules for all written output

These apply to code comments, commit messages, PR descriptions, README updates, marketing copy edits, and any document Codex writes that a human will read.

1. **No em dashes anywhere.** Use commas, semicolons, colons, periods, or parentheses instead. This rule is absolute.
2. American English spelling.
3. No "AI tells." Avoid: "I'd be happy to," "Certainly!", "It's important to note that," "Let's dive in," "delve," and similar conversational filler. Write like an engineer briefing a peer.
4. No emojis in commit messages, PR titles, code comments, or production copy. Emojis allowed in `OVERNIGHT-LOG.md` and chat-only banter.
5. Sentences in user-facing copy stay short. Active voice.
6. When writing for the marketing site (slabhaul-landing), match the existing tone. Energetic, direct, angler-to-angler. Do not invent new product claims; copy edits ship from the audit-truthful list only.

---

## 5. Branch, commit, and PR policy

- Branch from latest `main`. Rebase, do not merge, if `main` advances during the session.
- Conventional commits. Examples: `fix(F02): remove .env from pubspec assets`, `refactor(F10): consolidate networking onto dio`, `feat(F01): wire RevenueCat purchase flow`.
- Each PR closes one track or one logical sub-track. PR description must include:
  - List of finding IDs closed, each with a one-line "what changed."
  - List of finding IDs deferred to follow-up tracks.
  - Test evidence: `flutter analyze` issue count delta, `flutter test` results, manual smoke-test notes if relevant.
  - Screenshots or short clips for any UI change.
- Squash-merge when approved. Keep `main` history readable.

---

## 6. Secrets, environments, and config

- Doppler is the secrets manager. Project names: `slabhaul`, `slabhaul-landing`.
- Configs are exactly: `dev`, `dev_personal`, `stg`, `prd`. Never `prod`. Never `production`.
- Run dev with `doppler run -- ...`. Do not commit `.env` files. Do not list `.env` as a Flutter asset (this is finding F02).
- API keys, Supabase service-role keys, RevenueCat keys, OpenAI/Anthropic/Google keys all flow through Doppler. If you find one in code or in a committed file, stop and report immediately. Do not push.
- Supabase project ref for SlabHaul: see Doppler. Do not hardcode.

---

## 7. Long-running and overnight sessions

- `--dangerously-skip-permissions` is permitted for overnight sessions only when the user has explicitly started one.
- At the end of every overnight session, write or update `OVERNIGHT-LOG.md` at repo root with:
  - Date, branch name, mission track.
  - What shipped (commits, PRs).
  - What was deferred and why.
  - What blocked you.
  - Suggested next mission.
- Never push to `main` overnight. Open PRs only.

---

## 8. Testing minimums

- A track is not done until `flutter test` passes from a clean checkout.
- Analyzer warning count must not increase. Track each track's baseline at the start of the session and report the ending count.
- For tracks that touch domain logic (Match-the-Hatch, spider rig calculator, attractor importer, paywall entitlements), add or extend golden/fixture tests. The audit (section 15) lists the highest-leverage targets.
- Do not delete failing tests to make the suite green. Skip with `@Skip('reason and follow-up issue')` and log it.

---

## 9. Out of scope, always

The following are unrelated projects under the same VVH umbrella. Do not touch them, reference them in commits, or mix concerns:

- BenchBook.AI
- The BenchMark Standard
- FlightForge
- Walk With HIM (Mission: Mark 16:15, LLC)
- Sayada.ai and WarrantWorks TN
- Tipton County court projects (`tiptoncourts.com`, probation app)
- Open Brain platform

If a user request seems to cross into one of these in a SlabHaul session, stop and ask.

---

## 10. When in doubt

Ask before acting. A 30-second clarifying question beats a 3-hour rewrite.
