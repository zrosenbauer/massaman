#!/usr/bin/env zx
/**
 * docs-sync — mirrors per-symbol reference docs from upstream packages into
 * docs/reference/<area>/<name>.mdx, adding an inline source badge and a proxy
 * disclosure at the bottom. Hand-written pages (originals, ts-pattern, prose, concepts) are
 * never touched.
 *
 * Modes:
 *   pnpm docs:sync              # write
 *   pnpm docs:sync:check        # CI — fail on drift, no writes
 *
 * Inputs:
 *   docs/_meta/upstream-versions.json   (pinned tags)
 *   packages/massaman/src/<area>/index.ts (re-export classifications)
 *
 * Outputs:
 *   docs/reference/<area>/<name>.mdx    (proxy pages)
 *   docs/_meta/proxies.json             (manifest)
 */

import 'zx/globals'
import { withReferenceDescription } from './docs-descriptions.mjs'
import { transformReferenceFields } from './docs-fields.mjs'

$.verbose = false

const ROOT = path.resolve(__dirname, '..')
const META_PATH = path.join(ROOT, 'docs', '_meta', 'upstream-versions.json')
const MANIFEST_PATH = path.join(ROOT, 'docs', '_meta', 'proxies.json')
const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache', 'docs-sync')
const SRC_ROOT = path.join(ROOT, 'packages', 'massaman', 'src')
const DOCS_REF = path.join(ROOT, 'docs', 'reference')

const CHECK_MODE = process.argv.includes('--check')

async function main() {
  const cfg = await fs.readJson(META_PATH)
  const es = cfg['es-toolkit']
  const tsp = cfg['ts-pattern']

  console.log(
    chalk.cyan(
      `docs-sync ${CHECK_MODE ? '(check)' : ''} — es-toolkit@${es.version}, ts-pattern@${tsp.version}`
    )
  )

  const upstreamDir = await ensureUpstream(es.repo, es.version)

  const classifications = await classifyAllExports()

  const manifest = []
  const errors = []
  const expectedFiles = new Set()
  let wrote = 0
  let proxyHandWritten = 0
  let locals = 0

  await migrateHandWrittenFields(errors)

  for (const c of classifications) {
    if (c.kind === 'local') {
      locals++
      const expectedFile = await existingRef(c)
      if (expectedFile === null) errors.push(`missing local reference page: ${refBase(c)}`)
      manifest.push({
        ...c,
        status: 'original',
        expectedFile: expectedFile ?? `${refBase(c)}.mdx`,
      })
      continue
    }

    if (c.kind === 'proxy:ts-pattern') {
      const expectedFile = await existingRef(c)
      if (expectedFile === null) errors.push(`missing ts-pattern reference page: ${refBase(c)}`)
      proxyHandWritten++
      manifest.push({
        ...c,
        status: 'hand-written',
        source: 'ts-pattern',
        upstreamUrl: tsp.siteUrl,
        expectedFile: expectedFile ?? `${refBase(c)}.mdx`,
      })
      continue
    }

    // proxy:es-toolkit
    const upstreamMd = path.join(
      upstreamDir,
      'docs',
      ...upstreamDocSegments(c.upstreamArea, c.name)
    )
    if (!(await fs.pathExists(upstreamMd))) {
      const undocumentedReason = (es.undocumentedUpstream ?? {})[`${c.upstreamArea}/${c.name}`]
      if (!undocumentedReason) {
        errors.push(
          `missing upstream doc: es-toolkit/${c.upstreamArea}/${c.name}.md (re-exported as massaman/${c.massamanArea})`
        )
        continue
      }
      // Allowlisted: upstream ships the symbol but has no reference page for it,
      // so we own the page by hand. Never generated, never overwritten — but it
      // still has to exist, or the export ships undocumented.
      const handWrittenPath = await existingRef(c)
      if (handWrittenPath === null) {
        errors.push(`allowlisted as undocumented upstream but no hand-written page: ${refBase(c)}`)
        continue
      }
      proxyHandWritten++
      manifest.push({
        ...c,
        status: 'hand-written',
        source: 'es-toolkit',
        undocumentedUpstream: undocumentedReason,
        expectedFile: handWrittenPath,
      })
      continue
    }
    const upstreamUrl = upstreamDocUrl(es, c.upstreamArea, c.name)
    const original = await fs.readFile(upstreamMd, 'utf8')
    const mutated = withProxyTitle(
      withReferenceDescription(
        decorateProxyPage(transformReferenceFields(original).content, c.name, upstreamUrl)
      ),
      c.name
    )
    const outPath = path.join(DOCS_REF, c.massamanArea, `${c.name}.mdx`)
    const stalePath = path.join(DOCS_REF, c.massamanArea, `${c.name}.md`)
    expectedFiles.add(outPath)

    if (CHECK_MODE) {
      const existing = await fs.readFile(outPath, 'utf8').catch(() => null)
      if (existing !== mutated) {
        errors.push(`drift: docs/reference/${c.massamanArea}/${c.name}.mdx`)
      }
      if (await fs.pathExists(stalePath)) errors.push(`stale proxy: ${refBase(c)}.md`)
    } else {
      await fs.outputFile(outPath, mutated)
      await fs.remove(stalePath)
    }
    wrote++
    manifest.push({
      ...c,
      status: 'proxy',
      source: 'es-toolkit',
      upstreamUrl,
      expectedFile: `${refBase(c)}.mdx`,
    })
  }

  // Orphan detection: proxy .md on disk that no longer maps to a re-export.
  // We can't blanket-flag all .md (originals are hand-written), so we scope to
  // "looks like a proxy" — has the canonical callout marker on line 3.
  await detectOrphans(manifest, errors)
  await detectPlaceholderPages(errors)
  await normalizeReferenceDescriptions(errors)

  if (!CHECK_MODE) {
    await fs.outputJson(
      MANIFEST_PATH,
      {
        $comment: 'Generated by scripts/docs-sync.mjs — do not edit by hand.',
        generatedAt: new Date().toISOString(),
        versions: { 'es-toolkit': es.version, 'ts-pattern': tsp.version },
        counts: { proxy: wrote, handWrittenProxy: proxyHandWritten, original: locals },
        pages: manifest.sort((a, b) =>
          `${a.massamanArea}/${a.name}`.localeCompare(`${b.massamanArea}/${b.name}`)
        ),
      },
      { spaces: 2 }
    )
  }

  // Summary
  console.log(
    chalk.green(`  ${CHECK_MODE ? 'verified' : 'wrote'} ${wrote} proxy pages from es-toolkit`)
  )
  console.log(chalk.gray(`  ${proxyHandWritten} proxy pages are hand-written (not generated)`))
  console.log(chalk.gray(`  ${locals} originals expected (hand-written, not touched)`))

  if (errors.length > 0) {
    console.log(chalk.red(`\n✗ ${errors.length} issue(s):`))
    for (const e of errors) console.log(chalk.red(`  - ${e}`))
    process.exit(1)
  }
  console.log(chalk.green('\n✓ ok'))
}

// -----------------------------------------------------------------------------

async function ensureUpstream(repo, version) {
  const dir = path.join(CACHE_DIR, `es-toolkit-${version}`)
  const docsDir = path.join(dir, 'docs', 'reference')
  if (await fs.pathExists(docsDir)) {
    return dir
  }
  await fs.remove(dir)
  await fs.ensureDir(CACHE_DIR)
  console.log(chalk.gray(`  cloning ${repo}@v${version} into node_modules/.cache/docs-sync/`))
  await $`git clone --depth 1 --branch v${version} --filter=blob:none --sparse https://github.com/${repo}.git ${dir}`
  await $`git -C ${dir} sparse-checkout set docs`
  return dir
}

/**
 * Upstream keeps most reference pages under `docs/reference/<area>/`, but newer
 * entrypoints are top-level doc sections with their own `docs/<area>/reference/`
 * tree, and the published URL mirrors the on-disk path. `fp` is the one we
 * currently mirror; the rest are listed so adding them later is a re-export away.
 */
const SECTION_AREAS = new Set(['compat', 'fp', 'server', 'types'])

function upstreamDocSegments(area, name) {
  return SECTION_AREAS.has(area)
    ? [area, 'reference', `${name}.md`]
    : ['reference', area, `${name}.md`]
}

function upstreamDocUrl(es, area, name) {
  return SECTION_AREAS.has(area)
    ? `${es.siteOrigin}/${area}/reference/${name}.html`
    : `${es.siteUrl}/${area}/${name}.html`
}

async function classifyAllExports() {
  const out = []
  const entries = await fs.readdir(SRC_ROOT, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'types') continue
    const indexPath = path.join(SRC_ROOT, entry.name, 'index.ts')
    if (!(await fs.pathExists(indexPath))) continue
    const content = await fs.readFile(indexPath, 'utf8')
    const exports = parseExports(content)
    for (const e of exports) {
      out.push({ ...e, massamanArea: entry.name })
    }
  }
  return out
}

/**
 * Parse `export { ... } from '...'` blocks. Skips `export type { ... }` and
 * inline-type names (`type Foo`). Handles `name as alias` (uses the alias).
 */
function parseExports(content) {
  const out = []
  const blockRe = /export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = blockRe.exec(content)) !== null) {
    const isTypeBlock = Boolean(m[1])
    if (isTypeBlock) continue
    const names = m[2]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !/^type\s+/.test(s))
      .map((s) => {
        const asMatch = s.match(/\s+as\s+(\S+)/)
        return asMatch ? asMatch[1].trim() : s
      })
    const src = m[3]
    for (const name of names) {
      if (src.startsWith('./')) {
        out.push({ name, kind: 'local' })
      } else if (src.startsWith('es-toolkit/')) {
        out.push({
          name,
          kind: 'proxy:es-toolkit',
          upstreamArea: src.slice('es-toolkit/'.length),
        })
      } else if (src === 'ts-pattern') {
        out.push({ name, kind: 'proxy:ts-pattern' })
      }
    }
  }
  return out
}

// Sentinel substring used by orphan detection. Must be unique to generated
// proxy pages and remain in the disclosure below.
const CALLOUT_MARKER = '<summary>Source: es-toolkit</summary>'

function injectProxyCallout(content, upstreamUrl) {
  const disclosure =
    `<details>\n` +
    `${CALLOUT_MARKER}\n\n` +
    `Re-exported verbatim from [\`es-toolkit\`](${upstreamUrl}). Implementation, edge cases, and performance behavior are owned upstream. This page mirrors the documentation at the pinned version; the linked source is authoritative.\n\n` +
    `</details>\n`
  return `${content.trimEnd()}\n\n${disclosure}`
}

function decorateProxyPage(content, name, upstreamUrl) {
  const withImport = content.includes("from '@ciderpress/ui/theme'")
    ? content.replace(
        /import \{ ([^}]+) \} from '@ciderpress\/ui\/theme'/u,
        (_match, imports) =>
          `import { ${['Badge', ...imports.split(',').map((item) => item.trim())]
            .filter((item, index, values) => values.indexOf(item) === index)
            .sort()
            .join(', ')} } from '@ciderpress/ui/theme'`
      )
    : content.replace(/^(#\s+\S[^\n]*\n)/mu, `import { Badge } from '@ciderpress/ui/theme'\n\n$1`)
  const withBadge = withImport.replace(
    /^(#\s+\S[^\n]*)$/mu,
    `$1 <Badge color="#c85a3e">es-toolkit</Badge>`
  )
  return rewriteUpstreamCrossRefs(injectProxyCallout(withBadge, upstreamUrl))
}

function withProxyTitle(content, name) {
  return content.replace(/^---\r?\n/u, `---\ntitle: ${JSON.stringify(name)}\n`)
}

// Upstream pages reference site-level docs (bundle-size, performance) via
// relative .md paths that exist on es-toolkit.dev but not in our docs tree.
// Rewrite them to absolute URLs so the links resolve.
function rewriteUpstreamCrossRefs(content) {
  return content.replace(
    /\(((?:\.\.\/)+)(bundle-size|performance)\.md(#[^)]*)?\)/g,
    (_match, _depth, page, anchor) => `(https://es-toolkit.dev/${page}.html${anchor ?? ''})`
  )
}

function refBase(c) {
  return `docs/reference/${c.massamanArea}/${c.name}`
}

async function existingRef(c, fallback = false) {
  const candidates = [`${refBase(c)}.mdx`, `${refBase(c)}.md`]
  const existing = await Promise.all(
    candidates.map(async (candidate) => [candidate, await fs.pathExists(candidate)])
  )
  const match = existing.find(([, exists]) => exists)?.[0]
  if (match !== undefined) return match
  if (fallback) return `${refBase(c)}.mdx`
  return null
}

async function detectOrphans(manifest, errors) {
  const expected = new Set(manifest.map((c) => c.expectedFile).filter(Boolean))
  const areas = await fs.readdir(DOCS_REF).catch(() => [])
  for (const area of areas) {
    const areaPath = path.join(DOCS_REF, area)
    const stat = await fs.stat(areaPath).catch(() => null)
    if (!stat?.isDirectory()) continue
    const files = await fs.readdir(areaPath)
    for (const f of files) {
      if ((!f.endsWith('.md') && !f.endsWith('.mdx')) || f.startsWith('_')) continue
      const rel = `docs/reference/${area}/${f}`
      if (expected.has(rel)) continue
      // Only flag as orphan if it looks like a proxy page we generated previously.
      const content = await fs.readFile(path.join(areaPath, f), 'utf8').catch(() => '')
      if (content.includes(CALLOUT_MARKER)) {
        errors.push(`orphan proxy page (no matching re-export): ${rel}`)
      }
    }
  }
}

const PLACEHOLDER_MARKERS = [
  'One-sentence description',
  'Worked-example paragraph',
  'type="Type"',
  'realistic, end-to-end example',
]

async function detectPlaceholderPages(errors) {
  const areas = await fs.readdir(DOCS_REF).catch(() => [])
  const pages = (
    await Promise.all(
      areas.map(async (area) => {
        const areaPath = path.join(DOCS_REF, area)
        const stat = await fs.stat(areaPath).catch(() => null)
        if (!stat?.isDirectory()) return []
        return (await fs.readdir(areaPath))
          .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
          .map((file) => path.join(areaPath, file))
      })
    )
  ).flat()

  await Promise.all(
    pages.map(async (page) => {
      const content = await fs.readFile(page, 'utf8')
      const marker = PLACEHOLDER_MARKERS.find((candidate) => content.includes(candidate))
      if (marker === undefined) return
      errors.push(`placeholder content (${marker}): ${path.relative(ROOT, page)}`)
    })
  )
}

async function normalizeReferenceDescriptions(errors) {
  const areas = await fs.readdir(DOCS_REF).catch(() => [])
  const pages = (
    await Promise.all(
      areas.map(async (area) => {
        const areaPath = path.join(DOCS_REF, area)
        const stat = await fs.stat(areaPath).catch(() => null)
        if (!stat?.isDirectory()) return []
        return (await fs.readdir(areaPath))
          .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
          .map((file) => path.join(areaPath, file))
      })
    )
  ).flat()

  await Promise.all(
    pages.map(async (page) => {
      const content = await fs.readFile(page, 'utf8')
      const normalized = withReferenceDescription(content)
      if (content === normalized) return

      if (CHECK_MODE) {
        errors.push(`reference description drift: ${path.relative(ROOT, page)}`)
        return
      }
      await fs.writeFile(page, normalized)
    })
  )
}

async function migrateHandWrittenFields(errors) {
  const areas = await fs.readdir(DOCS_REF).catch(() => [])
  const referencePaths = (
    await Promise.all(
      areas.map(async (area) => {
        const areaPath = path.join(DOCS_REF, area)
        const stat = await fs.stat(areaPath).catch(() => null)
        if (!stat?.isDirectory()) return []
        const files = await fs.readdir(areaPath)
        return files
          .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
          .map((file) => path.join(areaPath, file))
      })
    )
  ).flat()

  await Promise.all(
    referencePaths.map(async (referencePath) => {
      const original = await fs.readFile(referencePath, 'utf8')
      const transformed = transformReferenceFields(original)
      if (!transformed.changed) return
      const mdxPath = referencePath.replace(/\.md$/u, '.mdx')
      const relative = path.relative(ROOT, referencePath)

      if (CHECK_MODE) {
        errors.push(`reference field markup drift: ${relative}`)
        return
      }

      await fs.outputFile(mdxPath, transformed.content)
      if (referencePath !== mdxPath) await fs.remove(referencePath)
    })
  )
}

await main()
