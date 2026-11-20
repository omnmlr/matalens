import { parse } from 'parse5'
import type { DefaultTreeAdapterMap } from 'parse5'
import { isDay, isId, type Capture, type SourceConfig, type SourceRecord } from './model.ts'

type HtmlNode = DefaultTreeAdapterMap['node']
type HtmlElement = DefaultTreeAdapterMap['element']
type Fetch = typeof fetch

const discard = new Set(['head', 'script', 'style', 'noscript', 'nav', 'footer', 'aside', 'form', 'svg', 'template', 'iframe'])
const maxBytes = 3 * 1024 * 1024

export function normalize(text: string) {
  const separated = text.normalize('NFKD').replace(/\p{M}|[’']/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ')
  return separated.trim()
}

export function matches(haystack: string, terms: string[][]) {
  return terms.every(group => group.some(term => (' ' + haystack + ' ').includes(' ' + normalize(term) + ' ')))
}

function isElement(node: HtmlNode): node is HtmlElement {
  return 'tagName' in node
}

function findElement(node: HtmlNode, preferred: string): HtmlElement | undefined {
  if (isElement(node)) {
    if (node.tagName === preferred) return node
    if (node.tagName !== 'head' && discard.has(node.tagName)) return undefined
  }
  if ('childNodes' in node) {
    for (const child of node.childNodes) {
      const found = findElement(child, preferred)
      if (found) return found
    }
  }
}

function textOf(node: HtmlNode): string {
  if ('value' in node && node.nodeName === '#text') return node.value
  if (isElement(node) && discard.has(node.tagName)) return ''
  return 'childNodes' in node ? node.childNodes.map(textOf).join(' ') : ''
}

export function htmlCapture(html: string, retrievedAt: string, expectedTitle: string): Capture {
  const tree = parse(html)
  const body = findElement(tree, 'body') ?? tree
  const main = findElement(body, 'main') ?? body
  const article = findElement(main, 'article')
  const titleElement = findElement(tree, 'title')
  for (const region of (article ? [article, main] : [main])) {
    const heading = findElement(region, 'h1')
    const title = [heading, titleElement].flatMap(element => element ? [textOf(element).trim()] : [])
      .find(candidate => matches(normalize(candidate), [[expectedTitle]]))
    if (title) return { title, text: textOf(region), retrievedAt, provenance: 'live' }
  }
  throw new Error('Original headline unavailable')
}

export function collectFacts(config: SourceConfig, capture: Capture): SourceRecord {
  const title = normalize(capture.title)
  if (!matches(title, [[config.title]])) throw new Error('The original headline differs from the registered source')
  const text = normalize(capture.text)
  const facts = Object.fromEntries(Object.entries(config.evidence)
    .filter(([, proof]) => matches(text, proof.terms))
    .map(([id, proof]) => [id, proof.summary]))
  if (!Object.keys(facts).length) throw new Error('Registered evidence is absent')
  return { config, capture, facts }
}

export function validateSource(config: SourceConfig) {
  const url = new URL(config.url)
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !isId(config.id) ||
    !config.title || !config.publisher || (config.publishedAt && !isDay(config.publishedAt))) {
    throw new Error(`Invalid source registration: ${config.id}`)
  }
  const anchors = Object.entries(config.evidence)
  if (!anchors.length || anchors.some(([id, fact]) => !isId(id) || !fact.summary || invalidTerms(fact.terms))) {
    throw new Error(`Invalid source evidence: ${config.id}`)
  }
}

export const invalidTerms = (terms: string[][]) => !terms.length ||
  terms.some(group => !group.length || group.some(term => !normalize(term)))

function publicUrl(value: URL, hosts: Set<string>) {
  if (value.protocol !== 'https:' || value.username || value.password || value.port || !hosts.has(value.hostname)) {
    throw new Error('Source redirected outside the registered publishers')
  }
}

async function collectHtml(url: URL, hosts: Set<string>, request: Fetch): Promise<string> {
  const signal = AbortSignal.timeout(9_000)
  for (let redirect = 0; redirect < 4; redirect++) {
    publicUrl(url, hosts)
    const response = await request(url, {
      signal, redirect: 'manual',
      headers: { Accept: 'text/html', 'User-Agent': 'MataLens-Editorial/1.0' },
    })
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location')
      await response.body?.cancel()
      if (!location) throw new Error('Source redirected without a destination')
      url = new URL(location, url)
      continue
    }
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html') ||
      Number(response.headers.get('content-length')) > maxBytes || !response.body) {
      await response.body?.cancel()
      throw new Error(`Source could not be read (HTTP ${response.status})`)
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    let bytes = 0
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) return text + decoder.decode()
        bytes += value.byteLength
        if (bytes > maxBytes) throw new Error('Source exceeds the download limit')
        text += decoder.decode(value, { stream: true })
      }
    } finally {
      await reader.cancel().catch(() => {})
    }
  }
  throw new Error('Source exceeded the redirect limit')
}

export async function collectLive(config: SourceConfig, hosts: Set<string>, retrievedAt: string, request: Fetch) {
  const html = await collectHtml(new URL(config.url), hosts, request)
  return collectFacts(config, htmlCapture(html, retrievedAt, config.title))
}
