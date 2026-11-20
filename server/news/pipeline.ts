import { readFileSync } from 'node:fs'
import type { StoryCommitment, StorySource, StorySourceComparison, StoryTimelineEntry } from '../../src/story-contract.ts'
import { catalogueCapture, contestLinks, knownParty, knownPerson } from './catalogue.ts'
import { catalogueSources, recipes, sourceConfigs } from './desk.ts'
import { digest, isDay, isId, isMonth, type Draft, type DraftBatch, type DraftStory, type EvidenceRef, type Recipe, type SourceRecord } from './model.ts'
import { collectFacts, collectLive, invalidTerms, matches, normalize, validateSource } from './sources.ts'

const captures: {
  reviewedAt: string
  captures: Record<string, { title: string; text: string }>
} = JSON.parse(readFileSync(new URL('../../data/news/source-captures.json', import.meta.url), 'utf8'))

const sourcesById = new Map(sourceConfigs.map(source => [source.id, source]))
const hosts = new Set(sourceConfigs.filter(source => source.kind === 'html').map(source => new URL(source.url).hostname))
const unique = <T,>(values: T[]) => [...new Set(values)]
const evidenceDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})

function validateDesk() {
  if (sourcesById.size !== sourceConfigs.length ||
    new Set(sourceConfigs.map(source => source.url)).size !== sourceConfigs.length ||
    new Set(recipes.map(recipe => recipe.id)).size !== recipes.length || !isDay(captures.reviewedAt)) {
    throw new Error('Duplicate source or story identifiers, or invalid capture date')
  }
  for (const source of sourceConfigs) validateSource(source)
  for (const recipe of recipes) {
    if (!isId(recipe.id) || !recipe.title || !recipe.topic || !isDay(recipe.match.from) || !isDay(recipe.match.through) ||
      recipe.match.from > recipe.match.through || invalidTerms(recipe.match.terms) || !sourcesById.get(recipe.primary)?.publishedAt) {
      throw new Error(`Invalid story recipe: ${recipe.id}`)
    }
    const known = [recipe.primary, ...(recipe.supporting ?? [])]
    if (known.some(id => !sourcesById.has(id))) throw new Error(`Unknown source in ${recipe.id}`)
    const refs = [...recipe.explanation, ...recipe.context, ...recipe.significance, recipe.quiz]
    if (recipe.commitment) refs.push(recipe.commitment)
    for (const item of recipe.sourceComparisons ?? []) {
      if (!item.summary || unique(item.evidence.map(ref => ref.sourceId)).length < 2) {
        throw new Error(`Invalid source comparison in ${recipe.id}`)
      }
      refs.push(...item.evidence)
    }
    const timelineIds = new Set<string>()
    for (const item of recipe.timeline ?? []) {
      if (!isId(item.id) || !isDay(item.date) || !item.title || !item.evidence.length || timelineIds.has(item.id)) {
        throw new Error(`Invalid timeline entry in ${recipe.id}`)
      }
      const dateSupported = item.evidence.some(ref => {
        const source = sourcesById.get(ref.sourceId)
        if (item.kind !== 'scheduled') return source?.publishedAt === item.date
        const summary = source?.evidence[ref.fact]?.summary
        return summary && matches(normalize(summary), [[evidenceDate.format(new Date(item.date))]])
      })
      if (!dateSupported) throw new Error(`Unconfirmed timeline date in ${recipe.id}/${item.id}`)
      timelineIds.add(item.id)
      refs.push(...item.evidence)
    }
    if (refs.some(ref => !Object.hasOwn(sourcesById.get(ref.sourceId)?.evidence ?? {}, ref.fact))) {
      throw new Error(`Unknown evidence reference in ${recipe.id}`)
    }
    if (recipe.people?.some(id => !knownPerson(id)) || recipe.parties?.some(code => !knownParty(code))) {
      throw new Error(`Unknown election catalogue ID in ${recipe.id}`)
    }
    if (recipe.contest) contestLinks(recipe.contest)
    if (recipe.commitment && (!knownPerson(recipe.commitment.personId) ||
      !(isDay(recipe.commitment.date) || isMonth(recipe.commitment.date)))) {
      throw new Error(`Invalid commitment in ${recipe.id}`)
    }
  }
}

function cluster(recipe: Recipe, records: SourceRecord[]) {
  return records.filter(({ config, capture }) =>
    config.publishedAt && config.publishedAt >= recipe.match.from && config.publishedAt <= recipe.match.through &&
    matches(normalize(capture.title + ' ' + capture.text), recipe.match.terms),
  )
}

function buildDraft(recipe: Recipe, records: SourceRecord[]): Draft {
  const clustered = cluster(recipe, records)
  const primary = clustered.find(record => record.config.id === recipe.primary)
  if (!primary) throw new Error('The original publication could not be confirmed')
  const attached = unique([primary, ...clustered, ...records.filter(record => recipe.supporting?.includes(record.config.id))])
  const byId = new Map(attached.map(record => [record.config.id, record]))
  const evidence = (ref: EvidenceRef) => byId.get(ref.sourceId)?.facts[ref.fact]
  const hasEvidence = (refs: EvidenceRef[]) => refs.every(ref => Boolean(evidence(ref)))
  const evidenceSources = (refs: EvidenceRef[]) => unique(refs.map(ref => ref.sourceId))

  function fact(ref: EvidenceRef) {
    const value = evidence(ref)
    if (!value) throw new Error(`Unconfirmed evidence: ${ref.sourceId}/${ref.fact}`)
    return value
  }
  function paragraph(refs: EvidenceRef[]) {
    return unique(refs.map(fact)).join(' ')
  }

  const race = recipe.contest ? contestLinks(recipe.contest) : null
  const personIds = unique([...(recipe.people ?? []), ...(race?.people ?? [])]).sort()
  const partyCodes = unique([...(recipe.parties ?? []), ...(race?.parties ?? [])]).sort()
  const commitments: StoryCommitment[] = []
  const commitment = recipe.commitment
  if (commitment && evidence(commitment)) {
    if (!personIds.includes(commitment.personId)) throw new Error('Commitment is unlinked to the story subject')
    const { fact: _fact, ...details } = commitment
    commitments.push(details)
  }

  const sourceComparisons: StorySourceComparison[] = (recipe.sourceComparisons ?? [])
    .filter(item => hasEvidence(item.evidence))
    .map(item => {
      const [first, second, ...others] = evidenceSources(item.evidence)
      return { summary: item.summary, sourceIds: [first, second, ...others] }
    })
  const timeline: StoryTimelineEntry[] = (recipe.timeline ?? [])
    .filter(item => hasEvidence(item.evidence))
    .map(({ evidence: refs, ...item }) => ({ ...item, summary: paragraph(refs), sourceIds: evidenceSources(refs) }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const explanation = paragraph(recipe.explanation)
  const context = paragraph(recipe.context)
  const significance = paragraph(recipe.significance)
  const quizExplanation = fact(recipe.quiz)
  const { id, prompt, answer, distractors, sourceId } = recipe.quiz
  const options = [answer, ...distractors].sort((left, right) => digest([recipe.id, left]).localeCompare(digest([recipe.id, right])))
  if (!isId(id) || !prompt || !matches(normalize(quizExplanation), [[answer]]) ||
    unique(options.map(normalize)).length !== options.length || options.some(option => !normalize(option))) {
    throw new Error('The quiz needs a distinct, supported correct answer')
  }

  function toSource({ config, facts }: SourceRecord): StorySource {
    const { id, title, publisher, url, publishedAt } = config
    return { id, title, publisher, url, ...(publishedAt && { publishedAt }), evidence: unique(Object.values(facts)).join(' ') }
  }
  const story: DraftStory = {
    id: recipe.id, title: recipe.title, topic: recipe.topic, publishedAt: primary.config.publishedAt!,
    personIds, partyCodes, sources: [toSource(primary), ...attached.slice(1).map(toSource)],
    explanation, context, significance, commitments,
    ...(sourceComparisons.length > 0 && { sourceComparisons }),
    ...(timeline.length > 0 && { timeline }),
    ...(recipe.openQuestion && { openQuestion: recipe.openQuestion }),
    quiz: { id, prompt, options, correct: options.indexOf(answer), explanation: quizExplanation, sourceIds: [sourceId] },
  }
  return {
    revision: digest(story),
    story,
    cluster: clustered.map(record => record.config.id),
    provenance: attached.map(({ config, capture }) => ({ sourceId: config.id, retrievedAt: capture.retrievedAt, mode: capture.provenance })),
  }
}

export async function generateDrafts({
  mode, now = new Date(), request = fetch,
}: { mode: 'recorded' | 'live'; now?: Date; request?: typeof fetch }): Promise<DraftBatch> {
  validateDesk()
  const collectedAt = now.toISOString()
  const records: SourceRecord[] = []
  const issues: DraftBatch['issues'] = []
  for (let start = 0; start < sourceConfigs.length; start += 3) {
    const items = sourceConfigs.slice(start, start + 3)
    const outcomes = await Promise.allSettled(items.map(async config => {
      if (config.kind === 'catalogue') {
        const contest = catalogueSources.get(config.id)
        if (!contest) throw new Error('Catalogue record is unavailable')
        return collectFacts(config, catalogueCapture(contest, config.title, captures.reviewedAt))
      }
      if (mode === 'live') return collectLive(config, hosts, collectedAt, request)
      const capture = captures.captures[config.id]
      if (!capture) throw new Error('No recorded source evidence')
      return collectFacts(config, { ...capture, retrievedAt: captures.reviewedAt, provenance: 'recorded' })
    }))
    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') records.push(outcome.value)
      else issues.push({ id: items[index].id, reason: outcome.reason instanceof Error ? outcome.reason.message : 'Source collection failed' })
    })
  }
  const drafts = recipes.flatMap(recipe => {
    try {
      return [buildDraft(recipe, records)]
    } catch (error) {
      issues.push({ id: recipe.id, reason: error instanceof Error ? error.message : 'Story generation failed' })
      return []
    }
  })
  return { collectedAt, mode, drafts, issues }
}
