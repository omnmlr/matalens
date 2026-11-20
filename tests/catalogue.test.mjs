import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

test('catalogue check accepts CRLF output and still detects changed data', async () => {
  const root = await mkdtemp(join(tmpdir(), 'matalens-catalogue-'))
  try {
    const inputs = ['scripts/import-election-catalogue.mjs', 'data/election-source-records.json']
    for (const folder of ['scripts', 'data', 'src']) await mkdir(join(root, folder))
    for (const path of inputs) await copyFile(new URL('../' + path, import.meta.url), join(root, path))
    const output = join(root, 'src', 'election-data.json')
    const catalogue = await readFile(new URL('../src/election-data.json', import.meta.url), 'utf8')
    const crlf = catalogue.replace(/\r?\n/g, '\r\n')
    await writeFile(output, crlf)
    const check = () => spawnSync(process.execPath, [join(root, inputs[0]), '--check'], { encoding: 'utf8' })
    const accepted = check()
    assert.equal(accepted.status, 0, accepted.stderr)
    assert.equal(await readFile(output, 'utf8'), crlf)
    const drifted = JSON.parse(crlf)
    drifted.candidacies[0].qualification += ' (changed)'
    await writeFile(output, JSON.stringify(drifted) + '\r\n')
    const rejected = check()
    assert.equal(rejected.status, 1)
    assert.match(rejected.stderr, /Run npm run data:import/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
