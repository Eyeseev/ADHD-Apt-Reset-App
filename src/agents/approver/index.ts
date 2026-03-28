import readline from 'readline'

export async function prompt(question: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise<string>((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans) }))
}

export function listFixes(fixes: any[]) {
  console.log('\nGenerated fixes:')
  fixes.forEach((f, i) => console.log(`${i + 1}. [${f.id}] ${f.title} -> type: ${f.type}`))
}
