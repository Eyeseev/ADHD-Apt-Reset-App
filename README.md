# Claude Code MVP (CLI)

Minimal MVP to evaluate a Next.js site, produce findings, recommend atomic fixes, and apply approved fixes via CLI.

Quick start

1. Install deps: `npm install`
2. Run CLI evaluate: `npm run cli -- evaluate --url http://localhost:3000`

Notes:
- Lighthouse is used for technical audits and requires Chrome headless available.
- LLM-based UX/content audit uses Anthropic Claude; requires `ANTHROPIC_API_KEY` env var.

LLM Integration (Anthropic)

This MVP includes an adapter for Anthropic Claude. To enable the LLM audit:

**Option 1: Use `.env.local` (recommended)**

Create a `.env.local` file in the project root (git-ignored):

```
ANTHROPIC_API_KEY=sk-...
LLM_PROVIDER=anthropic
```

Then run CLI commands normally:

```bash
npm run cli -- llm-test --url http://localhost:3000
```

**Option 2: Shell environment variables (for temporary use)**

```bash
export ANTHROPIC_API_KEY="sk-..."
export LLM_PROVIDER=anthropic
npm run cli -- llm-test --url http://localhost:3000
```

Provider choice: Anthropic Claude is recommended for this MVP because it provides strong instruction-following and concise, controllable outputs well-suited to structured JSON audits. The adapter is small and modular so other providers can be added later.

Runtime notes:
- This CLI uses the system `fetch` API; please run with Node 18+ or provide a fetch polyfill (e.g., `node-fetch`) if your environment is older.

LLM Audit Test

Run the LLM dry-run to validate integration (this will save a JSON file in `reports/`):

```bash
npm run cli -- llm-test --url http://localhost:3000
```

Common failure cases:
- Missing `ANTHROPIC_API_KEY` — the adapter will throw an explicit error.
- Node < 18 without fetch — the CLI may fail to call the HTTP API. Use Node 18+ or install a fetch polyfill.
- Anthropic API errors (rate limit, key invalid) — you'll see the raw API error message.
- LLM returned unparsable output — validator will reject and print a clear message like `LLM did not return a JSON object` or `LLM findings schema validation failed: <reason>`.

If validation fails, no fixes will be applied and the CLI will exit with an error.
