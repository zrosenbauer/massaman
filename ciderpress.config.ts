import { defineConfig, type IconId, type Page } from 'ciderpress'

import { brandColor, theme } from '#site/theme'

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
      label: 'Functional TypeScript, without a framework',
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
        src: '/hero-ide.svg',
        alt: 'Split TypeScript editor showing match and attemptAsync with Result handling',
      },
    },
    proof: {
      lead: 'built on',
      names: ['es-toolkit', 'ts-pattern', 'TypeScript'],
    },
    features: {
      columns: 3,
      heading: {
        label: 'The good parts',
        title: 'Small functions. Strong guarantees.',
        subtitle:
          'Use the flat import surface or pull from focused subpaths. Every export tree-shakes.',
      },
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
    showcase: {
      columns: 3,
      source: ['/installation', '/concepts', '/reference'],
      heading: {
        label: 'Pick a route',
        title: 'Start where the problem is.',
        subtitle: 'Install it, learn the model, or jump directly to a function.',
      },
    },
    split: {
      label: 'Result + pattern matching',
      title: 'Handle failure as data.',
      body: 'Catch unsafe code at the edge, then handle each outcome with typed values and exhaustive matching.',
      bullets: [
        'Thrown values normalize to Error',
        'Ok and Err narrow without casts',
        'P.ok and P.err cover both outcomes',
      ],
      cta: {
        text: 'Read the Result guide',
        href: '/concepts/result',
        variant: 'secondary',
        icon: 'pixelarticons:arrow-right',
      },
      visual: {
        language: 'ts',
        code: `const result = attempt(() => JSON.parse(input))

return match(result)
  .with(P.ok(), ({ value }) => use(value))
  .with(P.err(), ({ error }) => report(error))
  .exhaustive()`,
      },
    },
    cta: {
      title: 'Start with one function.',
      subtitle: 'Install massaman, import what you need, and keep the rest out of your bundle.',
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
    layout: ['hero', 'proof', 'features', 'split', 'showcase', 'cta'],
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
