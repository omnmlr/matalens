import { spawn } from 'node:child_process'

const port = process.env.MATALENS_API_PORT ?? '3001'
const children = [
  spawn(process.execPath, ['--watch', 'server/index.mjs'], {
    stdio: 'inherit',
    env: { ...process.env, MATALENS_MODE: 'dev', MATALENS_PORT: port },
  }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, MATALENS_API_PORT: port },
  }),
]
for (const child of children) child.once('exit', (code) => {
  for (const other of children) if (other !== child) other.kill()
  process.exitCode = code ?? 0
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  for (const child of children) child.kill(signal)
})
