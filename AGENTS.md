# Frontend Agent Instructions

## Project

This is the SynQ frontend. Treat the admin interface as an operational tool, not a generic dashboard. Admins support clinical workflows but must not act as clinicians.

Before changing code, inspect the existing implementation and follow its patterns. Preserve the current brand, design system, dependencies, and working behavior. Check `package.json` before adding or importing dependencies.

## Skills

`skills-lock.json` lists the installed skills. Read only the relevant `.agents/skills/<name>/SKILL.md` for the task; do not load or apply every skill by default.

* `design-taste-frontend`: marketing pages and portfolios; not admin dashboards.
* `design-taste-frontend-v1`: use only when explicitly needed for compatibility.
* `redesign-existing-projects`: audit-first, incremental redesigns.
* `minimalist-ui`: use only when its visual direction fits the request.
* `brandkit`: brand identity/image work only.
* `stitch-design-taste`: Stitch tasks and Stitch-oriented `DESIGN.md` only.

Project requirements and the user's request take precedence over general skill advice. Do not edit `skills-lock.json` or install/update skills unless asked.

## Product and UI

* Keep operational screens clear, fast, accessible, and consistent with the existing SynQ brand. Avoid generic dashboard decoration, unnecessary cards, and distracting motion.
* Reuse existing components and patterns. Do not build duplicate UI primitives or introduce a second design system.
* Use real, verified API contracts and typed responses. Never invent endpoints, response shapes, or production metrics.
* Treat frontend role checks as UX only; backend authorization is authoritative. Never bypass authentication or store tokens in browser storage.
* Minimize sensitive data. Do not expose patient transcripts, private clinician notes, or unnecessary clinical information.
* Async screens need loading, empty, and actionable error states. Do not silently swallow errors or fake loading.
* Confirm privileged/destructive actions and provide clear success/error feedback.
* Support keyboard access, visible focus, semantic labels, responsive layouts, and reduced motion where relevant.
* Test behavior and relevant edge cases with the project's existing test tools.

## Git

**Never commit or push.** Do not run `git commit` or `git push`, or use another tool/API to create commits or push to GitHub or any remote. Leave changes uncommitted.
