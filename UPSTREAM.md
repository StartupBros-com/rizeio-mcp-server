# Upstream relationship

- **Upstream:** https://github.com/mariomosca/rizeio-mcp-server
- **Divergence (as of 2026-07-24):** +7 ahead / -0 behind upstream default branch
- **Fork type:** Contribution/maintenance fork
- **Sync cadence:** Manual + dependabot.

## StartupBros-specific delta

Live Rize.io MCP server used by will-os (runs from the local clone). Carries a create_project fix dropping fields the Rize GraphQL schema no longer exposes.

## Why this file exists

An org-wide audit on 2026-07-24 found that comparing only the *default* branch made
several forks look like zero-delta mirrors when they actually carried unmerged
StartupBros fixes on side branches. Any future fork-pruning pass must enumerate and
author-check **all** branches, not just default-branch ahead/behind.
