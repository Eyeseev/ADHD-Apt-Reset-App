import { info } from '../../utils/logger'

export type Fix = {
  id: string
  title: string
  file?: string
  type: string
  params?: any
}

export function generateFixesFromReport(report: any): Fix[] {
  info('Generating fixes from report')
  const fixes: Fix[] = []
  if (report.llmAudit && report.llmAudit.findings) {
    for (const f of report.llmAudit.findings) {
      const fix: Fix = {
        id: `${f.id}`,
        title: f.title,
        type: f.suggestedFix?.type || 'manual',
        params: f.suggestedFix || {}
      }
      fixes.push(fix)
    }
  }
  return fixes
}
