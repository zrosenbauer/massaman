import { type CSSProperties, useEffect, useRef } from 'react'

const VIEWBOX_WIDTH = 1440
const VIEWBOX_HEIGHT = 720

const backgroundStyle: CSSProperties = {
  overflow: 'hidden',
  background: '#020100',
}

const layerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
}

const artStyle: CSSProperties = {
  ...layerStyle,
  objectFit: 'cover',
  filter: 'brightness(0.5)',
}

const interactionStyle: CSSProperties = {
  ...layerStyle,
  zIndex: 1,
}

/**
 * Renders the animated hero artwork and cursor-reactive weave overlay.
 * @returns A pointer-transparent background for the Ciderpress hero.
 */
export function HeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<SVGRadialGradientElement>(null)
  const cellRef = useRef<SVGRectElement>(null)
  const gridRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const hero = backgroundRef.current?.closest<HTMLElement>('.cp-hero')

    if (hero === null || hero === undefined) {
      return
    }

    const updatePointer = (event: PointerEvent): void => {
      const bounds = hero.getBoundingClientRect()
      const scale = Math.max(bounds.width / VIEWBOX_WIDTH, bounds.height / VIEWBOX_HEIGHT)
      const renderedWidth = VIEWBOX_WIDTH * scale
      const renderedHeight = VIEWBOX_HEIGHT * scale
      const offsetX = (bounds.width - renderedWidth) / 2
      const offsetY = (bounds.height - renderedHeight) / 2
      const x = (event.clientX - bounds.left - offsetX) / scale
      const y = (event.clientY - bounds.top - offsetY) / scale

      gradientRef.current?.setAttribute('cx', String(x))
      gradientRef.current?.setAttribute('cy', String(y))
      cellRef.current?.setAttribute('x', String(Math.floor((x - 3) / 9) * 9 + 3))
      cellRef.current?.setAttribute('y', String(Math.floor((y - 2) / 6) * 6 + 2))
      gridRef.current?.setAttribute('data-active', 'true')
      gridRef.current?.style.setProperty('opacity', '1')
    }

    const deactivateGrid = (): void => {
      gridRef.current?.setAttribute('data-active', 'false')
      gridRef.current?.style.setProperty('opacity', '0')
    }

    hero.addEventListener('pointermove', updatePointer, { capture: true })
    hero.addEventListener('pointerleave', deactivateGrid)

    return () => {
      hero.removeEventListener('pointermove', updatePointer, { capture: true })
      hero.removeEventListener('pointerleave', deactivateGrid)
    }
  }, [])

  return (
    <div ref={backgroundRef} className="massaman-hero-background" style={backgroundStyle}>
      <img src="/hero-background.svg" alt="" style={artStyle} />
      <svg
        className="massaman-hero-background__interaction"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        style={interactionStyle}
      >
        <defs>
          <pattern
            id="massaman-interactive-grid-lines"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 2H18M0 8H18M0 14H18"
              fill="none"
              stroke="#e99575"
              strokeOpacity="0.32"
              strokeWidth="1"
            />
            <path
              d="M3 0V18M12 0V18"
              fill="none"
              stroke="#df7955"
              strokeOpacity="0.42"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient
            ref={gradientRef}
            id="massaman-cursor-falloff"
            gradientUnits="userSpaceOnUse"
            cx="-200"
            cy="-200"
            r="220"
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.48" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask
            id="massaman-cursor-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
          >
            <rect
              width={VIEWBOX_WIDTH}
              height={VIEWBOX_HEIGHT}
              fill="url(#massaman-cursor-falloff)"
            />
          </mask>
        </defs>
        <g
          ref={gridRef}
          className="massaman-hero-background__grid"
          data-active="false"
          style={{ opacity: 0, transition: 'opacity 160ms ease-out' }}
        >
          <rect
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            fill="url(#massaman-interactive-grid-lines)"
            mask="url(#massaman-cursor-mask)"
          />
          <rect
            ref={cellRef}
            x="-9"
            y="-6"
            width="9"
            height="6"
            fill="#c85a3e"
            fillOpacity="0.34"
            stroke="#e99575"
            strokeOpacity="0.84"
          />
        </g>
      </svg>
    </div>
  )
}

/**
 * Supplies the interactive background through Ciderpress's banner hook.
 * @returns The hero background element.
 */
export function heroBackgroundBanner() {
  return <HeroBackground />
}
