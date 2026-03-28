export type Finding = {
  id: string
  title: string
  detail: string
  severity: 'low' | 'medium' | 'high'
  suggestedFix: {
    type: string
    description: string
    file?: string
  }
}

export function extractJSONBlock(text: string): string | null {
  if (!text) return null
  const firstBrace = text.indexOf('{')
  if (firstBrace === -1) return null
  // find matching closing brace by counting
  let depth = 0
  for (let i = firstBrace; i < text.length; i++) {
    const ch = text[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    if (depth === 0) {
      return text.slice(firstBrace, i + 1)
    }
  }
  return null
}

export function validateFindingsSchema(obj: any): { ok: boolean; reason?: string } {
  if (!obj || typeof obj !== 'object') return { ok: false, reason: 'Not an object' }
  if (!Array.isArray(obj.findings)) return { ok: false, reason: 'Missing findings array' }
  if (obj.findings.length > 10) return { ok: false, reason: 'Too many findings (>10)' }
  for (const f of obj.findings) {
    if (!f.id || typeof f.id !== 'string') return { ok: false, reason: 'finding.id missing or not string' }
    if (!f.title || typeof f.title !== 'string') return { ok: false, reason: `finding.title missing for ${f.id}` }
    if (!f.detail || typeof f.detail !== 'string') return { ok: false, reason: `finding.detail missing for ${f.id}` }
    if (!['low', 'medium', 'high'].includes(f.severity)) return { ok: false, reason: `finding.severity invalid for ${f.id}` }
    if (!f.suggestedFix || typeof f.suggestedFix !== 'object') return { ok: false, reason: `finding.suggestedFix missing for ${f.id}` }
    if (!f.suggestedFix.type || typeof f.suggestedFix.type !== 'string') return { ok: false, reason: `suggestedFix.type missing for ${f.id}` }
    if (!f.suggestedFix.description || typeof f.suggestedFix.description !== 'string') return { ok: false, reason: `suggestedFix.description missing for ${f.id}` }
  }
  return { ok: true }
}
