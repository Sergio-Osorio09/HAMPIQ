import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

export function Landing() {
  const { goLogin, goRegister, quickPaciente, quickMedico, goEmergency, quickAdmin } = useStore()

  return (
    <div style={s('min-height:100vh;display:flex;flex-direction:column;background:radial-gradient(1200px 600px at 80% -10%, #d8efeb 0%, rgba(216,239,235,0) 60%), #ffffff;')}>
      <header style={s('display:flex;align-items:center;justify-content:space-between;padding:22px 48px;max-width:1280px;width:100%;margin:0 auto;')}>
        <div style={s('display:flex;align-items:center;gap:11px;')}>
          <div style={s('width:38px;height:38px;border-radius:11px;background:linear-gradient(150deg,#0d7d74,#0a5c55);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -6px #0d7d7488;position:relative;')}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
            <span style={s('position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:#e23b48;border:2px solid #fff;')} />
          </div>
          <div style={s('display:flex;flex-direction:column;line-height:1;')}>
            <span style={s('font-size:20px;font-weight:800;letter-spacing:-.02em;')}>Hampiq</span>
            <span style={s('font-size:10.5px;font-weight:600;color:#0d7d74;letter-spacing:.08em;text-transform:uppercase;margin-top:2px;')}>Historial Médico Nacional</span>
          </div>
        </div>
        <div style={s('display:flex;align-items:center;gap:10px;')}>
          <button data-testid="landing-login" onClick={goLogin} style={s('border:none;background:transparent;font-size:14.5px;font-weight:600;color:#0f211f;padding:11px 18px;border-radius:10px;cursor:pointer;')}>Iniciar sesión</button>
          <button data-testid="landing-register" onClick={goRegister} style={s('border:none;background:#0d7d74;color:#fff;font-size:14.5px;font-weight:600;padding:11px 20px;border-radius:10px;cursor:pointer;box-shadow:0 8px 18px -8px #0d7d74cc;')}>Crear cuenta</button>
        </div>
      </header>

      <div style={s('flex:1;display:flex;align-items:center;max-width:1280px;width:100%;margin:0 auto;padding:24px 48px 48px;gap:56px;')}>
        <div style={s('flex:1;max-width:560px;animation:hq-fade .6s ease both;')}>
          <div style={s('display:inline-flex;align-items:center;gap:8px;background:#e7f3f1;border:1px solid #c9e6e1;color:#0a5c55;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:100px;margin-bottom:24px;')}>
            <span style={s('width:7px;height:7px;border-radius:50%;background:#0d7d74;display:inline-block;animation:hq-pulse 2s infinite;')} />
            Plataforma de interoperabilidad clínica · Perú
          </div>
          <h1 style={s('font-size:54px;line-height:1.03;letter-spacing:-.035em;font-weight:800;margin:0 0 20px;text-wrap:balance;')}>Tu historial clínico,<br /><span style={s('color:#0d7d74;')}>donde tú decides.</span></h1>
          <p style={s('font-size:17.5px;line-height:1.6;color:#516160;margin:0 0 32px;max-width:480px;')}>Hampiq centraliza tu historia médica y te devuelve el control: comparte tu información con un médico mediante un <strong style={s('color:#0f211f;')}>token temporal</strong>, atiende emergencias con un <strong style={s('color:#0f211f;')}>código QR</strong> y revisa cada acceso en una auditoría inmutable.</p>
          <div style={s('display:flex;gap:12px;margin-bottom:40px;')}>
            <button onClick={goRegister} style={s('border:none;background:#0d7d74;color:#fff;font-size:15.5px;font-weight:700;padding:15px 26px;border-radius:12px;cursor:pointer;box-shadow:0 12px 26px -10px #0d7d74cc;')}>Crear mi cuenta</button>
            <button onClick={goLogin} style={s('border:1.5px solid #d4e0de;background:#fff;color:#0f211f;font-size:15.5px;font-weight:700;padding:15px 26px;border-radius:12px;cursor:pointer;')}>Ya tengo cuenta</button>
          </div>
          <div style={s('display:flex;gap:26px;')}>
            <div style={s('display:flex;align-items:center;gap:9px;font-size:13.5px;color:#516160;font-weight:500;')}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="#0d7d74" strokeWidth="1.8" strokeLinejoin="round" /></svg>Cifrado HTTPS/TLS</div>
            <div style={s('display:flex;align-items:center;gap:9px;font-size:13.5px;color:#516160;font-weight:500;')}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0d7d74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Auditoría inmutable</div>
          </div>
        </div>

        <div style={s('flex:1;display:flex;justify-content:center;animation:hq-pop .6s .1s ease both;')}>
          <div style={s('width:340px;background:#fff;border-radius:26px;padding:22px;box-shadow:0 40px 80px -30px #0a3b3733, 0 8px 24px -12px #0a3b3722;border:1px solid #ecf1f0;')}>
            <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;')}>
              <div style={s('display:flex;align-items:center;gap:9px;')}>
                <div style={s('width:40px;height:40px;border-radius:50%;background:linear-gradient(150deg,#0d7d74,#0a5c55);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;')}>JP</div>
                <div style={s('line-height:1.15;')}><div style={s('font-weight:700;font-size:14.5px;')}>Juan C. Pérez</div><div style={s('font-size:11.5px;color:#8a9a98;')}>DNI 45872136</div></div>
              </div>
              <span style={s('font-size:10.5px;font-weight:700;color:#0a5c55;background:#e7f3f1;padding:4px 9px;border-radius:7px;')}>PACIENTE</span>
            </div>
            <div style={s('background:#fbfcfc;border:1px dashed #d4e0de;border-radius:16px;padding:18px;display:flex;flex-direction:column;align-items:center;')}>
              <div style={s('font-size:11px;font-weight:700;color:#e23b48;letter-spacing:.1em;margin-bottom:12px;')}>⬤ QR DE EMERGENCIA</div>
              <div style={s('width:120px;height:120px;border-radius:12px;background:conic-gradient(from 0deg,#0f211f 0 25%,#fff 0 50%,#0f211f 0 75%,#fff 0)0 0/16px 16px,#0f211f;padding:9px;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(5,1fr);gap:3px;background-color:#fff;')} />
              <div style={s('margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;')}>
                <span style={s('font-size:11px;font-weight:600;background:#fdeaec;color:#c0202f;padding:4px 9px;border-radius:7px;')}>Grupo O+</span>
                <span style={s('font-size:11px;font-weight:600;background:#fff4e5;color:#9a5a00;padding:4px 9px;border-radius:7px;')}>Alergia: Penicilina</span>
                <span style={s('font-size:11px;font-weight:600;background:#eaf2ff;color:#1d4ed8;padding:4px 9px;border-radius:7px;')}>Asma</span>
              </div>
            </div>
            <div style={s('margin-top:16px;background:#0f211f;border-radius:14px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;')}>
              <div style={s('line-height:1.2;')}><div style={s("font-size:10.5px;color:#7fb8b2;font-weight:600;letter-spacing:.06em;")}>TOKEN MÉDICO ACTIVO</div><div style={s("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:#fff;margin-top:3px;")}>HMPQ-7K2D-9F4X</div></div>
              <div style={s('text-align:right;line-height:1.2;')}><div style={s("font-size:18px;font-weight:800;color:#5fd6cb;font-family:'JetBrains Mono',monospace;")}>14:52</div><div style={s('font-size:10px;color:#7fb8b2;')}>restante</div></div>
            </div>
          </div>
        </div>
      </div>

      <div style={s('background:#0f211f;padding:32px 48px;')}>
        <div style={s('max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;')}>
          <div style={s('color:#9fc4bf;font-size:13.5px;font-weight:500;')}>Accede a la demostración por rol — pruébala como cada actor del sistema:</div>
          <div style={s('display:flex;gap:10px;flex-wrap:wrap;')}>
            <button onClick={quickPaciente} style={s('border:1px solid #2c463f;background:#16302c;color:#dff0ed;font-size:13.5px;font-weight:600;padding:10px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:8px;')}>👤 Paciente</button>
            <button onClick={quickMedico} style={s('border:1px solid #2c463f;background:#16302c;color:#dff0ed;font-size:13.5px;font-weight:600;padding:10px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:8px;')}>🩺 Médico</button>
            <button data-testid="landing-emergency" onClick={goEmergency} style={s('border:1px solid #5a2b30;background:#3a1a1e;color:#ffd9dd;font-size:13.5px;font-weight:600;padding:10px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:8px;')}>🚑 Emergencia</button>
            <button onClick={quickAdmin} style={s('border:1px solid #2c463f;background:#16302c;color:#dff0ed;font-size:13.5px;font-weight:600;padding:10px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:8px;')}>⚙️ Administrador</button>
          </div>
        </div>
      </div>
      <div style={s('text-align:center;padding:16px;font-size:12px;color:#9aabaa;background:#0f211f;border-top:1px solid #1d3935;')}>Universidad Nacional Mayor de San Marcos · Proyecto Hampiq v1.0 — Prototipo funcional</div>
    </div>
  )
}
