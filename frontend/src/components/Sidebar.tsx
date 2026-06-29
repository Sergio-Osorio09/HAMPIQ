import { Box } from '@/components/Box'
import { Icon } from '@/components/Icon'
import { s } from '@/lib/style'
import { useStore, type PScreen } from '@/store/useStore'

type NavDef = { key: PScreen; label: string; icon: string }

const NAV: Record<string, NavDef[]> = {
  paciente: [
    { key: 'dashboard', label: 'Inicio', icon: 'grid' },
    { key: 'history', label: 'Mi historial', icon: 'list' },
    { key: 'share', label: 'Compartir acceso', icon: 'share' },
    { key: 'medicines', label: 'Buscar medicina', icon: 'pill' },
    { key: 'card', label: 'Tarjeta de emergencia', icon: 'qr' },
    { key: 'audit', label: 'Auditoría de accesos', icon: 'shield' },
    { key: 'profile', label: 'Mi perfil', icon: 'user' },
  ],
  medico: [
    { key: 'med-home', label: 'Inicio', icon: 'grid' },
    { key: 'doctor', label: 'Acceso por token', icon: 'stethoscope' },
    { key: 'med-patients', label: 'Mis pacientes', icon: 'users' },
    { key: 'audit-med', label: 'Mis consultas', icon: 'list' },
    { key: 'med-rx', label: 'Recetas emitidas', icon: 'pill' },
  ],
  admin: [
    { key: 'admin', label: 'Panel general', icon: 'grid' },
    { key: 'admin-audit', label: 'Auditoría global', icon: 'shield' },
    { key: 'admin-tokens', label: 'Tokens', icon: 'clock' },
    { key: 'admin-users', label: 'Usuarios', icon: 'users' },
  ],
}

export function Sidebar() {
  const { session, pscreen, pgo, logout } = useStore()
  const role = session ? session.role : 'paciente'
  const items = NAV[role] || NAV.paciente

  const initials = session ? ((session.nombres || ' ')[0] + (session.apellidos || ' ')[0]).toUpperCase() : 'HQ'
  const userName = session ? `${session.nombres} ${session.apellidos}` : ''
  const roleLabel = role === 'medico' ? (session?.extra || 'Médico') : role === 'admin' ? 'Administrador' : 'Paciente'
  const avatarBg = role === 'medico' ? '#1d4ed8' : role === 'admin' ? '#7c3aed' : 'linear-gradient(150deg,#0d7d74,#0a5c55)'

  return (
    <aside style={s('width:248px;flex:none;background:#0f211f;display:flex;flex-direction:column;padding:22px 16px;position:sticky;top:0;height:100vh;')}>
      <div style={s('display:flex;align-items:center;gap:10px;padding:6px 8px 22px;')}>
        <div style={s('width:34px;height:34px;border-radius:10px;background:linear-gradient(150deg,#0d7d74,#0a5c55);display:flex;align-items:center;justify-content:center;position:relative;')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
          <span style={s('position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:#e23b48;border:2px solid #0f211f;')} />
        </div>
        <span style={s('font-size:18px;font-weight:800;color:#fff;letter-spacing:-.02em;')}>Hampiq</span>
      </div>

      <nav style={s('display:flex;flex-direction:column;gap:3px;flex:1;')}>
        {items.map((item) => {
          const active = pscreen === item.key
          return active ? (
            <button data-testid={`nav-${item.key}`} key={item.key} onClick={() => pgo(item.key)} style={s('display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:none;cursor:pointer;font-size:14px;font-weight:600;padding:11px 12px;border-radius:10px;color:#fff;background:#1c3a35;')}>
              <span style={s('display:flex;width:20px;justify-content:center;')}><Icon name={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ) : (
            <Box as="button" data-testid={`nav-${item.key}`} key={item.key} onClick={() => pgo(item.key)}
              css="display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:none;cursor:pointer;font-size:14px;font-weight:600;padding:11px 12px;border-radius:10px;color:#9fc4bf;background:transparent;"
              hover="background:#16302c;">
              <span style={s('display:flex;width:20px;justify-content:center;')}><Icon name={item.icon} /></span>
              <span>{item.label}</span>
            </Box>
          )
        })}
      </nav>

      <div style={s('border-top:1px solid #1d3935;padding-top:14px;margin-top:14px;')}>
        <div style={s('display:flex;align-items:center;gap:10px;padding:6px 8px;')}>
          <div style={s(`width:36px;height:36px;border-radius:50%;background:${avatarBg};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13.5px;flex:none;`)}>{initials}</div>
          <div style={s('line-height:1.2;min-width:0;')}><div data-testid="sidebar-username" style={s('font-size:13.5px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>{userName}</div><div style={s('font-size:11px;color:#7fb8b2;')}>{roleLabel}</div></div>
        </div>
        <button data-testid="logout" onClick={logout} style={s('margin-top:8px;width:100%;border:1px solid #2c463f;background:transparent;color:#9fc4bf;font-size:13px;font-weight:600;padding:9px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Cerrar sesión</button>
      </div>
    </aside>
  )
}
