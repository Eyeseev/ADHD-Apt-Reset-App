import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { info, warn, error } from '../../utils/logger'

export type Fix = {
  id: string
  title: string
  file?: string
  type: string
  params?: any
}

function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export function applyFixDirect(fix: Fix): { ok: boolean; message: string } {
  info(`Applying fix (direct) ${fix.id}: ${fix.title}`)
  if (fix.type === 'update-meta') {
    const page = fix.params?.file || 'pages/index.tsx'
    const desc = fix.params?.description || ''
    const fullPath = path.join(process.cwd(), page)
    if (!fs.existsSync(fullPath)) {
      return { ok: false, message: `Target file not found: ${fullPath}` }
    }
    let content = fs.readFileSync(fullPath, 'utf-8')
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n    <meta name="description" content="${desc}" />`)
    } else {
      content = `<!-- meta description added by claudecode -->\n<meta name="description" content="${desc}" />\n` + content
    }
    fs.writeFileSync(fullPath, content, 'utf-8')
    return { ok: true, message: `Applied meta update to ${page}` }
  }
  warn(`Unsupported fix type: ${fix.type}`)
  return { ok: false, message: `Unsupported fix type: ${fix.type}` }
}

export function applyFixWithGit(fix: Fix): { ok: boolean; message: string; diff?: string; branch?: string; origBranch?: string } {
  info(`Applying fix with git: ${fix.id}`)
  if (!isGitRepo()) {
    warn('Not a git repository; falling back to direct apply')
    const res = applyFixDirect(fix)
    return { ok: res.ok, message: res.message }
  }
  try {
    const origBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    const branch = `claude/fix-${fix.id}-${Date.now()}`
    execSync(`git checkout -b ${branch}`)

    // Do the change (only update-meta for MVP)
    const page = fix.params?.file || 'pages/index.tsx'
    const desc = fix.params?.description || ''
    const fullPath = path.join(process.cwd(), page)
    if (!fs.existsSync(fullPath)) {
      return { ok: false, message: `Target file not found: ${fullPath}` }
    }
    let content = fs.readFileSync(fullPath, 'utf-8')
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n    <meta name="description" content="${desc}" />`)
    } else {
      content = `<!-- meta description added by claudecode -->\n<meta name="description" content="${desc}" />\n` + content
    }
    fs.writeFileSync(fullPath, content, 'utf-8')

    execSync(`git add ${fullPath}`)
    const diff = execSync('git --no-pager diff --staged', { encoding: 'utf8' })
    return { ok: true, message: 'changes staged', diff, branch, origBranch }
  } catch (err: any) {
    error(String(err))
    return { ok: false, message: String(err) }
  }
}

export function commitStaged(message: string): { ok: boolean; message: string } {
  try {
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' })
    return { ok: true, message: 'committed' }
  } catch (err: any) {
    return { ok: false, message: String(err) }
  }
}

export function abortAndCleanup(origBranch: string, branch: string): { ok: boolean; message: string } {
  try {
    execSync('git reset --hard')
    execSync(`git checkout ${origBranch}`)
    execSync(`git branch -D ${branch}`)
    return { ok: true, message: 'aborted and cleaned up' }
  } catch (err: any) {
    return { ok: false, message: String(err) }
  }
}
