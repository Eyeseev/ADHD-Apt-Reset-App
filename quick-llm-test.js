#!/usr/bin/env node
const url = 'http://localhost:3000';
const key = process.env.ANTHROPIC_API_KEY;

if (!key) {
  console.error('[ERROR] ANTHROPIC_API_KEY not set');
  process.exit(1);
}

const prompt = `You are an auditor inspecting a webpage for UX, content clarity, and conversion improvements.

Input URL: ${url}
HTML provided: no (URL only)

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
- If you cannot produce findings, output {"findings": []}.`;

const body = {
  model: 'claude-2.1',
  prompt,
  max_tokens_to_sample: 800,
  temperature: 0.1
};

console.log('[INFO] Testing LLM audit with tightened file-path constraints');
console.log('[INFO] URL:', url);
console.log('[INFO] Model: claude-2.1');
console.log('[INFO] Calling Anthropic API...\n');

fetch('https://api.anthropic.com/v1/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': key
  },
  body: JSON.stringify(body)
})
  .then(async res => {
    console.log('[LOG] Response status:', res.status);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json();
  })
  .then(data => {
    console.log('[LOG] Successfully received response');
    const completion = data.completion || '';
    
    const jsonStart = completion.indexOf('{');
    if (jsonStart === -1) {
      throw new Error('No JSON found in response');
    }
    
    const jsonText = completion.slice(jsonStart);
    const parsed = JSON.parse(jsonText);
    
    console.log('[SUCCESS] Parsed findings\n');
    console.log(JSON.stringify(parsed, null, 2));
    
    // Evaluate quality
    console.log('\n[EVALUATION]');
    if (parsed.findings && parsed.findings.length > 0) {
      parsed.findings.forEach((f, i) => {
        console.log(`\nFinding ${i + 1}: [${f.id}] ${f.title}`);
        console.log(`  Severity: ${f.severity}`);
        console.log(`  Has file field: ${!!f.suggestedFix?.file}`);
        if (f.suggestedFix?.file) {
          console.log(`  File: ${f.suggestedFix.file}`);
        }
      });
    } else {
      console.log('No findings returned');
    }
  })
  .catch(err => {
    console.error('[ERROR]:', err.message);
    process.exit(1);
  });
