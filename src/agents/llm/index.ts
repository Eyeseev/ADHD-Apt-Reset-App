import { auditWithAnthropic } from './anthropicAdapter'

export async function runLLMAudit(url: string, html?: string) {
  const provider = (process.env.LLM_PROVIDER || 'anthropic').toLowerCase()
  if (provider === 'anthropic') {
    return await auditWithAnthropic(url, html)
  }
  throw new Error(`Unsupported LLM provider: ${provider}`)
}
