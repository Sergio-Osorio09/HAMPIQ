import { s } from '@/lib/style'
import { PATIENTS } from '@/services/seed'

export function DoctorPatients() {
  const patientsView = PATIENTS.map((p) => ({ ...p, sexoLabel: p.sexo === 'F' ? 'Femenino' : 'Masculino' }))

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Mis pacientes</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 24px;')}>Pacientes que has atendido. Para abrir un historial necesitas un token vigente del paciente.</p>
      <div style={s('display:flex;flex-direction:column;gap:12px;')}>
        {patientsView.map((p) => (
          <div key={p.dni} style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
            <span style={s(`width:48px;height:48px;border-radius:50%;background:${p.color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex:none;`)}>{p.iniciales}</span>
            <div style={s('flex:1;min-width:0;')}>
              <div style={s('font-size:16px;font-weight:700;')}>{p.nombre}</div>
              <div style={s('font-size:12.5px;color:#8a9a98;')}>DNI {p.dni} · {p.edad} años · {p.sexoLabel} · Grupo {p.sangre}</div>
            </div>
            <div style={s('text-align:right;margin-right:8px;')}><div style={s('font-size:12px;color:#8a9a98;')}>Condición base</div><div style={s('font-size:13px;font-weight:600;')}>{p.cond}</div></div>
            <div style={s('text-align:right;')}><div style={s('font-size:12px;color:#8a9a98;')}>Último acceso</div><div style={s('font-size:13px;font-weight:600;')}>{p.ultimo}</div></div>
            <span style={s('font-size:11.5px;font-weight:700;background:#eef1f1;color:#6b7b79;padding:6px 12px;border-radius:8px;white-space:nowrap;')}>🔒 Requiere token</span>
          </div>
        ))}
      </div>
    </div>
  )
}
