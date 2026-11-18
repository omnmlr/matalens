# REA research playbook — MataLens

**Purpose:** Use the existing Reverse Engineer Anything (REA) research capability to learn from legally accessible reference experiences, while building an original product. Do not confuse reverse engineering with copying branding, designs or proprietary source code.

## Proven setup history on the founder's workstation (November 2026)

- REA / `rea-agents@6.8.0` was installed globally on Windows.
- Early `rea doctor` and `rea setup --dry-run` failed because the runtime had Node `v24.19.0` while one diagnostic demanded Node `^24.22.1`. The team diagnosed that version gate; an intermediate environment adjusted the runtime bound, while later evidence showed healthy operation with Node `v24.22.1`. Prefer a legitimately compatible runtime rather than patching packages again without a compelling reason.
- **CLI install, MCP registration and agent skill installation are different things.** REA's installation alone does not expose callable tools to a new host.
- Antigravity had its MCP config registered under `~/.gemini/config/mcp_config.json`, launching Node with the global `rea-agents/scripts/rea.mjs`. Its `reverse-engineer-anything` skill was registered separately.
- `rea setup --client antigravity --yes` and `rea doctor --client antigravity` produced `healthy: true`, `state: aligned`. The Antigravity MCP runtime answered a real `inspect_analysis_settings` call; 229 tools were discovered. REA generated substantive static-analysis evidence for AGUS and public client libraries.
- **Native Codex registration was not confirmed in that environment** because of Codex profile/config restrictions. A successfully registered Antigravity tool is **not automatically available to Codex Cloud or another workspace**.
- Other failure modes observed: wrong runtime/host, stale temporary paths, expired session or agent restarted in the wrong environment, CLI vs MCP confusion, and browser observations that did not include activity before attachment.
- REA can inspect allowed browser/runtime artifacts and source available to the analyst. **It cannot reveal a website's private server-side code.** Its passive browser mode is not a replacement for a browser automation tool that actively navigates a site.

## Mandatory research protocol for Codex

1. **Detect capability before promising it:** check REA command availability (`rea --version`), run read-only `rea doctor --client codex` if relevant, inspect MCP tools actually callable in this execution host. Check `rea --help` for the installed CLI's real syntax.
2. **Prove a real invocation:** run a read-only REA inspection against an authorized artifact or use a genuinely callable MCP tool such as `inspect_analysis_settings`. Record the output, host, version and results.
3. **If REA works, use it purposefully:** study accessible VotersDesk visitor journeys and FixMyStreet's public user experience/source (where legally permitted). Focus on accessibility, information hierarchy, public navigation, candidate exploration, issue-photo intake, geographic context, receipts, statuses, responsive behavior, errors and mobile experiences.
4. **For browser interaction**, use a permitted browser/DevTools tool for navigation, then attach REA for passive observation where possible. Do not assert passive REA can click through pages on its own. Distinguish observable public HTML/JS from anything inferred.
5. **If Codex cannot call REA**, don't spend the hackathon blocked on host registration. Record the exact failure, inspect public sites with supported browser tools and inspect the public FixMyStreet repo normally. Where useful, hand a focused REA investigation to the already configured Antigravity environment; integrate its findings only after verifying actual evidence.
6. Do not reinstall REA, patch Node/package engine checks, overwrite Antigravity/Codex MCP configs, restart unrelated services or expose credentials without first diagnosing and justifying why it is necessary. Prefer read-only `doctor` and `setup --dry-run`.
7. Maintain a short `docs/REFERENCE_RESEARCH.md` documenting: reference URL, exact observed flow, artifacts/screenshots if permitted, reusable idea, genuine distinction for MataLens and licences/constraints. Never write "analyzed with REA" unless a real invocation succeeded.

## Competitor/reference targets

- **VotersDesk:** https://votersdesk.ng/ — content layout, no-login browsing, ballots, party-name and symbol exercises, candidate pages and practical preparation. Review as inspiration only. Do not lift proprietary components or image assets.
- **FixMyStreet:** https://github.com/mysociety/fixmystreet and https://fixmystreet.org/ — architecture, map/report flow, photo upload and case status. Direct code reuse has **AGPL compliance implications**; do not import/modify without an explicit decision to meet applicable obligations.
- **Ushahidi:** https://github.com/ushahidi/platform — reporting/evidence concepts and permitted open-source patterns.
- **INEC:** https://www.inecnigeria.org/ and https://cvr.inecnigeria.org/pu — official civic data and procedures; don't invent or fabricate data.

## Primary goal

Make MataLens **more comprehensible, easier, more elegant and more useful**, with original green/white visual identity and genuinely working features. REA is a research accelerator, **not a mandatory dependency for the running application**.
