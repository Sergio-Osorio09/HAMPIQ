import { s } from '@/lib/style'
import { fmtDate } from '@/lib/format'
import { useStore } from '@/store/useStore'
import { EST_C, TIPO_C } from '@/store/selectors'

const CARD = 'background:#fff;border:1px solid #eaeeed;border-radius:14px;padding:18px;'
const SECTION_LABEL = 'font-size:11.5px;font-weight:700;color:#8a9a98;letter-spacing:.04em;margin-bottom:8px;'

export function EventModal() {
  const { modalEvent, history, closeEvent } = useStore()
  if (!modalEvent) return null
  const e = history.find((x) => x.id === modalEvent)
  if (!e) return null

  const tc = TIPO_C[e.tipo] || { bg: '#eef1f1', fg: '#516160' }
  const hasSignos = e.signos.pa !== '—'
  const signosList = [
    { k: 'Presión arterial', v: e.signos.pa },
    { k: 'Frecuencia cardiaca', v: e.signos.fc },
    { k: 'Frec. respiratoria', v: e.signos.fr },
    { k: 'Temperatura', v: e.signos.temp },
    { k: 'Saturación O₂', v: e.signos.sat },
    { k: 'IMC', v: e.signos.imc },
  ]

  return (
    <div onClick={closeEvent} className="hq-scroll" style={s('position:fixed;inset:0;z-index:80;background:rgba(15,33,31,.55);backdrop-filter:blur(3px);display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;')}>
      <div onClick={(ev) => ev.stopPropagation()} style={s('width:100%;max-width:820px;background:#f3f6f5;border-radius:22px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,.5);animation:hq-pop .3s ease both;')}>
        <div style={s('background:#fff;padding:24px 28px;border-bottom:1px solid #eaeeed;position:sticky;top:0;z-index:2;')}>
          <div style={s('display:flex;align-items:flex-start;justify-content:space-between;gap:16px;')}>
            <div>
              <div style={s('display:flex;align-items:center;gap:9px;margin-bottom:8px;')}>
                <span style={s(`font-size:11.5px;font-weight:700;background:${tc.bg};color:${tc.fg};padding:4px 10px;border-radius:7px;`)}>{e.tipo}</span>
                <span style={s('font-size:12.5px;color:#8a9a98;')}>{fmtDate(e.ts)}</span>
              </div>
              <h2 style={s('font-size:23px;font-weight:800;letter-spacing:-.02em;margin:0;')}>{e.titulo}</h2>
              <div style={s('font-size:13px;color:#516160;margin-top:6px;')}>{e.medico} · {e.especialidad} · {e.estab}</div>
            </div>
            <button onClick={closeEvent} style={s('width:38px;height:38px;border-radius:11px;border:1px solid #e6eeed;background:#fff;color:#516160;font-size:18px;cursor:pointer;flex:none;line-height:1;')}>✕</button>
          </div>
        </div>

        <div style={s('padding:24px 28px;')}>
          <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;')}>
            <div style={s(CARD)}>
              <div style={s(SECTION_LABEL)}>MOTIVO DE CONSULTA</div>
              <div style={s('font-size:13.5px;line-height:1.55;color:#3a4a48;')}>{e.motivo}</div>
            </div>
            <div style={s(CARD)}>
              <div style={s(SECTION_LABEL)}>DIAGNÓSTICO</div>
              <div style={s('font-size:13.5px;line-height:1.55;color:#3a4a48;')}>{e.diagnostico}</div>
            </div>
          </div>

          <div style={s(CARD + 'margin-bottom:16px;')}>
            <div style={s(SECTION_LABEL)}>EXAMEN FÍSICO</div>
            <div style={s('font-size:13.5px;line-height:1.55;color:#3a4a48;')}>{e.examen}</div>
          </div>

          {hasSignos && (
            <div style={s(CARD + 'margin-bottom:16px;')}>
              <div style={s('font-size:11.5px;font-weight:700;color:#8a9a98;letter-spacing:.04em;margin-bottom:14px;')}>SIGNOS VITALES</div>
              <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:14px;')}>
                {signosList.map((sv, i) => (
                  <div key={i} style={s('background:#f7faf9;border-radius:10px;padding:12px 14px;')}><div style={s('font-size:11.5px;color:#8a9a98;margin-bottom:3px;')}>{sv.k}</div><div style={s("font-size:16px;font-weight:700;font-family:'JetBrains Mono',monospace;")}>{sv.v}</div></div>
                ))}
              </div>
            </div>
          )}

          {e.medicamentos.length > 0 && (
            <div style={s(CARD + 'margin-bottom:16px;')}>
              <div style={s('font-size:11.5px;font-weight:700;color:#8a9a98;letter-spacing:.04em;margin-bottom:14px;')}>MEDICACIÓN PRESCRITA</div>
              <div style={s('display:flex;flex-direction:column;gap:10px;')}>
                {e.medicamentos.map((m, i) => (
                  <div key={i} style={s('display:flex;align-items:center;gap:14px;padding:12px 14px;background:#f7faf9;border-radius:11px;')}>
                    <span style={s('width:36px;height:36px;border-radius:10px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:17px;flex:none;')}>💊</span>
                    <div style={s('flex:1;')}><div style={s('font-size:14px;font-weight:700;')}>{m.nombre}</div><div style={s('font-size:12.5px;color:#8a9a98;')}>{m.indicacion}</div></div>
                    <span style={s('font-size:13px;font-weight:600;color:#0a5c55;')}>{m.dosis}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {e.estudios.length > 0 && (
            <div style={s('margin-bottom:16px;')}>
              <div style={s('font-size:11.5px;font-weight:700;color:#8a9a98;letter-spacing:.04em;margin-bottom:14px;')}>ESTUDIOS Y RESULTADOS</div>
              {e.estudios.map((st, idx) => (
                <div key={idx} style={s('background:#fff;border:1px solid #eaeeed;border-radius:14px;overflow:hidden;margin-bottom:12px;')}>
                  {st.t === 'img' && (
                    <div>
                      <div style={s('display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #f0f3f2;')}>
                        <div style={s('display:flex;align-items:center;gap:10px;')}><span style={s('font-size:18px;')}>🖼️</span><div><div style={s('font-size:14.5px;font-weight:700;')}>{st.n}</div><div style={s('font-size:12px;color:#8a9a98;')}>{st.modalidad}</div></div></div>
                        <span style={s("font-size:11px;font-weight:700;background:#0f211f;color:#5fd6cb;padding:4px 10px;border-radius:7px;font-family:'JetBrains Mono',monospace;")}>DICOM</span>
                      </div>
                      <div style={s('display:flex;gap:0;background:#0a0d0d;')}>
                        <div style={s('flex:1;padding:18px;display:flex;align-items:center;justify-content:center;position:relative;min-height:280px;')}>
                          <svg viewBox="0 0 200 240" width="190" height="228" style={{ display: 'block', filter: 'contrast(1.05)' }}>
                            <defs>
                              <radialGradient id="lung" cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor="#3a4750" /><stop offset="100%" stopColor="#0e1316" /></radialGradient>
                              <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#222a2f" /><stop offset="100%" stopColor="#10151a" /></linearGradient>
                            </defs>
                            <rect x="0" y="0" width="200" height="240" fill="#0a0d0d" />
                            <path d="M55 20 Q100 8 145 20 Q160 60 150 130 Q145 200 130 230 L70 230 Q55 200 50 130 Q40 60 55 20Z" fill="url(#body)" />
                            <ellipse cx="72" cy="110" rx="34" ry="62" fill="url(#lung)" opacity="0.92" />
                            <ellipse cx="128" cy="110" rx="34" ry="62" fill="url(#lung)" opacity="0.92" />
                            <rect x="96" y="40" width="8" height="170" rx="4" fill="#5a6770" opacity="0.85" />
                            <path d="M58 50 Q80 60 96 64 M142 50 Q120 60 104 64" stroke="#7d8a92" strokeWidth="3" fill="none" opacity="0.7" />
                            <path d="M52 70 Q80 84 96 86" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.6" />
                            <path d="M52 88 Q80 102 96 104" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.6" />
                            <path d="M52 106 Q80 120 96 122" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.55" />
                            <path d="M52 124 Q80 138 96 140" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.5" />
                            <path d="M148 70 Q120 84 104 86" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.6" />
                            <path d="M148 88 Q120 102 104 104" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.6" />
                            <path d="M148 106 Q120 120 104 122" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.55" />
                            <path d="M148 124 Q120 138 104 140" stroke="#6b7780" strokeWidth="2.5" fill="none" opacity="0.5" />
                            <path d="M104 150 Q130 165 134 195 Q120 178 104 174Z" fill="#2b343a" opacity="0.8" />
                          </svg>
                          <div style={s("position:absolute;top:12px;left:14px;font-size:10px;color:#5fd6cb;font-family:'JetBrains Mono',monospace;line-height:1.5;opacity:.8;")}>PÉREZ QUISPE, J.C.<br />DNI 45872136<br />{st.equipo}</div>
                          <div style={s("position:absolute;top:12px;right:14px;font-size:10px;color:#5fd6cb;font-family:'JetBrains Mono',monospace;text-align:right;line-height:1.5;opacity:.8;")}>PA · ERECT<br />kVp 120 · mAs 4<br />W 480 L 40</div>
                          <div style={s("position:absolute;bottom:12px;left:14px;font-size:13px;color:#fff;font-family:'JetBrains Mono',monospace;font-weight:700;opacity:.4;")}>R</div>
                        </div>
                        <div style={s('width:54px;background:#11181c;border-left:1px solid #1d262b;display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:14px;')}>
                          <span style={s('color:#5a6770;font-size:16px;')}>🔍</span><span style={s('color:#5a6770;font-size:16px;')}>☀️</span><span style={s('color:#5a6770;font-size:16px;')}>↔️</span><span style={s('color:#5a6770;font-size:16px;')}>📐</span>
                          <div style={s('flex:1;')} />
                          <span style={s('color:#5a6770;font-size:16px;')}>⤢</span>
                        </div>
                      </div>
                      <div style={s('padding:14px 18px;background:#fbfcfc;')}><div style={s('font-size:11.5px;font-weight:700;color:#8a9a98;margin-bottom:5px;')}>HALLAZGOS RADIOLÓGICOS</div><div style={s('font-size:13px;line-height:1.55;color:#3a4a48;')}>{st.hallazgos}</div></div>
                    </div>
                  )}
                  {st.t === 'lab' && (
                    <div>
                      <div style={s('display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #f0f3f2;')}>
                        <div style={s('display:flex;align-items:center;gap:10px;')}><span style={s('font-size:18px;')}>🧪</span><div><div style={s('font-size:14.5px;font-weight:700;')}>{st.n}</div><div style={s('font-size:12px;color:#8a9a98;')}>{st.lab}</div></div></div>
                      </div>
                      <div style={s('padding:6px 18px 14px;')}>
                        <div style={s('display:grid;grid-template-columns:1.4fr 1fr 1fr 0.9fr;gap:10px;padding:12px 6px;font-size:10.5px;font-weight:700;color:#a3b1af;letter-spacing:.04em;border-bottom:1px solid #f0f3f2;')}><span>PARÁMETRO</span><span>RESULTADO</span><span>REFERENCIA</span><span style={s('text-align:right;')}>ESTADO</span></div>
                        {st.rows.map((r, ri) => {
                          const c = EST_C[r.e] || EST_C.normal
                          return (
                            <div key={ri} style={s('display:grid;grid-template-columns:1.4fr 1fr 1fr 0.9fr;gap:10px;padding:11px 6px;border-bottom:1px solid #f5f7f6;align-items:center;')}>
                              <span style={s('font-size:13px;font-weight:600;')}>{r.p}</span>
                              <span style={s("font-size:13.5px;font-weight:700;font-family:'JetBrains Mono',monospace;")}>{r.v} {r.u}</span>
                              <span style={s("font-size:12.5px;color:#8a9a98;font-family:'JetBrains Mono',monospace;")}>{r.r}</span>
                              <span style={s('text-align:right;')}><span style={s(`font-size:11px;font-weight:700;background:${c.bg};color:${c.fg};padding:3px 9px;border-radius:6px;`)}>{c.l}</span></span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={s('background:#0f211f;border-radius:14px;padding:18px 20px;color:#fff;')}>
            <div style={s('font-size:11.5px;font-weight:700;color:#7fb8b2;letter-spacing:.04em;margin-bottom:8px;')}>📌 INDICACIONES</div>
            <div style={s('font-size:13.5px;line-height:1.6;color:#dff0ed;')}>{e.indicaciones}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
