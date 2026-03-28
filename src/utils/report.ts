import fs from 'fs'
import path from 'path'
import { info } from './logger'

export function saveJSONReport(baseName: string, data: any) {
  const dir = path.join(process.cwd(), 'reports')
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `${baseName}-${Date.now()}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
  info(`Saved JSON report to ${file}`)
  return file
}

export function saveMarkdownReport(baseName: string, data: any) {
  const dir = path.join(process.cwd(), 'reports')
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `${baseName}-${Date.now()}.md`)
  const md = [`# Audit Report: ${data.url}`, `Generated: ${data.timestamp}`, '', '## Findings', '']
  if (data.llmAudit && data.llmAudit.findings) {
    for (const f of data.llmAudit.findings) {
      md.push(`- **${f.id}**: ${f.title} (${f.severity})`)
      md.push(`  - ${f.detail}`)
      md.push(`  - Suggested fix: ${JSON.stringify(f.suggestedFix)}`)
      md.push('')
    }
  }
  fs.writeFileSync(file, md.join('\n'), 'utf-8')
  info(`Saved Markdown report to ${file}`)
  return file
}
