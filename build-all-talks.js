import { readdir, stat } from 'fs/promises'
import { exec as execCb } from 'child_process'
import { join } from 'path'
import { promisify } from 'util'

const talksDir = 'talks'
const distDir = 'dist/talks'

async function buildTalk(date) {
  const presPath = join(talksDir, date, 'presentation')
  try {
    const stats = await stat(presPath)
    if (!stats.isDirectory()) return
    console.log(`Building ${presPath}...`)
    await promisify(execCb)(`pnpm --filter @alewin/${date}-talk build`, { cwd: presPath })
    await promisify(execCb)(`mkdir -p ../../${distDir}/${date} && cp -r dist/* ../../${distDir}/${date}/`, { cwd: presPath })
  } catch {
    console.log(`Skipping ${presPath}...`)
  }
}

for (const date of await readdir(talksDir)) {
  await buildTalk(date)
} 