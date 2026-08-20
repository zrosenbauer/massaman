/**
 * docs-stub-originals — scaffolds a reference page for every original (`local`)
 * symbol in docs/_meta/proxies.json that doesn't already have a page.
 *
 *   pnpm docs:stub-originals
 *
 * Idempotent — never overwrites an existing file. Run after `pnpm docs:sync`
 * (which produces the manifest this reads from).
 */

import 'zx/globals'

$.verbose = false

const ROOT = path.resolve(import.meta.dirname, '../../..')
const MANIFEST_PATH = path.join(ROOT, 'docs', '_meta', 'proxies.json')
const TEMPLATE_PATH = path.join(ROOT, 'docs', '_templates', 'original.mdx')

type ManifestPage = {
  status: string
  expectedFile: string
  name: string
  massamanArea: string
}

type StubResult = 'created' | 'kept' | 'skipped'

export const stubOriginals = async (): Promise<void> => {
  const manifest = (await fs.readJson(MANIFEST_PATH)) as { pages: ManifestPage[] }
  const template = await fs.readFile(TEMPLATE_PATH, 'utf8')
  const results = await Promise.all(
    manifest.pages.map(async (page): Promise<StubResult> => {
      if (page.status !== 'original') return 'skipped'
      const outPath = path.join(ROOT, page.expectedFile)
      if (await fs.pathExists(outPath)) return 'kept'

      const body = template
        .replaceAll('{{NAME}}', page.name)
        .replaceAll('{{AREA}}', page.massamanArea)
      await fs.outputFile(outPath, body)
      return 'created'
    })
  )
  const created = results.filter((result) => result === 'created').length
  const kept = results.filter((result) => result === 'kept').length

  console.log(chalk.green(`✓ stubbed ${created} originals`))
  if (kept > 0) console.log(chalk.gray(`  kept ${kept} existing pages untouched`))
}
