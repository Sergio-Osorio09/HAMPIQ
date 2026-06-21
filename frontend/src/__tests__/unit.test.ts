import { describe, it, expect } from 'vitest'
import { s } from '@/lib/style'
import { buyUrl } from '@/lib/pharmacy'
import { computeLiveTokens } from '@/store/selectors'
import type { Token } from '@/services/seed'

describe('s() — parser de estilos del prototipo', () => {
  it('convierte string CSS a objeto camelCase', () => {
    expect(s('color:red;font-size:12px;border-radius:8px')).toEqual({
      color: 'red',
      fontSize: '12px',
      borderRadius: '8px',
    })
  })
})

describe('buyUrl() — enlaces de compra', () => {
  it('Inkafarma usa su buscador directo', () => {
    expect(buyUrl('Inkafarma', 'apronax')).toBe('https://inkafarma.pe/buscador?keyword=apronax')
  })
  it('Mifarma usa su buscador directo', () => {
    expect(buyUrl('Mifarma', 'apronax')).toBe('https://www.mifarma.com.pe/buscador?keyword=apronax')
  })
  it('farmacia sin buscador confirmado cae a Google', () => {
    expect(buyUrl('Boticas BTL', 'apronax')).toContain('google.com/search')
  })
})

describe('computeLiveTokens() — estado en vivo del token', () => {
  const base = (over: Partial<Token>): Token => ({
    code: 'HMPQ-AAAA-BBBB', createdAt: 0, expiresAt: 0, durationMin: 30,
    uses: 3, usesLeft: 2, status: 'activa', medico: '—', ...over,
  })
  const now = 1_000_000

  it('vigente con usos -> activa', () => {
    const [t] = computeLiveTokens([base({ expiresAt: now + 600000 })], now)
    expect(t.isActiva).toBe(true)
    expect(t.statusLabel).toBe('activa')
  })
  it('vencido -> expirada', () => {
    const [t] = computeLiveTokens([base({ expiresAt: now - 1 })], now)
    expect(t.isActiva).toBe(false)
    expect(t.statusLabel).toBe('expirada')
  })
  it('sin usos -> agotada', () => {
    const [t] = computeLiveTokens([base({ expiresAt: now + 600000, usesLeft: 0 })], now)
    expect(t.statusLabel).toBe('agotada')
  })
})
