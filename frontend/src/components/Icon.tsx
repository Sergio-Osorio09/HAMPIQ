const PATHS: Record<string, string> = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  clock: 'M12 7v5l3 2 M12 21a9 9 0 100-18 9 9 0 000 18z',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7 M16 6l-4-4-4 4 M12 2v13',
  shield: 'M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z',
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3M21 21v.01M18 18v.01M15 21v.01',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  stethoscope: 'M6 3v6a4 4 0 008 0V3 M6 3H4 M14 3h2 M10 17v1a4 4 0 008 0v-1 M18 14a2 2 0 100-4 2 2 0 000 4z',
  cog: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19 12a7 7 0 00-.14-1.4l2-1.5-2-3.4-2.3 1a7 7 0 00-2.4-1.4L13.8 2h-3.6l-.36 2.3a7 7 0 00-2.4 1.4l-2.3-1-2 3.4 2 1.5A7 7 0 005 12c0 .48.05.95.14 1.4l-2 1.5 2 3.4 2.3-1a7 7 0 002.4 1.4l.36 2.3h3.6l.36-2.3a7 7 0 002.4-1.4l2.3 1 2-3.4-2-1.5c.09-.45.14-.92.14-1.4z',
  pill: 'M10.5 20.5L4 14a4.95 4.95 0 017-7l6.5 6.5a4.95 4.95 0 01-7 7z M8.5 8.5l7 7',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
}

export function Icon({ name, color = 'currentColor', size = 18 }: { name: string; color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  )
}
