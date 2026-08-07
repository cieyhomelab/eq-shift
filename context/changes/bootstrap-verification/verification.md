---
bootstrapped_at: 2026-08-07T20:39:11Z
starter_id: vite-react
starter_name: "Vite + React"
project_name: eq-shift
language_family: js
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: verified
phase_3_status: ok
audit_command: "npm audit --json"
---

## Hand-off

```yaml
starter_id: vite-react
package_manager: npm
project_name: eq-shift
hints:
  language_family: js
  team_size: solo
  deployment_target: github-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: true
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: false
    can_judge_agent: true
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

### Why this stack

Solo developer building EqShift, a lightweight client-only matchstick-equation puzzle game with a 3-week after-hours MVP budget and an explicit PRD non-goal of no backend, accounts, or server-side data persistence. The recommended default for (web, js) — 10x Astro Starter — bundles Supabase auth/DB, which directly conflicts with that constraint, so the custom path was chosen instead of the standard recommendation. Vite + React was picked over the other quality-gate-passing alternatives (Next.js, 10x Astro Starter, Angular) because it is the leanest pure-SPA option with no forced backend surface and the fastest iteration loop for a small game. It fails one of the four agent-friendly quality gates (no strong built-in project-layout conventions) — a known, accepted override recorded via quality_override; the self-check came back positive on 4 of 5 points, with documentation currency the one unconfirmed item. Deployment targets GitHub Pages — outside the starter card's listed defaults but fully compatible with a static, client-only build. CI runs on GitHub Actions with auto-deploy on merge to main.

## Pre-scaffold verification

| Signal      | Value                                    | Severity | Notes                                              |
| ----------- | ----------------------------------------- | -------- | --------------------------------------------------- |
| npm package | create-vite v9.1.2 published 2026-07-30   | fresh    | resolved from cmd_template (`npm create vite@latest`) |
| GitHub repo | not run                                   | n/a      | card's `docs_url` (vitejs.dev/guide/) is not a GitHub URL |

## Scaffold log

**Resolved invocation**: `npm create vite@latest .bootstrap-scaffold -- --template react-ts`
**Strategy**: subdir-then-move
**Exit code**: 0
**Files moved**: 14
**Conflicts (.scaffold siblings)**: none
**.gitignore handling**: moved silently (no `.gitignore` existed in cwd)
**.bootstrap-scaffold cleanup**: deleted

## Post-scaffold audit

**Tool**: npm audit --json
**Status**: failed to run
**Reason**: ENOLOCK — no `package-lock.json` present. The starter's `cmd_template` does not chain a dependency install step (bootstrapper does not add its own install step per policy), so no lockfile exists yet to audit against.
**Partial output (if any)**:

```
npm error code ENOLOCK
npm error audit This command requires an existing lockfile.
npm error audit Try creating one first with: npm i --package-lock-only
npm error audit Original error: loadVirtual requires existing shrinkwrap file
```

Recommended manual step: run `npm install` in the project root, then re-run `npm audit --json` to get a real dependency-vulnerability picture.

## Hints recorded but not acted on

| Hint                     | Value          |
| ------------------------ | -------------- |
| bootstrapper_confidence  | verified       |
| quality_override         | true           |
| path_taken               | custom         |
| self_check_answers       | typed: true, from_official_starter: true, conventions: true, docs_current: false, can_judge_agent: true |
| team_size                | solo           |
| deployment_target        | github-pages   |
| ci_provider               | github-actions |
| ci_default_flow          | auto-deploy-on-merge |
| has_auth                 | false          |
| has_payments             | false          |
| has_realtime              | false          |
| has_ai                    | false          |
| has_background_jobs       | false          |

`quality_override: true` — the user proceeded past a failing agent-friendly quality gate (convention_based) during stack selection. v1 surfaces this but takes no compensating action.

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified — happy hacking.

Useful manual steps in the meantime:
- `npm install` to install dependencies and generate a lockfile (also needed before a meaningful `npm audit` run).
- `git init` (if you have not already) to start your own repo history — this cwd already has a `.git/` from before bootstrapping, so this may already be done.
- Review any `.scaffold` siblings the conflict policy created and decide which version of each file to keep (none were created in this run).
- Address audit findings per your project's risk tolerance once `npm install` has run.
