import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { info, warn } from '../../utils/logger'
import { runLLMAudit } from '../llm'

type LighthouseResult = any

export async function runLighthouse(url: string): Promise<LighthouseResult> {
  info(`Running Lighthouse for ${url}`)
  try {
    const outPath = path.join(process.cwd(), 'reports', `lighthouse-${Date.now()}.json`)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    execSync(`npx lighthouse "${url}" --quiet --chrome-flags="--headless" --output=json --output-path=${outPath}`, { stdio: 'inherit' })
    const raw = fs.readFileSync(outPath, 'utf-8')
    return JSON.parse(raw)
  } catch (err: any) {
    warn('Lighthouse failed or not available; returning empty result')
    return { error: String(err) }
  }
}

// LLM audit is delegated to adapters in src/agents/llm

export async function evaluate(url: string) {
  const lh = await runLighthouse(url)
  const llm = await runLLMAudit(url)
  const report = {
    url,
    timestamp: new Date().toISOString(),
    lighthouse: lh,
    llmAudit: llm
  }
  return report
}
