import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeMedConsultas } from '@/store/selectors'

const STAT = 'background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:18px 20px;'
const GRID4 = 'display:grid;grid-template-columns:repeat(4,1fr);gap:14px;'

export function DoctorConsultas() {
  const { audit } = useStore()
  const medConsultas = computeMedConsultas(audit)
  const medStats = { total: medConsultas.length, pacientes: 1, ultimo: medConsultas[0] ? medConsultas[0].rel : '—' }

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Mis consultas</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 24px;')}>Accesos a historiales realizados mediante token. Cada uno queda auditado de forma inmutable.</p>

      <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px;')}>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Consultas realizadas</div><div style={s('font-size:28px;font-weight:800;color:#1d4ed8;')}>{medStats.total}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Pacientes atendidos</div><div style={s('font-size:28px;font-weight:800;')}>{medStats.pacientes}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Último acceso</div><div style={s('font-size:20px;font-weight:800;margin-top:5px;')}>{medStats.ultimo}</div></div>
      </div>

      <div style={s('display:flex;flex-direction:column;gap:12px;')}>
        {medConsultas.map((a, i) => (
          <div key={i} style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:18px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
            <div style={s('display:flex;align-items:center;gap:14px;margin-bottom:14px;')}>
              <span style={s('width:42px;height:42px;border-radius:50%;background:linear-gradient(150deg,#0d7d74,#0a5c55);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex:none;')}>JP</span>
              <div style={s('flex:1;')}><div style={s('font-size:15.5px;font-weight:700;')}>{a.paciente}</div><div style={s("font-size:12.5px;color:#8a9a98;font-family:'JetBrains Mono',monospace;")}>DNI {a.dni}</div></div>
              <span style={s('font-size:11.5px;font-weight:700;background:#eaf2ff;color:#1d4ed8;padding:5px 11px;border-radius:8px;')}>{a.accesoTipo}</span>
            </div>
            <div style={s(GRID4 + 'padding-top:14px;border-top:1px solid #f0f3f2;')}>
              <div><div style={s('font-size:11px;color:#8a9a98;margin-bottom:3px;')}>Token</div><div style={s("font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;")}>{a.ref}</div></div>
              <div><div style={s('font-size:11px;color:#8a9a98;margin-bottom:3px;')}>Secciones vistas</div><div style={s('font-size:13px;font-weight:600;')}>{a.secciones}</div></div>
              <div><div style={s('font-size:11px;color:#8a9a98;margin-bottom:3px;')}>Duración</div><div style={s('font-size:13px;font-weight:600;')}>{a.duracion}</div></div>
              <div style={s('text-align:right;')}><div style={s('font-size:11px;color:#8a9a98;margin-bottom:3px;')}>Fecha</div><div style={s('font-size:13px;font-weight:600;')}>{a.fecha}</div></div>
            </div>
            <div style={s('display:flex;align-items:center;gap:7px;margin-top:12px;font-size:11.5px;color:#a3b1af;')}><span>🖥️ {a.disp}</span><span>·</span><span style={s("font-family:'JetBrains Mono',monospace;")}>{a.ip}</span></div>
          </div>
        ))}
        {medConsultas.length === 0 && (
          <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:40px;text-align:center;color:#8a9a98;font-size:14px;')}>Aún no has realizado consultas. Usa un token en “Acceso por token” para acceder a un historial.</div>
        )}
      </div>
    </div>
  )
}
