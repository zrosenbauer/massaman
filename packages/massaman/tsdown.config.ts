import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/predicate/index.ts',
    'src/array/index.ts',
    'src/object/index.ts',
    'src/function/index.ts',
    'src/string/index.ts',
    'src/control/index.ts',
    'src/pattern/index.ts',
    'src/math/index.ts',
    'src/promise/index.ts',
    'src/error/index.ts',
    'src/conversion/index.ts',
  ],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  unbundle: false,
  platform: 'node',
  target: 'node22',
})
