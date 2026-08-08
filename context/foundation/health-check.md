---
project: EqShift
checked_at: 2026-08-08T09:11:48Z
health_status: needs-attention
context_type: brownfield
language_family: js
stack_assessment_available: false
checks_run:
  - lockfile
  - dependency_audit
  - outdated_deps
  - test_runner
  - ci_cd
  - configuration
audit_findings:
  critical: 0
  high: 0
  moderate: 0
  low: 0
test_runner_detected: true
ci_provider: null
recommended_fixes: 4
---

## Dependency Health

### Lockfile

```
Status: present (package-lock.json)
Package manager: npm
```

### Security Audit

```
Tool: npm audit --json
Summary: 0 CRITICAL, 0 HIGH, 0 MODERATE, 0 LOW
Direct vs transitive: not applicable — no vulnerabilities found (98 total dependencies scanned: 4 direct prod, 95 dev, 45 optional)
```

No findings. Dependency tree is clean.

### Outdated Dependencies

```
Packages with major version gaps: 2
```

- **typescript**: 6.0.3 → 7.0.2 (1 major version behind)
- **@types/node**: 24.13.3 → 26.2.0 (1 major version behind, tracks Node's own release cadence)

Both are dev-only dependencies. Neither blocks agent work; worth a scheduled bump rather than an urgent one.

## Test Suite

```
Test runner: Vitest
Tests found: 17 tests across 11 suites
Test execution: passing
```

```
Configuration: vitest.config.ts
Framework: Vitest ^4.1.10
```

All 17 tests passed on dry run (`npx vitest run`), covering `equation.test.ts`, `puzzles.test.ts`, and `segments.test.ts` under `src/game/`. The agent has a working, fast feedback loop for verifying its own changes.

## CI/CD

```
Provider: not detected
Configuration: not found
```

ℹ No CI/CD configuration detected. You'll set this up in the infrastructure and deployment lesson.
For now, a local test runner is sufficient for agent collaboration.

## Configuration

### High severity

- **tsconfig.app.json / tsconfig.node.json** — neither sets `"strict": true`. Without it, TypeScript allows implicit `any` and loose null handling, so an agent generating code against this config produces less reliable type guarantees than the project's tooling otherwise suggests. Fix: add `"strict": true` to `compilerOptions` in both files, then run `npm run build` (`tsc -b`) to surface and fix any newly-caught type errors.

### Medium severity

- **No code formatter configured** — `.oxlintrc.json` covers linting (react/typescript/oxc rules) but there's no Prettier or Biome config, so formatting isn't enforced and an agent's output style may drift from hand-written code. Fix: `npm install -D prettier` and add a `.prettierrc` (or adopt Biome's formatter alongside oxlint if you want a single toolchain).

### Low severity

- **.editorconfig** — absent. Minor: keeps indentation/line-ending consistent across editors, but oxlint + a future formatter cover most of this already. Fix: add a `.editorconfig` with the project's indent style.
- **.env.example** — not applicable. No `import.meta.env` or `process.env` usage found in `src/`; the game currently has no environment-variable surface to document.

## Stack Assessment Cross-Reference

No stack-assessment.md found. Run /10x-stack-assess for quality-gate analysis.

## Recommended Fixes

### Fix before agent work (Category A)

### 1. Enable TypeScript strict mode

**Impact**: Without `strict: true`, the agent can generate code that type-checks locally but hides `any`-typed values and unchecked nulls — bugs that strict mode would catch at compile time before they ever reach a test.
**Severity**: high
**Effort**: moderate (15–30 min)
**Fix**:

```
Add "strict": true to compilerOptions in tsconfig.app.json and tsconfig.node.json,
then run: npm run build
Fix any type errors surfaced.
```

### 2. Add a code formatter

**Impact**: oxlint enforces rules but not formatting. An agent editing files without a formatter in place will produce diffs with inconsistent style, making review harder and increasing noise in future diffs.
**Severity**: medium
**Effort**: quick (< 5 min)
**Fix**:

```
npm install -D prettier
echo '{}' > .prettierrc
```

### 3. Bump outdated dev dependencies

**Impact**: `typescript` and `@types/node` are each one major version behind. Low urgency since both are dev-only, but drifting further increases the chance of a larger, riskier jump later.
**Severity**: low
**Effort**: quick (< 5 min)
**Fix**:

```
npm install -D typescript@latest @types/node@latest
npm run build
```

### 4. Add .editorconfig

**Impact**: Minor consistency gap across editors; low practical effect given oxlint is already in place.
**Severity**: low
**Effort**: quick (< 5 min)
**Fix**:

```
Add a .editorconfig with indent_style/indent_size matching the project's existing 2-space TS/TSX convention.
```

### Addressed in upcoming lessons (Category B)

### No CI/CD pipeline

**Lesson**: [Sprint Zero z Agentem: infrastruktura, walking skeleton i pierwszy deploy (M1L5)](https://platforma.przeprogramowani.pl/external/10xdevs-3/m1-l5)
**What you'll do there**: Set up a CI/CD pipeline (lint, test, build, deploy) so pushes are automatically verified before they reach production.

### Missing CLAUDE.md / AGENTS.md at project root

**Lesson**: [Agent Onboarding: Agents.md, AI Rules i feedback loops (M1L4)](https://platforma.przeprogramowani.pl/external/10xdevs-3/m1-l4)
**What you'll do there**: Build project-specific agent instruction files with the right content — conventions, contract surfaces, and feedback-loop rules — rather than a premature stub generated now.

## Summary

Health status: needs-attention

The project's core signals are strong: a clean dependency audit (0 vulnerabilities across 98 packages), a committed lockfile, and a fast, fully-passing Vitest suite (17/17 tests) that gives an agent a real feedback loop. The main gap is TypeScript strict mode being off in both `tsconfig.app.json` and `tsconfig.node.json`, which undercuts the type-safety guarantees an agent would otherwise rely on; a missing formatter is a smaller, secondary gap. No CI/CD pipeline or AGENTS.md exists yet, but both are expected at this stage and covered in upcoming lessons.

Next step: enable TypeScript strict mode and add a formatter (Category A fixes above), then proceed to agent onboarding.
