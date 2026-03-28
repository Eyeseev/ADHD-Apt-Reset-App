#!/usr/bin/env node
import { evaluate } from '../agents/evaluator'
import { saveJSONReport, saveMarkdownReport } from '../utils/report'
import { generateFixesFromReport } from '../agents/planner'
import { listFixes, prompt } from '../agents/approver'
import { applyFixWithGit, applyFixDirect, commitStaged, abortAndCleanup } from '../agents/implementer'
import { info } from '../utils/logger'

function parseArgs() {
  const args = process.argv.slice(2)
  const res: any = { cmd: args[0] }
  for (let i = 1; i < args.length; i++) {
    const a = args[i]
    if (a === '--url') res.url = args[++i]
    if (a === '--page') res.page = args[++i]
  }
  return res
}

async function main() {
  const { cmd, url } = parseArgs()
  if (cmd === 'evaluate') {
    if (!url) {
      console.error('Usage: cli evaluate --url <site-url>')
      process.exit(1)
    }
    info(`Starting evaluation for ${url}`)
    const report = await evaluate(url)
    saveJSONReport('audit', report)
    saveMarkdownReport('audit', report)
    const fixes = generateFixesFromReport(report)
    listFixes(fixes)

    if (fixes.length === 0) {
      console.log('No auto-suggested fixes found.')
      process.exit(0)
    }

    const pick = await prompt('\nEnter the ID of a fix to apply (or press Enter to skip): ')
    if (!pick) {
      console.log('No fix approved. Exiting.')
      process.exit(0)
    }
    const chosen = fixes.find((f) => f.id === pick || `${f.id}` === pick)
    if (!chosen) {
      console.error('Invalid fix ID')
      process.exit(1)
    }
    const confirm = await prompt(`Confirm apply fix ${chosen.id} (yes/no): `)
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Approval not given. Exiting.')
      process.exit(0)
    }

    // Apply fix via implementer (git-safe)
    const result = applyFixWithGit(chosen)
    if (!result.ok) {
      // fallback to direct apply error or message
      console.error('Failed to stage changes:', result.message)
      process.exit(1)
    }

    if (result.diff) {
      console.log('\nStaged diff:\n')
      console.log(result.diff)
      const commitConfirm = await prompt('\nCommit staged changes? (yes/no): ')
      if (commitConfirm.toLowerCase() === 'yes') {
        const commitRes = commitStaged(`Apply fix ${chosen.id}: ${chosen.title}`)
        if (commitRes.ok) {
          info('Fix committed')
          // Re-evaluate after commit
          const rereport = await evaluate(url)
          saveJSONReport('audit-after-fix', rereport)
          saveMarkdownReport('audit-after-fix', rereport)
          console.log('Re-evaluation complete. Reports saved.')
        } else {
          console.error('Commit failed:', commitRes.message)
        }
      } else {
        // abort and cleanup
        const abortRes = abortAndCleanup(result.origBranch || 'main', result.branch || '')
        if (abortRes.ok) {
          console.log('Aborted changes and returned to original branch.')
        } else {
          console.error('Failed to abort cleanly:', abortRes.message)
        }
      }
    } else {
      // No diff means direct apply was used
      console.log('Applied fix directly:', result.message)
      const rereport = await evaluate(url)
      saveJSONReport('audit-after-fix', rereport)
      saveMarkdownReport('audit-after-fix', rereport)
      console.log('Re-evaluation complete. Reports saved.')
    }
  } else {
    console.log('Usage: cli evaluate --url <site-url>')
  }
  if (cmd === 'llm-test') {
    if (!url) {
      console.error('Usage: cli llm-test --url <site-url>')
      process.exit(1)
    }
    info(`Running LLM dry-run for ${url}`)
    try {
      const res = await (async () => {
        // call LLM audit directly
        // import at runtime to avoid unused import when not used
        const { runLLMAudit } = await import('../agents/llm')
        return await runLLMAudit(url)
      })()
      const out = JSON.stringify(res, null, 2)
      const fs = await import('fs')
      const path = await import('path')
      const file = path.join(process.cwd(), 'reports', `llm-test-${Date.now()}.json`)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, out, 'utf-8')
      console.log('LLM dry-run successful. Report saved to', file)
      console.log(out)
    } catch (err: any) {
      console.error('LLM dry-run failed:', String(err))
      process.exit(1)
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
