#!/usr/bin/env zx
/**
 * docs-stub-originals — scaffolds a stub .md for every original (`local`)
 * symbol in docs/_meta/proxies.json that doesn't already have a page.
 *
 *   pnpm docs:stub-originals
 *
 * Idempotent — never overwrites an existing file. Run after `pnpm docs:sync`
 * (which produces the manifest this reads from).
 */

import 'zx/globals'

$.verbose = false

const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(ROOT, 'docs', '_meta', 'proxies.json')
const TEMPLATE_PATH = path.join(ROOT, 'docs', '_templates', 'original.md')

const manifest = await fs.readJson(MANIFEST_PATH)
const template = await fs.readFile(TEMPLATE_PATH, 'utf8')

let created = 0
let kept = 0

for (const page of manifest.pages) {
  if (page.status !== 'original') continue
  const outPath = path.join(ROOT, page.expectedFile)
  if (await fs.pathExists(outPath)) {
    kept++
    continue
  }
  const body = template.replaceAll('{{NAME}}', page.name).replaceAll('{{AREA}}', page.massamanArea)
  await fs.outputFile(outPath, body)
  created++
}

console.log(chalk.green(`✓ stubbed ${created} originals`))
if (kept > 0) console.log(chalk.gray(`  kept ${kept} existing pages untouched`))
