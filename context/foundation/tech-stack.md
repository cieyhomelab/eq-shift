---
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
---

## Why this stack

Solo developer building EqShift, a lightweight client-only matchstick-equation puzzle game with a 3-week after-hours MVP budget and an explicit PRD non-goal of no backend, accounts, or server-side data persistence. The recommended default for (web, js) — 10x Astro Starter — bundles Supabase auth/DB, which directly conflicts with that constraint, so the custom path was chosen instead of the standard recommendation. Vite + React was picked over the other quality-gate-passing alternatives (Next.js, 10x Astro Starter, Angular) because it is the leanest pure-SPA option with no forced backend surface and the fastest iteration loop for a small game. It fails one of the four agent-friendly quality gates (no strong built-in project-layout conventions) — a known, accepted override recorded via quality_override; the self-check came back positive on 4 of 5 points, with documentation currency the one unconfirmed item. Deployment targets GitHub Pages — outside the starter card's listed defaults but fully compatible with a static, client-only build. CI runs on GitHub Actions with auto-deploy on merge to main.
