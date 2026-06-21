import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { buyUrl, PHARMACIES } from '@/lib/pharmacy'
import { useStore } from '@/store/useStore'
import type { Medicine } from '@/services/seed'

const STOCK_C: Record<string, { bg: string; fg: string }> = {
  'En stock': { bg: '#e7f3f1', fg: '#0a5c55' },
  'Pocas unidades': { bg: '#fff7e8', fg: '#9a6700' },
  Agotado: { bg: '#fdeaec', fg: '#c0202f' },
}

export function Medicines() {
  const { med, medicines, setMedQuery, selectMed, clearMed } = useStore()
  const q = (med.query || '').toLowerCase().trim()

  const medResults = medicines.filter(
    (m) => !q || m.nombre.toLowerCase().includes(q) || m.principio.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q),
  ).map((m) => {
    const precios = m.farmacias.map((f) => f.precio)
    const min = Math.min(...precios)
    const max = Math.max(...precios)
    return { ...m, desde: min.toFixed(2), farmaciasCount: m.farmacias.length, ahorro: (max - min).toFixed(2) }
  })

  const selBase = med.selectedId ? medicines.find((x) => x.id === med.selectedId) : undefined
  let medSelected: ReturnType<typeof buildSelected> | null = null
  function buildSelected(m: Medicine) {
    const sorted = [...m.farmacias].sort((a, b) => a.precio - b.precio)
    const precios = sorted.map((f) => f.precio)
    const min = Math.min(...precios)
    const max = Math.max(...precios)
    const avg = precios.reduce((a, b) => a + b, 0) / precios.length
    return {
      ...m,
      recetaLabel: m.receta ? 'Requiere receta médica' : 'Venta libre',
      min: min.toFixed(2), max: max.toFixed(2), avg: avg.toFixed(2), ahorro: (max - min).toFixed(2),
      farmacias: sorted.map((f) => {
        const c = STOCK_C[f.stock] || STOCK_C['En stock']
        const agot = f.stock === 'Agotado'
        const cheap = f.precio === min && !agot
        return { ...f, precioStr: f.precio.toFixed(2), isCheapest: cheap, borderColor: cheap ? '#0d7d74' : '#eaeeed', stockBg: c.bg, stockFg: c.fg, agotado: agot, ahorroVs: (f.precio - min).toFixed(2), hasAhorro: f.precio > min }
      }),
    }
  }
  if (selBase) medSelected = buildSelected(selBase)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Buscar medicina</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 22px;')}>Compara precios de tus medicamentos entre farmacias y encuentra la opción más conveniente.</p>

      <div style={s('position:relative;margin-bottom:22px;max-width:560px;')}>
        <span style={s('position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:18px;')}>🔍</span>
        <Box as="input" value={med.query} onChange={(e) => setMedQuery(e.target.value)} placeholder="Busca por nombre, principio activo o categoría…"
          css="width:100%;border:1.5px solid #d4e0de;border-radius:13px;padding:15px 16px 15px 46px;font-size:15px;background:#fff;box-shadow:0 1px 2px rgba(15,33,31,.03);" focus="border-color:#0d7d74;box-shadow:0 0 0 3px #0d7d7422;" />
      </div>

      {!medSelected && (
        <div>
          {medResults.length > 0 && <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#6b7b79;margin-bottom:14px;')}>{medResults.length} MEDICAMENTOS ENCONTRADOS</div>}
          <div style={s('display:grid;grid-template-columns:repeat(2,1fr);gap:14px;')}>
            {medResults.map((m) => (
              <Box key={m.id} onClick={() => selectMed(m.id)}
                css="background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;cursor:pointer;box-shadow:0 1px 2px rgba(15,33,31,.03);transition:box-shadow .15s,border-color .15s,transform .15s;"
                hover="box-shadow:0 12px 28px -16px rgba(15,33,31,.25);border-color:#cfe3df;transform:translateY(-2px);">
                <div style={s('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;')}>
                  <div style={s('display:flex;align-items:center;gap:11px;')}><span style={s('width:40px;height:40px;border-radius:11px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none;')}>💊</span><div><div style={s('font-size:16.5px;font-weight:700;')}>{m.nombre}</div><div style={s('font-size:12.5px;color:#8a9a98;')}>{m.principio}</div></div></div>
                </div>
                <div style={s('font-size:12.5px;color:#516160;margin-bottom:14px;')}>{m.forma} · {m.categoria}</div>
                <div style={s('display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #f0f3f2;')}>
                  <div><span style={s('font-size:12px;color:#8a9a98;')}>Desde </span><span style={s('font-size:18px;font-weight:800;color:#0d7d74;')}>S/ {m.desde}</span></div>
                  <span style={s('font-size:12px;color:#516160;')}>{m.farmaciasCount} farmacias →</span>
                </div>
              </Box>
            ))}
          </div>
          {medResults.length === 0 && (
            <div style={s('animation:hq-fade .3s ease both;')}>
              <div style={s('background:#fff;border:1px dashed #d4e0de;border-radius:16px;padding:22px 24px;margin-bottom:18px;text-align:center;color:#516160;font-size:14px;line-height:1.55;')}>
                “{med.query}” no está en el catálogo de comparación de precios, pero puedes <strong style={s('color:#0f211f;')}>buscarlo y comprarlo</strong> directamente en cada farmacia:
              </div>
              <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#6b7b79;margin-bottom:12px;')}>BUSCAR “{med.query.toUpperCase()}” EN FARMACIAS</div>
              <div style={s('display:flex;flex-direction:column;gap:10px;')}>
                {PHARMACIES.map((farm) => (
                  <div key={farm} style={s('background:#fff;border:1px solid #eaeeed;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
                    <span style={s('width:34px;height:34px;border-radius:9px;background:#f4f7f6;display:flex;align-items:center;justify-content:center;font-size:17px;flex:none;')}>🏪</span>
                    <div style={s('flex:1;min-width:0;')}><div style={s('font-size:15px;font-weight:700;')}>{farm}</div><div style={s('font-size:12px;color:#8a9a98;margin-top:2px;')}>Abre la búsqueda de “{med.query}” en su tienda</div></div>
                    <a href={buyUrl(farm, med.query)} target="_blank" rel="noopener noreferrer" style={s('text-decoration:none;background:#0d7d74;color:#fff;font-size:12.5px;font-weight:700;padding:9px 14px;border-radius:9px;white-space:nowrap;flex:none;')}>Comprar →</a>
                  </div>
                ))}
              </div>
              <div style={s('font-size:12px;color:#a3b1af;margin-top:16px;text-align:center;')}>Sin comparación de precios para productos fuera del catálogo: cada enlace abre el buscador real de la farmacia con tu término.</div>
            </div>
          )}
        </div>
      )}

      {medSelected && (
        <div style={s('animation:hq-fade .3s ease both;')}>
          <button onClick={clearMed} style={s('border:none;background:transparent;color:#516160;font-size:13.5px;font-weight:600;cursor:pointer;padding:0;margin-bottom:16px;display:flex;align-items:center;gap:6px;')}>← Volver a resultados</button>
          <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:24px;margin-bottom:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
            <div style={s('display:flex;align-items:center;gap:14px;')}>
              <span style={s('width:54px;height:54px;border-radius:14px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:26px;flex:none;')}>💊</span>
              <div style={s('flex:1;')}><div style={s('font-size:22px;font-weight:800;')}>{medSelected.nombre}</div><div style={s('font-size:13.5px;color:#8a9a98;')}>{medSelected.principio} · {medSelected.forma}</div></div>
              <span style={s('font-size:11.5px;font-weight:700;background:#fff7e8;color:#9a6700;padding:6px 12px;border-radius:8px;')}>{medSelected.recetaLabel}</span>
            </div>
            <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px;')}>
              <div style={s('background:#e7f3f1;border-radius:12px;padding:14px;')}><div style={s('font-size:11.5px;color:#5a7a76;margin-bottom:4px;')}>Precio más bajo</div><div style={s('font-size:20px;font-weight:800;color:#0a5c55;')}>S/ {medSelected.min}</div></div>
              <div style={s('background:#f7faf9;border-radius:12px;padding:14px;')}><div style={s('font-size:11.5px;color:#8a9a98;margin-bottom:4px;')}>Precio promedio</div><div style={s('font-size:20px;font-weight:800;')}>S/ {medSelected.avg}</div></div>
              <div style={s('background:#fff4f5;border-radius:12px;padding:14px;')}><div style={s('font-size:11.5px;color:#a06066;margin-bottom:4px;')}>Ahorro posible</div><div style={s('font-size:20px;font-weight:800;color:#c0202f;')}>S/ {medSelected.ahorro}</div></div>
            </div>
          </div>
          <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#6b7b79;margin-bottom:12px;')}>FARMACIAS — ORDENADAS POR PRECIO</div>
          <div style={s('display:flex;flex-direction:column;gap:10px;')}>
            {medSelected.farmacias.map((f, i) => (
              <div key={i} style={s(`background:#fff;border:1.5px solid ${f.borderColor};border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);`)}>
                <span style={s('width:34px;height:34px;border-radius:9px;background:#f4f7f6;display:flex;align-items:center;justify-content:center;font-size:17px;flex:none;')}>🏪</span>
                <div style={s('flex:1;min-width:0;')}>
                  <div style={s('display:flex;align-items:center;gap:9px;')}><span style={s('font-size:15px;font-weight:700;')}>{f.nombre}</span>{f.isCheapest && <span style={s('font-size:10.5px;font-weight:800;background:#0d7d74;color:#fff;padding:3px 9px;border-radius:6px;')}>MÁS BARATO</span>}</div>
                  <div style={s('display:flex;align-items:center;gap:9px;margin-top:4px;')}><span style={s(`font-size:11.5px;font-weight:600;background:${f.stockBg};color:${f.stockFg};padding:3px 9px;border-radius:6px;`)}>{f.stock}</span><span style={s('font-size:12px;color:#8a9a98;')}>📍 {f.dist}</span></div>
                </div>
                <div style={s('text-align:right;')}><div style={s('font-size:19px;font-weight:800;color:#0f211f;')}>S/ {f.precioStr}</div>{f.hasAhorro && <div style={s('font-size:11px;color:#c0202f;')}>+S/ {f.ahorroVs}</div>}</div>
                {f.agotado
                  ? <span style={s('font-size:12.5px;font-weight:700;color:#a3b1af;background:#f4f7f6;padding:9px 14px;border-radius:9px;white-space:nowrap;flex:none;')}>Agotado</span>
                  : <a href={buyUrl(f.nombre, medSelected.nombre)} target="_blank" rel="noopener noreferrer" style={s('text-decoration:none;background:#0d7d74;color:#fff;font-size:12.5px;font-weight:700;padding:9px 14px;border-radius:9px;white-space:nowrap;flex:none;')}>Comprar →</a>}
              </div>
            ))}
          </div>
          <div style={s('font-size:12px;color:#a3b1af;margin-top:16px;text-align:center;')}>Precios referenciales · El botón “Comprar” te lleva al buscador real de cada farmacia. La sincronización de precios y stock en vivo queda como evolución futura (backend, según DAS).</div>
        </div>
      )}
    </div>
  )
}
