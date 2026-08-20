#!/usr/bin/env zx

import { cac } from 'cac'

import { buildDocs } from './lib/docs/build.ts'
import { stubOriginals } from './lib/docs/stub-originals.ts'
import { syncDocs } from './lib/docs/sync.ts'

const cli = cac('massaman-docs')

cli
  .command('sync', 'Synchronize upstream reference documentation')
  .option('--check', 'Verify generated documentation without writing changes')
  .action(({ check = false }: { check?: boolean }) => syncDocs({ check }))

cli.command('build', 'Post-process the generated Ciderpress site').action(buildDocs)
cli
  .command('stub', 'Create missing reference pages for Massaman-owned exports')
  .action(stubOriginals)

cli.help()
cli.parse(process.argv.toSpliced(1, 1), { run: false })
await cli.runMatchedCommand()
