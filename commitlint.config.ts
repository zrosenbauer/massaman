import type { UserConfig } from '@commitlint/types'

import conventions from './commit-conventions.json' with { type: 'json' }

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [...conventions.types]],
    'type-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', [...conventions.scopes]],
    'scope-case': [0],
    'scope-empty': [1, 'never'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
  },
} satisfies UserConfig
