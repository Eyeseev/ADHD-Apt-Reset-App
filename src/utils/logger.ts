export const info = (msg: string) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${msg}`)
}

export const warn = (msg: string) => {
  console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
}

export const error = (msg: string) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`)
}
