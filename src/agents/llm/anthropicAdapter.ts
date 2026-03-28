import { extractJSONBlock, validateFindingsSchema } from './validator'

type AnthropicResponse = {
  completion: string
}

function sanitizeFindings(findings: any, htmlProvided: boolean) {
  // Remove any 'file' fields that appear to be guessed/invented.
  // If HTML was not provided, strip all file fields as a safeguard.
  return findings.map((f: any) => {
    if (f.suggestedFix && f.suggestedFix.file) {
      if (!htmlProvided) {
        // No HTML was provided; strip file to prevent guessing
        delete f.suggestedFix.file;
      }
    }
    return f;
  });
}

export async function auditWithAnthropic(url: string, html?: string) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('Missing ANTHROPIC_API_KEY in environment')

  const prompt = `You are an auditor inspecting a webpage for UX, content clarity, and conversion improvements.

Input URL: ${url}
HTML provided: ${html ? 'yes (you may inspect the HTML)' : 'no (URL only)'}

CRITICAL: Include a "file" field in suggestedFix ONLY if you directly observe the file path or selector in the provided HTML. NEVER infer or guess file paths even if they seem like standard conventions.

Output only valid JSON. Produce a single object with key "findings" (array of at most 3 findings). Each finding must follow this schema exactly:
{
  "findings": [
    {
      "id": "short-id",
      "title": "6-10 word summary",
      "detail": "1-3 sentence description and user impact",
      "severity": "low|medium|high",
      "suggestedFix": {
        "type": "fix-type-token",
        "description": "actionable step with concrete example if possible"
        "file": (ONLY if directly observed in provided HTML; otherwise OMIT this field entirely)
      }
    }
  ]
}

Constraints:
- NEVER guess, infer, or invent file paths, selectors, or file names.
- If you cannot directly observe a file path in provided HTML, OMIT the "file" field completely.
- Avoid marketing fluff; be precise and actionable.
- Focus only on UX, content clarity, and conversion.
- If you cannot produce findings, output {"findings": []}.`

  const body = {
    model: 'claude-2.1',
    prompt,
    max_tokens_to_sample: 800,
    temperature: 0.1  // Lower temperature for stricter adherence
  }

  const res = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Anthropic API error: ${res.status} ${t}`)
  }
  const data = (await res.json()) as AnthropicResponse

  // Try to extract JSON block from completion
  const completion = data.completion || ''
  const jsonText = extractJSONBlock(completion)
  if (!jsonText) {
    throw new Error('LLM did not return a JSON object in its completion')
  }

  let parsed: any
  try {
    parsed = JSON.parse(jsonText)
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from LLM output: ${String(err)}`)
  }

  // Sanitize invented file paths
  if (parsed.findings && Array.isArray(parsed.findings)) {
    parsed.findings = sanitizeFindings(parsed.findings, !!html);
  }

  const val = validateFindingsSchema(parsed)
  if (!val.ok) {
    throw new Error(`LLM findings schema validation failed: ${val.reason}`)
  }

  return parsed
}
