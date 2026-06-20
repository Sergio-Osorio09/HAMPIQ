import { s } from '@/lib/style'
import { fmtDate } from '@/lib/format'
import { useStore } from '@/store/useStore'

const ESTADO_C: Record<string, { bg: string; fg: string }> = {
  Vigente: { bg: '#e7f3f1', fg: '#0a5c55' },
  Vencida: { bg: '#eef1f1', fg: '#6b7b79' },
}

export function DoctorRx() {
  const { recetas } = useStore()
  const recetasView = recetas.map((r) => {
    const ec = ESTADO_C[r.estado] || ESTADO_C.Vencida
    return { ...r, fecha: fmtDate(r.ts), estadoBg: ec.bg, estadoFg: ec.fg }
  })

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Recetas emitidas</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 24px;')}>Prescripciones electrónicas que has emitido durante tus consultas.</p>
      <div style={s('display:flex;flex-direction:column;gap:12px;')}>
        {recetasView.map((r) => (
          <div key={r.id} style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:18px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
            <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;')}>
              <div style={s('display:flex;align-items:center;gap:11px;')}><span style={s('width:40px;height:40px;border-radius:11px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:19px;flex:none;')}>📋</span><div><div style={s('font-size:15px;font-weight:700;')}>{r.paciente}</div><div style={s('font-size:12.5px;color:#8a9a98;')}>{r.medico} · {r.fecha}</div></div></div>
              <span style={s(`font-size:11.5px;font-weight:700;background:${r.estadoBg};color:${r.estadoFg};padding:5px 12px;border-radius:8px;`)}>{r.estado}</span>
            </div>
            <div style={s('border-top:1px solid #f0f3f2;padding-top:12px;display:flex;flex-direction:column;gap:8px;')}>
              {r.items.map((it, i) => (
                <div key={i} style={s('display:flex;align-items:center;gap:10px;')}><span style={s('font-size:14px;')}>💊</span><span style={s('font-size:13.5px;font-weight:700;flex:none;')}>{it.nombre}</span><span style={s('font-size:13px;color:#516160;')}>— {it.dosis} · {it.duracion}</span></div>
              ))}
            </div>
          </div>
        ))}
        {recetas.length === 0 && (
          <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:40px;text-align:center;color:#8a9a98;font-size:14px;')}>Aún no has emitido recetas.</div>
        )}
      </div>
    </div>
  )
}
