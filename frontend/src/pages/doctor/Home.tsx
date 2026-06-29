import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeMedConsultas } from '@/store/selectors'
import { PATIENTS } from '@/services/seed'

const STAT = 'background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;'

export function DoctorHome() {
  const { audit, recetas, history, pgo } = useStore()
  const medConsultas = computeMedConsultas(audit)
  const medStats = { total: medConsultas.length }

  return (
    <div data-testid="doctor-home" style={s('animation:hq-fade .35s ease both;')}>
      <div style={s('display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:26px;')}>
        <div>
          <div style={s('font-size:13.5px;color:#516160;font-weight:500;margin-bottom:4px;')}>Bienvenida,</div>
          <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0;')}>Dra. Ana María Flores</h1>
          <div style={s('font-size:13px;color:#8a9a98;margin-top:4px;')}>CMP 58213 · Neumología</div>
        </div>
        <button onClick={() => pgo('doctor')} style={s('border:none;background:#0d7d74;color:#fff;font-size:14.5px;font-weight:700;padding:12px 20px;border-radius:11px;cursor:pointer;box-shadow:0 10px 22px -10px #0d7d74cc;display:flex;align-items:center;gap:8px;')}>🩺 Consultar por token</button>
      </div>
      <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:18px;')}>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Consultas realizadas</div><div style={s('font-size:30px;font-weight:800;color:#1d4ed8;')}>{medStats.total}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Pacientes</div><div style={s('font-size:30px;font-weight:800;')}>3</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Recetas emitidas</div><div style={s('font-size:30px;font-weight:800;color:#0d7d74;')}>{recetas.length}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Notas agregadas</div><div style={s('font-size:30px;font-weight:800;')}>{history.filter((e) => e.nuevo).length}</div></div>
      </div>
      <div style={s('display:grid;grid-template-columns:1.3fr 1fr;gap:16px;')}>
        <div style={s('background:#0f211f;border-radius:18px;padding:24px;color:#fff;position:relative;overflow:hidden;')}>
          <div style={s('position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,#0d7d7444,transparent 70%);top:-70px;right:-50px;')} />
          <div style={s('position:relative;')}>
            <div style={s('font-size:12px;font-weight:700;color:#7fb8b2;letter-spacing:.06em;margin-bottom:8px;')}>ACCESO RÁPIDO</div>
            <div style={s('font-size:18px;font-weight:700;margin-bottom:6px;')}>Consultar historial de un paciente</div>
            <p style={s('font-size:13.5px;color:#9fc4bf;line-height:1.55;margin:0 0 18px;max-width:340px;')}>Ingresa el token temporal que te compartió el paciente para acceder a su historial clínico de solo lectura.</p>
            <button onClick={() => pgo('doctor')} style={s('border:none;background:#0d7d74;color:#fff;font-size:14px;font-weight:700;padding:12px 20px;border-radius:10px;cursor:pointer;')}>Ingresar token →</button>
          </div>
        </div>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;padding:16px 0 8px;border-bottom:1px solid #f0f3f2;')}>PACIENTES RECIENTES</div>
          {PATIENTS.map((p) => (
            <div key={p.dni} style={s('display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f5f7f6;')}>
              <span style={s(`width:36px;height:36px;border-radius:50%;background:${p.color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex:none;`)}>{p.iniciales}</span>
              <div style={s('flex:1;min-width:0;')}><div style={s('font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>{p.nombre}</div><div style={s('font-size:11.5px;color:#8a9a98;')}>{p.ultimo}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
