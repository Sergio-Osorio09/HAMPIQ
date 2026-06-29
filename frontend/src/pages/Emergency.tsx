import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

export function Emergency() {
  const { emg, emgVitals, goHome, escanearQR, validarCodigoEmergencia, setEmg, resetEmergencia } = useStore()
  const v = emgVitals
  const alergiasStr = v ? v.alergias.join(', ') : ''
  const enfermedadesStr = v ? v.enfermedades.join(', ') : ''
  const medicacionStr = v ? v.medicacion.join(', ') : ''

  return (
    <div style={s('min-height:100vh;background:linear-gradient(170deg,#1a0e10,#2a1216 60%,#1a0e10);display:flex;flex-direction:column;color:#fff;')}>
      <header style={s('display:flex;align-items:center;justify-content:space-between;padding:20px 40px;border-bottom:1px solid #3a1f23;')}>
        <div style={s('display:flex;align-items:center;gap:11px;')}>
          <div style={s('width:36px;height:36px;border-radius:10px;background:#e23b48;display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px -4px #e23b48;')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" /></svg></div>
          <div style={s('line-height:1.1;')}><div style={s('font-size:17px;font-weight:800;')}>Hampiq <span style={s('color:#ff7e88;')}>Emergencia</span></div><div style={s('font-size:11px;color:#c98e93;letter-spacing:.06em;')}>ACCESO RESTRINGIDO · DATOS VITALES</div></div>
        </div>
        <button onClick={goHome} style={s('border:1px solid #4a2a2e;background:transparent;color:#e7c4c7;font-size:13px;font-weight:600;padding:9px 16px;border-radius:9px;cursor:pointer;')}>Salir</button>
      </header>

      <div style={s('flex:1;display:flex;align-items:center;justify-content:center;padding:40px;')}>

        {!emg.loaded && (
          <div style={s('text-align:center;max-width:460px;animation:hq-fade .4s ease both;')}>
            <div style={s('width:200px;height:200px;margin:0 auto 28px;border-radius:24px;border:2px dashed #5a2f33;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#211316;')}>
              <div style={s('font-size:64px;opacity:.5;')}>📷</div>
              <div style={s('position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#ff5d68,transparent);top:0;animation:hq-sweep 2s linear infinite;')} />
            </div>
            <h1 style={s('font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 10px;')}>Escanear código de emergencia</h1>
            <p style={s('font-size:15px;color:#c98e93;line-height:1.55;margin:0 0 26px;')}>Escanea el QR del paciente o ingresa su código manualmente. Solo verás el subconjunto vital de datos.</p>
            <button data-testid="emg-scan" onClick={escanearQR} style={s('border:none;background:#e23b48;color:#fff;font-size:15.5px;font-weight:700;padding:15px 28px;border-radius:12px;cursor:pointer;box-shadow:0 12px 28px -10px #e23b48;margin-bottom:20px;width:100%;')}>
              {emg.scanning
                ? <span style={s('display:inline-flex;align-items:center;gap:9px;justify-content:center;')}><span style={s('width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;display:inline-block;animation:hq-spin .7s linear infinite;')} />Escaneando…</span>
                : <>📷 Simular escaneo de QR</>}
            </button>
            <div style={s('display:flex;align-items:center;gap:12px;margin:8px 0 18px;color:#7a4f53;font-size:12px;')}><span style={s('flex:1;height:1px;background:#3a1f23;')} />o ingresa el código<span style={s('flex:1;height:1px;background:#3a1f23;')} /></div>
            <div style={s('display:flex;gap:9px;')}>
              <Box as="input" data-testid="emg-code" value={emg.codeInput} onChange={(e) => setEmg('codeInput', e.target.value)} placeholder="EMG-XXXXXXXX"
                css="flex:1;border:1.5px solid #4a2a2e;background:#211316;color:#fff;border-radius:11px;padding:13px 15px;font-size:15px;font-family:'JetBrains Mono',monospace;text-align:center;letter-spacing:.06em;text-transform:uppercase;" focus="border-color:#e23b48;" />
              <button data-testid="emg-submit" onClick={validarCodigoEmergencia} style={s('border:none;background:#3a1f23;color:#fff;font-weight:600;font-size:14px;padding:0 20px;border-radius:11px;cursor:pointer;')}>Ver</button>
            </div>
            {emg.error && (
              <div data-testid="emg-error" style={s('background:#3a1418;border:1px solid #6a2a30;color:#ff9aa3;font-size:13px;font-weight:500;padding:11px 14px;border-radius:10px;margin-top:14px;')}>{emg.error}</div>
            )}
            <div style={s('font-size:12px;color:#7a4f53;margin-top:18px;')}>El código aparece en la <strong style={s('color:#c98e93;')}>Tarjeta de emergencia</strong> del paciente.</div>
          </div>
        )}

        {emg.loaded && (
          <div data-testid="emg-vitals" style={s('max-width:620px;width:100%;animation:hq-pop .4s ease both;')}>
            <div style={s('background:#fff;color:#0f211f;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.6);')}>
              <div style={s('background:#e23b48;color:#fff;padding:22px 28px;display:flex;align-items:center;justify-content:space-between;')}>
                <div style={s('display:flex;align-items:center;gap:14px;')}><div style={s('width:54px;height:54px;border-radius:50%;background:#fff;color:#e23b48;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;')}>JP</div><div><div style={s('font-size:21px;font-weight:800;')}>Juan Carlos Pérez Quispe</div><div style={s('font-size:13px;opacity:.9;')}>DNI 45872136 · 35 años · Masculino</div></div></div>
                <div style={s('text-align:right;')}><div style={s('font-size:11px;font-weight:700;opacity:.85;letter-spacing:.06em;')}>GRUPO SANGUÍNEO</div><div data-testid="emg-blood-group" style={s('font-size:32px;font-weight:800;line-height:1;')}>O+</div></div>
              </div>
              <div style={s('padding:26px 28px;')}>
                <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;')}>
                  <div style={s('background:#fff4f5;border:1px solid #f8d4d8;border-radius:14px;padding:16px;')}><div style={s('font-size:12px;font-weight:700;color:#c0202f;letter-spacing:.04em;margin-bottom:8px;')}>⚠️ ALERGIAS</div><div data-testid="emg-allergies" style={s('font-size:15.5px;font-weight:700;')}>{alergiasStr}</div></div>
                  <div style={s('background:#eef4ff;border:1px solid #d3e1fb;border-radius:14px;padding:16px;')}><div style={s('font-size:12px;font-weight:700;color:#1d4ed8;letter-spacing:.04em;margin-bottom:8px;')}>🫁 ENFERMEDADES CRÍTICAS</div><div style={s('font-size:15.5px;font-weight:700;')}>{enfermedadesStr}</div></div>
                </div>
                <div style={s('background:#f7faf9;border:1px solid #e6eeed;border-radius:14px;padding:16px;margin-bottom:18px;')}><div style={s('font-size:12px;font-weight:700;color:#0a5c55;letter-spacing:.04em;margin-bottom:8px;')}>💊 MEDICACIÓN ACTUAL</div><div style={s('font-size:14.5px;font-weight:600;')}>{medicacionStr}</div></div>
                <div style={s('background:#0f211f;color:#fff;border-radius:14px;padding:18px;display:flex;align-items:center;justify-content:space-between;')}>
                  <div><div style={s('font-size:11.5px;color:#7fb8b2;font-weight:600;letter-spacing:.04em;margin-bottom:4px;')}>CONTACTO DE EMERGENCIA</div><div style={s('font-size:16px;font-weight:700;')}>{v?.contacto.nombre} <span style={s('font-size:13px;color:#9fc4bf;font-weight:500;')}>· {v?.contacto.relacion}</span></div></div>
                  <a href="tel:+51998123456" style={s('text-decoration:none;background:#0d7d74;color:#fff;font-size:15px;font-weight:700;padding:12px 18px;border-radius:11px;display:flex;align-items:center;gap:8px;')}>📞 {v?.contacto.telefono}</a>
                </div>
              </div>
              <div style={s('background:#f7faf9;border-top:1px solid #eaeeed;padding:14px 28px;font-size:12px;color:#8a9a98;text-align:center;')}>🔒 Este acceso fue registrado en la auditoría inmutable del paciente. No incluye el historial clínico completo.</div>
            </div>
            <div style={s('text-align:center;margin-top:20px;')}><button onClick={resetEmergencia} style={s('border:1px solid #4a2a2e;background:transparent;color:#e7c4c7;font-size:13.5px;font-weight:600;padding:11px 22px;border-radius:10px;cursor:pointer;')}>Escanear otro paciente</button></div>
          </div>
        )}

      </div>
    </div>
  )
}
