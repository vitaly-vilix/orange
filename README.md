# orange 🍊

A Claude Code mod that gives the Claude desktop app a warm orange look and puts your public IP address in the corner of the window, softly beating like a heart.

- **Theme:** apricot paper in light mode, embers in dark mode, orange accents, code colors tuned to match.
- **Heartbeat IP:** a small heart and your public IPv4 address, tone-on-tone with the chat background, pulsing with a slow double beat. It is pinned in pixels near the top-right of the chat column, so resizing the window does not move or scale it.
- The address comes from `https://api.ipify.org` and refreshes every 2 minutes.

The look draws in the desktop and mobile apps only; terminals and editors keep their own colors. With reduced motion on, the heart stays still.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install orange --marketplace vitaly-vilix/orange
```

Answer `y` to add the marketplace, then press Enter to pick the user scope.

From a shell:

```
claude plugin install orange --marketplace vitaly-vilix/orange
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `vitaly-vilix/orange`, then **Add plugin**.

## Tweaking

The heart's position and size are constants at the top of `scene()` in `hooks/register.tsx`: `RIGHT_GAP` (pixels from the window's right edge), `TOP` and `FONT`.

## License

MIT
