import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Warm orange: apricot by day, embers by night.
const { theme, problems } = makeColors({
  label: 'Orange',
  roles: { accent: '#e2631a', danger: '#c0392b', success: '#5a8a3a', warning: '#c98a12', pro: '#8a5aa8' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f2c697',
        'surface-1': '#f5d3ae',
        'surface-2': '#f9e1c6',
        'text-primary': '#2b1608',
        'text-secondary': '#53311a',
        'text-muted': '#5e3a20',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#24140a',
        'surface-1': '#2e1a0d',
        'surface-2': '#382111',
        'surface-3': '#402714',
        'text-primary': '#fae6d2',
        'text-secondary': '#e2c2a2',
        'text-muted': '#c09c7c',
      },
    },
  },
})

// No glass veil: it blurred the heart into a smudge.
const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'ip-heart', glass: false } }

const ip = atom({ plugin: 'orange', key: 'ip' } as const, '…')

// The public address the internet sees.
const IP_URL = 'https://api.ipify.org'

function clean(text: string): string {
  return text.replace(/[^0-9a-fA-F.:…]/g, '')
}

// Pinned in screen pixels: RIGHT_GAP from the window's right edge (left of
// the right-hand panel), TOP from its top. No viewBox, so 1 unit = 1 px and
// resizing the window or the left menu never moves or scales it.
const RIGHT_GAP = 330
const TOP = 52
const FONT = 9
const CHAR_WIDTH = FONT * 0.55

function scene(address: string): string {
  const label = clean(address)
  const textWidth = label.length * CHAR_WIDTH
  const textX = -RIGHT_GAP - textWidth
  const heartX = textX - 5

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<style>
  .beat { transform-box: fill-box; transform-origin: center; animation: beat 1.8s ease-in-out infinite; }
  .ip { font-family: Consolas, Menlo, monospace; font-size: ${FONT}px; font-weight: 700; fill: #e4964f; }
  .heart { fill: #e4964f; }
  @keyframes beat {
    0% { transform: scale(1); }
    12% { transform: scale(1.14); }
    24% { transform: scale(1); }
    36% { transform: scale(1.08); }
    50% { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @media (prefers-color-scheme: dark) {
    .ip, .heart { fill: #5e3518; }
  }
</style>
<svg x="100%" y="0" width="1" height="1" overflow="visible">
  <g class="beat">
    <path class="heart" transform="translate(${heartX} ${TOP - 7}) scale(0.5)" d="M0 6 c0 -7 -10 -10 -14 -3 c-4 -7 -14 -4 -14 3 c0 8 14 16 14 16 c0 0 14 -8 14 -16 z"/>
    <text class="ip" x="${textX}" y="${TOP}">${label}</text>
  </g>
</svg>
</svg>`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    const refresh = async () => {
      try {
        const { ok, text } = await $.http.fetch(IP_URL)
        const address = clean(text.trim())

        if (ok && address !== '') {
          await update($, ip, () => address)
        }
      } catch {
        // Keep the last known address.
      }
    }

    await refresh()
    $.clock.every(120_000, refresh)

    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const address = await read($, ip)
    const { Svg } = $.ui.resolve(e)

    return <Svg source={scene(address)} alt={`IP address ${address}, pulsing like a heartbeat`} isInteractive />
  })
}
