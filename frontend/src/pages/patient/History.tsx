import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeHistoryView } from '@/store/selectors'

export function History() {
  const { history, openEvent } = useStore()
  const historyView = computeHistoryView(history)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Mi historial clínico</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Cronología completa de tus eventos clínicos. La información nunca se sobrescribe ni se elimina.</p>
      <div style={s('position:relative;padding-left:8px;')}>
        {historyView.map((e) => (
          <div key={e.id} style={s('display:flex;gap:20px;padding-bottom:8px;')}>
            <div style={s('display:flex;flex-direction:column;align-items:center;flex:none;width:14px;')}>
              <span style={s('width:14px;height:14px;border-radius:50%;background:#0d7d74;border:3px solid #d6ece9;margin-top:24px;')} />
              <span style={s('flex:1;width:2px;background:#e6eeed;')} />
            </div>
            <Box onClick={() => openEvent(e.id)}
              css="flex:1;background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px 22px;margin-bottom:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);cursor:pointer;transition:box-shadow .15s,border-color .15s,transform .15s;"
              hover="box-shadow:0 10px 26px -14px rgba(15,33,31,.22);border-color:#cfe3df;transform:translateY(-1px);">
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;')}>
                <div style={s('display:flex;align-items:center;gap:9px;')}>
                  <span style={s(`font-size:11.5px;font-weight:700;background:${e.tipoBg};color:${e.tipoFg};padding:4px 10px;border-radius:7px;`)}>{e.tipo}</span>
                  <span style={s(`font-size:11.5px;font-weight:600;background:${e.sevBg};color:${e.sevFg};padding:4px 10px;border-radius:7px;`)}>{e.sev}</span>
                </div>
                <span style={s('font-size:12.5px;color:#8a9a98;font-weight:500;')}>{e.fecha}</span>
              </div>
              <h3 style={s('font-size:17px;font-weight:700;margin:0 0 6px;')}>{e.titulo}</h3>
              <p style={s('font-size:13.5px;color:#516160;line-height:1.55;margin:0 0 12px;')}>{e.diagnostico}</p>
              <div style={s('display:flex;align-items:center;gap:16px;font-size:12.5px;color:#8a9a98;margin-bottom:6px;')}>
                <span>👨‍⚕️ {e.medico}</span><span>🏥 {e.estab}</span>
              </div>
              {e.hasEstudios && (
                <div style={s('display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;padding-top:12px;border-top:1px solid #f0f3f2;')}>
                  {e.estudios.map((st, i) => (
                    <span key={i} style={s('display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;background:#f4f7f6;border:1px solid #e6eeed;color:#3a4a48;padding:6px 11px;border-radius:8px;')}>{st.icon} {st.n}</span>
                  ))}
                </div>
              )}
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:13px;border-top:1px solid #f0f3f2;')}>
                <span style={s('font-size:12px;color:#8a9a98;')}>📄 {e.estudiosCount} estudio(s) · {e.medCount} medicamento(s)</span>
                <span style={s('font-size:13px;font-weight:700;color:#0d7d74;')}>Ver ficha completa →</span>
              </div>
            </Box>
          </div>
        ))}
      </div>
    </div>
  )
}
