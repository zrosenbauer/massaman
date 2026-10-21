import assert from 'node:assert/strict'
import { realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { test } from 'node:test'

const ciderpressDir = realpathSync(new URL('../node_modules/ciderpress', import.meta.url))
const cliRequire = createRequire(
  realpathSync(join(ciderpressDir, '..', '@ciderpress/cli/package.json'))
)
const globRequire = createRequire(cliRequire.resolve('fast-glob'))
const micromatchRequire = createRequire(globRequire.resolve('micromatch'))
const braces = micromatchRequire('braces') as {
  (pattern: string): string[]
  compile: (pattern: string) => string
  expand: (pattern: string) => string[]
}

const nested = (open: string, close: string, depth: number) =>
  `${open.repeat(depth)}x${close.repeat(depth)}`

test('patched braces preserves ordinary glob expansion', () => {
  assert.deepEqual(braces.expand('src/{array,object}/*.{ts,tsx}'), [
    'src/array/*.ts',
    'src/array/*.tsx',
    'src/object/*.ts',
    'src/object/*.tsx',
  ])
})

test('patched braces rejects deeply nested braces before compilation or expansion', () => {
  const pattern = nested('{', '}', 4000)
  const expected = { name: 'SyntaxError', message: 'Input exceeds maximum nesting depth (127)' }

  assert.throws(() => braces(pattern), expected)
  assert.throws(() => braces.compile(pattern), expected)
  assert.throws(() => braces.expand(pattern), expected)
})

test('patched braces bounds parentheses and mixed AST nesting too', () => {
  const expected = { name: 'SyntaxError', message: 'Input exceeds maximum nesting depth (127)' }

  assert.throws(() => braces(nested('(', ')', 4000)), expected)
  assert.throws(() => braces(nested('{(', ')}', 100)), expected)
})

test('patched braces permits nesting up to the limit', () => {
  assert.doesNotThrow(() => braces(nested('{', '}', 127)))
  assert.doesNotThrow(() => braces.expand(nested('{', '}', 127)))
  assert.throws(() => braces(nested('{', '}', 128)), SyntaxError)
})

test('patched braces does not mistake sibling groups or escaped braces for nesting', () => {
  assert.doesNotThrow(() => braces.compile('{a,b}'.repeat(1000)))
  assert.doesNotThrow(() => braces.compile('\\{'.repeat(1000)))
})
