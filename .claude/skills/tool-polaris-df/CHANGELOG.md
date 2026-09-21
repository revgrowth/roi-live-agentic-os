# Changelog

## 0.1.1 - 2026-09-21

- Search Command integration kit: `INTEGRATION_SEARCH_COMMAND.md` plus portable shim `integrations/str_search_command_soft_gates.py`.
- Shim is dry_run by default, no-ops if `POLARIS_DF_SOFT_GATES` is off or `polaris_df` is missing, and re-locks measured fields.
- Judgment / JSONL stamp `route` with Tempo alias `router_outcome`. YMYL/claim still never auto.

## 0.1.0 - 2026-09-21

- Initial Polaris Decision Fabric: Jev client, mock client, pack registry, confidence router, JSONL log.
- Full pack catalog for Search Command G0-G8, keyword, audit, QA, AEO/GEO, and ops extras.
- Search Command adapters that stamp `judgment` provenance and lock measured fields.
- CLI: decide, batch, audit-triage, keyword-triage, qa-content, search-command, eval.
- Golden fixtures + mock eval for CI.
