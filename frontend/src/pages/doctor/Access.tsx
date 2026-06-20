import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { fmtDate, fmtRemaining } from '@/lib/format'
import { useStore } from '@/store/useStore'
import { computeHistoryView } from '@/store/selectors'
import { HISTORY, VITALS } from '@/services/seed'

export function DoctorAccess() {
  const { doc, now, extraHistory, pendingStudies, openEvent, openMedModal, validarTokenMedico, cerrarAccesoMedico, setDoc } = useStore()
  const docGrantRemMs = doc.grantExpires ? Math.max(0, doc.grantExpires - now) : 0
  const docExpiredNow = doc.granted && docGrantRemMs <= 0
  const docGranted = doc.granted && !docExpiredNow
  const docGrantRem = fmtRemaining(docGrantRemMs)
  const alergiasStr = VITALS.alergias.join(', ')
  const enfermedadesStr = VITALS.enfermedades.join(', ')
  const historyView = computeHistoryView(extraHistory, HISTORY)
  const pendingView = pendingStudies.map((p) => ({ ...p, fecha: fmtDate(p.ts), icon: p.tipo === 'Imagen' ? '🖼️' : '🧪' }))

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      {docGranted ? (
        <div>
          <div style={s('background:#e7f3f1;border:1px solid #c9e6e1;border-radius:14px;padding:14px 20px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;')}>
            <div style={s('display:flex;align-items:center;gap:12px;')}><span style={s('width:36px;height:36px;border-radius:10px;background:#0d7d74;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none;')}>✓</span><div><div style={s('font-size:14px;font-weight:700;color:#0a5c55;')}>Acceso autorizado al historial de Juan Carlos Pérez</div><div style={s('font-size:12.5px;color:#5a7a76;')}>Token {doc.grantCode} · acceso de solo lectura</div></div></div>
            <div style={s('text-align:right;')}><div style={s('font-size:11px;color:#5a7a76;font-weight:600;')}>EXPIRA EN</div><div style={s("font-size:20px;font-weight:800;color:#0a5c55;font-family:'JetBrains Mono',monospace;")}>{docGrantRem}</div></div>
          </div>
          <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;')}>
            <div style={s('display:flex;align-items:center;gap:14px;')}><div style={s('width:48px;height:48px;border-radius:50%;background:linear-gradient(150deg,#0d7d74,#0a5c55);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;')}>JP</div><div><div style={s('font-size:20px;font-weight:800;')}>Juan Carlos Pérez Quispe</div><div style={s('font-size:13px;color:#8a9a98;')}>DNI 45872136 · 35 años · Grupo {VITALS.sangre}</div></div></div>
            <button onClick={cerrarAccesoMedico} style={s('border:1px solid #d4e0de;background:#fff;color:#516160;font-size:13px;font-weight:600;padding:10px 16px;border-radius:9px;cursor:pointer;')}>Cerrar acceso</button>
          </div>
          <div style={s('display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;')}>
            <span style={s('font-size:12.5px;font-weight:600;background:#fdeaec;color:#c0202f;padding:7px 13px;border-radius:9px;')}>⚠️ Alergias: {alergiasStr}</span>
            <span style={s('font-size:12.5px;font-weight:600;background:#eaf2ff;color:#1d4ed8;padding:7px 13px;border-radius:9px;')}>🫁 {enfermedadesStr}</span>
          </div>

          <div style={s('display:flex;gap:10px;margin-bottom:24px;')}>
            <button onClick={() => openMedModal('nota')} style={s('flex:1;border:none;background:#0d7d74;color:#fff;font-size:14px;font-weight:700;padding:13px;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 22px -12px #0d7d74cc;')}>📝 Registrar nota clínica</button>
            <button onClick={() => openMedModal('receta')} style={s('flex:1;border:1.5px solid #d4e0de;background:#fff;color:#0f211f;font-size:14px;font-weight:700;padding:13px;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;')}>💊 Emitir receta</button>
            <button onClick={() => openMedModal('estudio')} style={s('flex:1;border:1.5px solid #d4e0de;background:#fff;color:#0f211f;font-size:14px;font-weight:700;padding:13px;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;')}>🔬 Solicitar estudio</button>
          </div>

          {pendingView.length > 0 && (
            <div style={s('background:#fff7e8;border:1px solid #f3e2bf;border-radius:14px;padding:16px 18px;margin-bottom:18px;')}>
              <div style={s('font-size:11.5px;font-weight:700;color:#9a6700;letter-spacing:.04em;margin-bottom:10px;')}>🔬 ESTUDIOS SOLICITADOS — PENDIENTES</div>
              {pendingView.map((p) => (
                <div key={p.id} style={s('display:flex;align-items:center;gap:10px;padding:7px 0;')}><span>{p.icon}</span><span style={s('flex:1;font-size:13.5px;font-weight:600;')}>{p.nombre} <span style={s('font-weight:400;color:#8a9a98;')}>· {p.tipo}</span></span><span style={s('font-size:11.5px;font-weight:700;background:#fff;color:#9a6700;border:1px solid #f3e2bf;padding:3px 9px;border-radius:6px;')}>{p.estado}</span></div>
              ))}
            </div>
          )}

          <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;margin-bottom:14px;')}>CRONOLOGÍA CLÍNICA</div>
          {historyView.map((e) => (
            <Box key={e.id} onClick={() => openEvent(e.id)}
              css="background:#fff;border:1px solid #eaeeed;border-radius:14px;padding:18px 20px;margin-bottom:12px;box-shadow:0 1px 2px rgba(15,33,31,.03);cursor:pointer;transition:box-shadow .15s,border-color .15s;"
              hover="box-shadow:0 10px 26px -14px rgba(15,33,31,.22);border-color:#cfe3df;">
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;')}>
                <div style={s('display:flex;align-items:center;gap:8px;')}><span style={s(`font-size:11.5px;font-weight:700;background:${e.tipoBg};color:${e.tipoFg};padding:4px 10px;border-radius:7px;`)}>{e.tipo}</span><h3 style={s('font-size:15.5px;font-weight:700;margin:0;')}>{e.titulo}</h3>{e.nuevo && <span style={s('font-size:10px;font-weight:800;background:#e7f3f1;color:#0a5c55;padding:3px 8px;border-radius:6px;')}>NUEVO</span>}</div>
                <span style={s('font-size:12.5px;color:#8a9a98;')}>{e.fecha}</span>
              </div>
              <p style={s('font-size:13px;color:#516160;line-height:1.5;margin:0 0 10px;')}>{e.diagnostico}</p>
              <div style={s('display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid #f0f3f2;')}><span style={s('font-size:12px;color:#8a9a98;')}>👨‍⚕️ {e.medico}</span><span style={s('font-size:12.5px;font-weight:700;color:#0d7d74;')}>Ver ficha →</span></div>
            </Box>
          ))}
        </div>
      ) : (
        <div style={s('max-width:500px;margin:40px auto 0;text-align:center;')}>
          <div style={s('width:64px;height:64px;border-radius:18px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 20px;')}>🩺</div>
          <h1 style={s('font-size:27px;font-weight:800;letter-spacing:-.02em;margin:0 0 8px;')}>Consultar historial por token</h1>
          <p style={s('font-size:14.5px;color:#516160;margin:0 0 28px;line-height:1.55;')}>Ingresa el token temporal que te compartió el paciente para acceder a su historial clínico.</p>
          <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:26px;box-shadow:0 4px 16px -8px rgba(15,33,31,.12);text-align:left;')}>
            <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:9px;')}>Token médico</label>
            <Box as="input" value={doc.tokenInput} onChange={(e) => setDoc('tokenInput', e.target.value)} placeholder="HMPQ-XXXX-XXXX"
              css="width:100%;border:1.5px solid #d4e0de;border-radius:11px;padding:15px 16px;font-size:18px;font-family:'JetBrains Mono',monospace;text-align:center;letter-spacing:.08em;text-transform:uppercase;background:#fff;margin-bottom:16px;" focus="border-color:#0d7d74;box-shadow:0 0 0 3px #0d7d7422;" />
            <button onClick={validarTokenMedico} style={s('width:100%;border:none;background:#0d7d74;color:#fff;font-size:15px;font-weight:700;padding:14px;border-radius:11px;cursor:pointer;box-shadow:0 12px 24px -10px #0d7d74cc;')}>
              {doc.validating
                ? <span style={s('display:inline-flex;align-items:center;gap:8px;')}><span style={s('width:15px;height:15px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;display:inline-block;animation:hq-spin .7s linear infinite;')} />Validando…</span>
                : <>Acceder al historial</>}
            </button>
            {doc.error && (
              <div style={s('background:#fdeaec;border:1px solid #f5c9ce;color:#c0202f;font-size:13px;font-weight:500;padding:11px 14px;border-radius:10px;margin-top:14px;display:flex;align-items:flex-start;gap:8px;')}><span style={s('font-weight:700;')}>!</span><span>{doc.error}</span></div>
            )}
            <div style={s('font-size:12px;color:#8a9a98;margin-top:14px;text-align:center;')}>Demo: el paciente Juan Pérez tiene activo <strong style={s("font-family:'JetBrains Mono',monospace;")}>HMPQ-7K2D-9F4X</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}
