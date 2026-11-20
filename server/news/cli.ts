import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { generateDrafts } from './pipeline.ts'
import { defaultEdition, readDraftBatch, recordDecision, saveDraftBatch } from './storage.ts'

const usage = `MataLens news desk
  collect [--live] [--drafts PATH]
  queue [--drafts PATH]
  show STORY_ID [--drafts PATH]
  approve STORY_ID REVISION --reviewer LABEL [--drafts PATH] [--edition PATH]
  withdraw STORY_ID REVISION --reviewer LABEL [--edition PATH]`

async function main() {
  if (existsSync('.env')) process.loadEnvFile()
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      live: { type: 'boolean' }, drafts: { type: 'string' }, edition: { type: 'string' },
      reviewer: { type: 'string' }, help: { type: 'boolean' },
    },
  })
  const [command, id, revision, extra] = positionals
  if (values.help || !command) {
    console.log(usage)
    return
  }
  const batchPath = resolve(values.drafts ?? '.matalens/news/drafts.json')
  const editionPath = resolve(values.edition ?? process.env.MATALENS_NEWS_EDITION ?? defaultEdition)
  if (batchPath === editionPath) throw new Error('Drafts and the public edition need separate files.')

  if (command === 'collect' && !id) {
    const batch = await generateDrafts({ mode: values.live ? 'live' : 'recorded' })
    saveDraftBatch(batchPath, batch)
    console.log(`Staged ${batch.drafts.length} ${batch.mode} drafts in ${batchPath}.`)
    for (const issue of batch.issues) console.error(`${issue.id} — ${issue.reason}`)
    if (batch.issues.length) process.exitCode = 1
    return
  }
  if (command === 'queue' && !id) {
    const batch = readDraftBatch(batchPath)
    console.log(`${batch.mode} collection on ${batch.collectedAt}`)
    for (const draft of batch.drafts) console.log(`${draft.story.id} ${draft.revision} ${draft.story.title}`)
    return
  }
  if (command === 'show' && id && !revision) {
    const draft = readDraftBatch(batchPath).drafts.find(draft => draft.story.id === id)
    if (!draft) throw new Error('No staged story with that ID.')
    console.log(JSON.stringify(draft, null, 2))
    return
  }
  if ((command === 'approve' || command === 'withdraw') && id && revision && !extra && values.reviewer) {
    const entry = recordDecision({ batchPath, editionPath, id, revision, reviewer: values.reviewer, decision: command })
    console.log(`${entry.story.id} is ${entry.story.reviewStatus} in ${editionPath}.`)
    return
  }
  throw new Error(usage)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Editorial command failed.')
  process.exitCode = 1
})
