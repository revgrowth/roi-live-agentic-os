# Dispatcher eval set

`jobs.jsonl` holds 50 past ROI.LIVE jobs taken from files under `clients/*/projects/`.

Each row has an ideal seat and a one-line reason. Every label is `needs_tempo_review`. Tempo has not signed these seats.

The live script calls Jev and compares seats. It does not create `ENABLED.on` and it does not queue handoffs.

```powershell
.\.claude\skills\tool-jev-dispatcher\scripts\live-eval.ps1
```

`TYPESAFE_API_KEY` must already be in the environment. The script does not print it.
