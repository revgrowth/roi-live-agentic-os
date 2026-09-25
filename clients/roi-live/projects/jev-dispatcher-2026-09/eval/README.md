# Dispatcher eval set

`jobs.jsonl` holds 50 jobs. Most are past ROI.LIVE work under `clients/*/projects/`. Three are repo-code jobs: the Tempo model router, the Polaris System One client, and this dispatcher.

Tempo reviewed every label on 2026-09-24. Each row has a primary `ideal_seat` and an `acceptable` list. A hit is any seat in that list. The scorer also treats ChatGPT Team as part of the ChatGPT family, and treats GLM 5.3 Max and Kimi K3 Max as interchangeable on standard execution.

The live script calls Jev and compares seats. It reports strict agreement (primary only), lenient agreement (acceptable list), and human-review recall on rows that require review. It does not create `ENABLED.on` and it does not queue handoffs.

```powershell
.\.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1
```

If `TYPESAFE_API_KEY` is empty, the script loads it from the repo-root `.env`. It does not print the key.
