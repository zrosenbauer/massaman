import { BUILT_IN_THEMES, defineTheme, type CiderpressTokens } from '@ciderpress/theme'
import type { CiderpressConfig } from 'ciderpress'

export const brandColor = '#c85a3e'

const brandSoft = 'rgba(200, 90, 62, 0.12)'
const midnight = BUILT_IN_THEMES.midnight.variants.dark as CiderpressTokens
const iconTint = { bg: brandSoft, fg: brandColor }

const massaman = defineTheme({
  name: 'massaman',
  defaultVariant: 'dark',
  variants: {
    dark: {
      ...midnight,
      colors: {
        ...midnight.colors,
        brand: {
          ...midnight.colors.brand,
          primary: brandColor,
          hover: '#8f3528',
          active: '#70271f',
          fg: '#020100',
          soft: brandSoft,
          light: '#df7955',
          lighter: '#e99575',
        },
        surface: {
          ...midnight.colors.surface,
          bg: '#020100',
          bgAlt: '#050201',
          bgElv: '#0b0402',
          bgSoft: '#070301',
        },
        text: {
          ...midnight.colors.text,
          text1: '#f3ecdf',
          text2: '#bca99b',
          text3: '#826e63',
        },
        border: {
          ...midnight.colors.border,
          divider: '#332010',
          border: '#27170c',
        },
        tint: {
          ...midnight.colors.tint,
          purple: iconTint,
          blue: iconTint,
          green: iconTint,
          amber: iconTint,
          red: iconTint,
          slate: iconTint,
          cyan: iconTint,
          pink: iconTint,
          purpleBright: { fg: brandColor },
          amberBright: { fg: brandColor },
          purpleGlow: brandSoft,
        },
      },
    },
  },
})

export const theme = {
  themes: [massaman],
  defaultVariant: 'dark',
  variantSwitcher: false,
  overrides: { homeBg: '#020100' },
} satisfies NonNullable<CiderpressConfig['theme']>
