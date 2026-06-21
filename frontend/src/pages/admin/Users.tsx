import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

const ROLE_BG: Record<string, string> = { medico: '#eaf2ff', admin: '#f3ecfc', paciente: '#e7f3f1' }
const ROLE_FG: Record<string, string> = { medico: '#1d4ed8', admin: '#7c3aed', paciente: '#0a5c55' }
const ROLE_LABEL: Record<string, string> = { medico: 'Médico', admin: 'Administrador', paciente: 'Paciente' }

export function AdminUsers() {
  const { allUsers } = useStore()
  const rows = allUsers.map((u) => ({
    ...u,
    nombre: `${u.nombres} ${u.apellidos}`,
    roleLabel: ROLE_LABEL[u.role] || 'Paciente',
    roleBg: ROLE_BG[u.role] || '#e7f3f1',
    roleFg: ROLE_FG[u.role] || '#0a5c55',
    initials: (u.nombres[0] + u.apellidos[0]).toUpperCase(),
  }))

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Usuarios</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Cuentas registradas en la plataforma.</p>
      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        {rows.map((u) => (
          <div key={u.dni} style={s('display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid #f5f7f6;')}>
            <span style={s(`width:40px;height:40px;border-radius:50%;background:${u.roleBg};color:${u.roleFg};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex:none;`)}>{u.initials}</span>
            <div style={s('flex:1;')}><div style={s('font-size:14.5px;font-weight:600;')}>{u.nombre}</div><div style={s("font-size:12.5px;color:#8a9a98;font-family:'JetBrains Mono',monospace;")}>DNI {u.dni}</div></div>
            <span style={s(`font-size:12px;font-weight:700;background:${u.roleBg};color:${u.roleFg};padding:5px 12px;border-radius:8px;`)}>{u.roleLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
