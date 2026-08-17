import { promises as fs } from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('.ciderpress/dist')
const BASE = process.env.CIDERPRESS_BASE ?? '/'
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js'])
const THEME_OVERRIDES = `<style data-massaman-theme>
html[data-cp-theme='midnight'][data-cp-variant='dark'] {
  --cp-c-brand-1: #df7955;
  --cp-c-brand-2: #c85a3e;
  --cp-c-brand-3: #8f3528;
  --cp-c-brand-fg: #020100;
  --cp-c-brand-soft: rgba(200, 90, 62, 0.12);
  --cp-c-brand-light: #e89a62;
  --cp-c-brand-lighter: #f1cf78;
  --cp-c-bg: #020100;
  --cp-c-bg-alt: #050201;
  --cp-c-bg-elv: #0b0402;
  --cp-c-bg-soft: #070301;
  --cp-c-bg-icon: #1d0e06;
  --cp-c-home-bg: #020100;
  --cp-c-gutter: #050201;
  --cp-code-block-bg: #040201;
  --cp-c-text-1: #f3ecdf;
  --cp-c-text-2: #bca99b;
  --cp-c-text-3: #826e63;
  --cp-c-border: #27170c;
  --cp-c-divider: #332010;
  --cp-c-tint-purple-bg: rgba(200, 90, 62, 0.12);
  --cp-c-tint-purple-fg: #df7955;
  --cp-c-tint-blue-bg: rgba(227, 173, 82, 0.12);
  --cp-c-tint-blue-fg: #e3ad52;
  --cp-c-tint-green-bg: rgba(241, 207, 120, 0.1);
  --cp-c-tint-green-fg: #f1cf78;
  --cp-c-tint-amber-bg: rgba(227, 173, 82, 0.12);
  --cp-c-tint-amber-fg: #e3ad52;
  --cp-c-tint-red-bg: rgba(200, 90, 62, 0.12);
  --cp-c-tint-red-fg: #df7955;
  --cp-c-tint-cyan-bg: rgba(199, 122, 67, 0.12);
  --cp-c-tint-cyan-fg: #c77a43;
  --cp-c-tint-pink-bg: rgba(200, 90, 62, 0.12);
  --cp-c-tint-pink-fg: #df7955;
  --cp-c-tint-purple-bright-fg: #df7955;
  --cp-c-tint-purple-glow: rgba(200, 90, 62, 0.08);
  --cp-c-syntax-kw: #df7955;
  --cp-c-syntax-str: #f1cf78;
  --cp-c-syntax-fn: #e3ad52;
  --cp-c-gradient-hero-cyan: #e3ad52;
  --cp-c-gradient-hero-purple: #c85a3e;
  --cp-button-brand-bg: #c85a3e;
  --cp-button-brand-hover-bg: #df7955;
  --cp-button-brand-active-bg: #8f3528;
  --cp-button-brand-text: #020100;
  --rp-c-bg: #020100;
  --rp-c-bg-alt: #050201;
  --rp-c-bg-dark: #050201;
  --rp-c-bg-mute: #020100;
  --rp-c-bg-soft: #070301;
  --rp-c-brand: #c85a3e;
  --rp-c-brand-light: #df7955;
  --rp-c-brand-lighter: #e89a62;
  --rp-c-brand-dark: #8f3528;
  --rp-c-brand-darker: #6f271f;
  --rp-c-brand-tint: rgba(200, 90, 62, 0.12);
  --rp-c-divider: #332010;
  --rp-c-divider-dark: #27170c;
  --rp-c-divider-light: #332010;
  --rp-c-link: #e3ad52;
  --rp-c-text-1: #f3ecdf;
  --rp-c-text-2: #bca99b;
  --rp-c-text-3: #826e63;
  --rp-c-text-4: #826e63;
  --rp-c-text-code: #f3ecdf;
  --rp-code-block-bg: #040201;
  --rp-home-background-bg: #020100;
  --rp-home-feature-bg: #070301;
  --rp-home-hero-secondary-color: #bca99b;
  --rp-home-hero-title-color: #f3ecdf;
}
</style>`

const files = (await fs.readdir(DIST, { recursive: true })).filter((file) =>
  TEXT_EXTENSIONS.has(path.extname(file))
)

const changed = await Promise.all(
  files.map(async (file) => {
    const target = path.join(DIST, file)
    const content = await fs.readFile(target, 'utf8')
    const rebased = content
      .replaceAll('/static/', `${BASE}static/`)
      .replaceAll('href="/icon.svg"', `href="${BASE}icon.svg"`)
      .replaceAll('.p="/",', `.p="${BASE}",`)
      .replaceAll('clamp(40px, 6.5vw, 76px)', 'clamp(34px, 4.5vw, 58px)')
      .replaceAll('var(--cp-header-logo-height,28px)', 'var(--cp-header-logo-height,44px)')
      .replaceAll(
        '.cp-hero-demo--image{padding:0}',
        '.cp-hero-demo--image{padding:0;border:0;border-radius:0;background:transparent;box-shadow:none}'
      )
      .replaceAll('.cp-hero-demo__img{border-radius:inherit', '.cp-hero-demo__img{border-radius:0')
      .replaceAll(
        'layout:["hero","proof","features","split","showcase","cta"]',
        'layout:["hero","trust","features","split","workspaces","cta"]'
      )

    const themed =
      path.extname(file) === '.html' && !rebased.includes('data-massaman-theme')
        ? rebased.replace('</head>', `${THEME_OVERRIDES}</head>`)
        : rebased

    if (content === themed) return false

    await fs.writeFile(target, themed)
    return true
  })
)

console.log(`rebased ${changed.filter(Boolean).length} documentation assets to ${BASE}`)
