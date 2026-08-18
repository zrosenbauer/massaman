import { defineConfig, type IconId, type Page } from 'ciderpress'

import { brandColor, theme } from '#site/theme'

// Single source of truth for the version on the site: the published
// package's own manifest, so the hero eyebrow can't drift from the release.
// Imported by relative path rather than as `massaman/package.json` because
// the package's `exports` map does not expose `./package.json`, and as a JSON
// import rather than `readFileSync` because this config is bundled into the
// client build, where `node:fs` cannot resolve.
import pkg from './packages/massaman/package.json'

const referencePage = (title: string, slug: string, icon: IconId): Page => ({
  title,
  path: `/reference/${slug}`,
  include: `docs/reference/${slug}/*.{md,mdx}`,
  icon: { id: icon, color: brandColor },
  discover: { sort: 'alpha' as const },
})

export default defineConfig({
  title: 'massaman',
  description: 'A rich blend of functional patterns.',
  theme,
  brand: {
    logo: '/logo.svg',
    favicon: { src: '/icon.svg', type: 'image/svg+xml' },
    loader: {
      content: '/icon.svg',
      label: 'loading',
      minDisplayMs: 200,
      maxDisplayMs: 4000,
    },
  },
  editLink: { repo: 'zrosenbauer/massaman', branch: 'main', directory: 'docs' },
  reportLink: { repo: 'zrosenbauer/massaman' },
  feedback: false,
  home: {
    hero: {
      label: `v${pkg.version} · MIT`,
      tagline:
        'A functional TypeScript utility library with Rust-inspired Result types and exhaustive pattern matching, built on es-toolkit and ts-pattern.',
      actions: [
        {
          variant: 'primary',
          text: 'Install massaman',
          href: '/installation',
          icon: 'pixelarticons:download',
        },
        {
          variant: 'secondary',
          text: 'Browse the API',
          href: '/reference',
          icon: 'pixelarticons:list-box',
        },
      ],
      demo: {
        type: 'image',
        src: '/hero-ide.svg',
        alt: 'Split TypeScript editor showing match and attemptAsync with Result handling',
      },
    },
    blocks: [
      {
        type: 'proof',
        lead: 'built on',
        names: ['es-toolkit', 'ts-pattern', 'TypeScript'],
      },
      {
        type: 'features',
        columns: 3,
        label: 'The good parts',
        title: 'Small functions. Strong guarantees.',
        body: 'Use the flat import surface or pull from focused subpaths. Every export tree-shakes.',
        items: [
          {
            title: 'Errors are values',
            description: 'Wrap unsafe work in Result and keep failure visible in the type.',
            icon: { id: 'pixelarticons:shield', color: brandColor },
            link: '/concepts/result',
          },
          {
            title: 'Exhaustive matching',
            description: 'Match typed patterns and let TypeScript catch every unhandled case.',
            icon: { id: 'pixelarticons:git-branch', color: brandColor },
            link: '/concepts/match',
          },
          {
            title: 'Composable by default',
            description:
              'Build data flows from small functions instead of mutation and hidden state.',
            icon: { id: 'pixelarticons:zap', color: brandColor },
            link: '/concepts/composition',
          },
          {
            title: 'One utility surface',
            description:
              'Array, object, string, math, promise, and predicate helpers under one roof.',
            icon: { id: 'pixelarticons:card-stack', color: brandColor },
            link: '/reference',
          },
          {
            title: 'Types stay sharp',
            description:
              'Variadic predicates and type-level tests preserve inference through the pipeline.',
            icon: { id: 'pixelarticons:check-double', color: brandColor },
            link: '/reference/predicate',
          },
          {
            title: 'Pay for what you import',
            description: 'ESM-only, side-effect free, and split into focused public subpaths.',
            icon: { id: 'pixelarticons:chart', color: brandColor },
            link: '/installation',
          },
        ],
      },
      {
        type: 'tabs',
        orientation: 'horizontal',
        label: 'Result + pattern matching',
        title: 'Handle failure as data.',
        body: 'One task, written both ways. Assume fetchUser() throws a Response on HTTP failure.',
        items: [
          {
            label: 'Without massaman',
            icon: { id: 'pixelarticons:alert', color: brandColor },
            title: 'Exceptions, then manual narrowing',
            body: 'The catch block receives unknown, so every branch has to re-establish what the failure was before it can say anything about it.',
            bullets: [
              'message is a let, reassigned across branches',
              'unknown must be narrowed before the status is readable',
              'Nothing tells you when a case is missing',
            ],
            visual: {
              type: 'code',
              language: 'ts',
              code: `let message: string

try {
  const user = await fetchUser(userId)
  message = \`Welcome, \${user.name}\`
} catch (error: unknown) {
  if (error instanceof Response) {
    if (error.status === 404) {
      message = 'User not found'
    } else if (error.status >= 500) {
      message = 'The service is unavailable'
    } else {
      message = \`Request failed: \${error.status}\`
    }
  } else if (error instanceof Error) {
    message = \`Could not load user: \${error.message}\`
  } else {
    message = \`Could not load user: \${String(error)}\`
  }
}`,
            },
          },
          {
            label: 'With massaman',
            icon: { id: 'pixelarticons:check', color: brandColor },
            title: 'Failure as a value',
            body: 'attemptAsync turns the throw into a Result, so the whole thing collapses into one expression that produces message directly.',
            bullets: [
              'message is a const, assigned once',
              'Thrown non-Errors normalize and keep the original as error.cause',
              'exhaustive() fails typechecking on an unhandled case',
            ],
            cta: {
              text: 'Read the Result guide',
              href: '/concepts/result',
              variant: 'secondary',
              icon: 'pixelarticons:arrow-right',
            },
            visual: {
              type: 'code',
              language: 'ts',
              code: `const user = await attemptAsync(() => fetchUser(userId))

const message = match(user)
  .with(P.err({ cause: { status: 404 } }), () => 'User not found')
  .with(P.err({ cause: { status: P.number.gte(500) } }), () =>
    'The service is unavailable',
  )
  .with(P.ok(), ({ value }) => \`Welcome, \${value.name}\`)
  .with(P.err(), ({ error }) => \`Could not load user: \${error.message}\`)
  .exhaustive()`,
            },
          },
        ],
      },
      {
        type: 'cta',
        title: 'Start with one function.',
        body: 'Install massaman, import what you need, and keep the rest out of your bundle.',
        actions: [
          { text: 'Get started', href: '/installation', variant: 'primary' },
          {
            text: 'View on GitHub',
            href: 'https://github.com/zrosenbauer/massaman',
            variant: 'secondary',
            icon: 'simple-icons:github',
          },
        ],
      },
    ],
  },
  topbar: {
    nav: [
      { title: 'Introduction', link: '/introduction' },
      { title: 'Philosophy', link: '/philosophy' },
      { title: 'Concepts', link: '/concepts' },
      { title: 'Reference', link: '/reference' },
    ],
    cta: { text: 'Install massaman', href: '/installation' },
  },
  pages: [
    {
      title: 'Overview',
      path: '/overview',
      include: 'docs/index.md',
      nav: { hidden: true },
    },
    {
      title: 'Introduction',
      path: '/introduction',
      include: 'docs/intro.mdx',
      icon: { id: 'pixelarticons:book-open', color: brandColor },
    },
    {
      title: 'Philosophy',
      path: '/philosophy',
      include: 'docs/philosophy.md',
      icon: { id: 'pixelarticons:lightbulb-on', color: brandColor },
    },
    {
      title: 'Installation',
      path: '/installation',
      include: 'docs/installation.mdx',
      icon: { id: 'pixelarticons:download', color: brandColor },
    },
    {
      title: 'Concepts',
      description: 'Failure as data, exhaustive branching, and composable transformations.',
      path: '/concepts',
      include: 'docs/concepts/*.md',
      icon: { id: 'pixelarticons:card-stack', color: brandColor },
      discover: { sort: 'alpha' },
    },
    {
      title: 'Reference',
      description: 'Every exported function, grouped by public surface.',
      path: '/reference',
      icon: { id: 'pixelarticons:list-box', color: brandColor },
      landing: true,
      pages: [
        referencePage('Array', 'array', 'pixelarticons:list'),
        referencePage('BigInt', 'bigint', 'pixelarticons:hashtag'),
        referencePage('Control', 'control', 'pixelarticons:shield'),
        referencePage('Conversion', 'conversion', 'pixelarticons:arrows-horizontal'),
        referencePage('Error', 'error', 'pixelarticons:alert'),
        referencePage('Functional', 'fp', 'pixelarticons:git-branch'),
        referencePage('Function', 'function', 'pixelarticons:brackets-angle'),
        referencePage('Pattern', 'match', 'pixelarticons:shuffle'),
        referencePage('Math', 'math', 'pixelarticons:calculator'),
        referencePage('Object', 'object', 'pixelarticons:table'),
        referencePage('Predicate', 'predicate', 'pixelarticons:check'),
        referencePage('Promise', 'promise', 'pixelarticons:clock'),
        referencePage('String', 'string', 'pixelarticons:file-text'),
      ],
    },
  ],
  socials: [
    { icon: 'github', url: 'https://github.com/zrosenbauer/massaman' },
    { icon: 'npm', url: 'https://www.npmjs.com/package/massaman' },
  ],
  footer: {
    brandMark: '{λ}',
    message: 'A rich blend of functional patterns.',
    copyright: { company: 'massaman' },
    tagline: 'Built with Ciderpress.',
    columns: [
      {
        heading: 'Learn',
        links: [
          { text: 'Installation', href: '/installation' },
          { text: 'Concepts', href: '/concepts' },
          { text: 'Reference', href: '/reference' },
        ],
      },
      {
        heading: 'Project',
        links: [
          { text: 'GitHub', href: 'https://github.com/zrosenbauer/massaman' },
          { text: 'npm', href: 'https://www.npmjs.com/package/massaman' },
          {
            text: 'Contributing',
            href: 'https://github.com/zrosenbauer/massaman/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],
    socials: true,
  },
})
