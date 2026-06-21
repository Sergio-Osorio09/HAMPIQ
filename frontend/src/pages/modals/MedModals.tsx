import type { ReactNode } from 'react'
import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { MEDICINES } from '@/services/seed'

const FIELD = 'width:100%;border:1.5px solid #d4e0de;border-radius:10px;padding:12px 14px;font-size:14.5px;'
const FOCUS = 'border-color:#0d7d74;box-shadow:0 0 0 3px #0d7d7422;'
const LABEL = 'display:block;font-size:13px;font-weight:600;margin-bottom:7px;'
const SELECT = 'width:100%;border:1.5px solid #d4e0de;border-radius:10px;padding:12px 14px;font-size:14.5px;background:#fff;margin-bottom:14px;cursor:pointer;'
const CANCEL = 'border:1.5px solid #d4e0de;background:#fff;color:#516160;font-size:14px;font-weight:600;padding:11px 18px;border-radius:10px;cursor:pointer;'
const SUBMIT = 'border:none;background:#0d7d74;color:#fff;font-size:14px;font-weight:700;padding:11px 22px;border-radius:10px;cursor:pointer;'
const ERR = 'background:#fdeaec;border:1px solid #f5c9ce;color:#c0202f;font-size:13px;padding:10px 13px;border-radius:9px;margin-top:8px;'

function Shell({ icon, title, onClose, children, footer }: { icon: string; title: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  return (
    <div onClick={onClose} style={s('position:fixed;inset:0;z-index:85;background:rgba(15,33,31,.55);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:30px;')}>
      <div onClick={(e) => e.stopPropagation()} style={s('width:100%;max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,.5);animation:hq-pop .3s ease both;')}>
        <div style={s('padding:22px 26px;border-bottom:1px solid #eaeeed;display:flex;align-items:center;justify-content:space-between;')}>
          <div style={s('display:flex;align-items:center;gap:11px;')}><span style={s('width:38px;height:38px;border-radius:11px;background:#e7f3f1;display:flex;align-items:center;justify-content:center;font-size:18px;')}>{icon}</span><h2 style={s('font-size:18px;font-weight:800;margin:0;')}>{title}</h2></div>
          <button onClick={onClose} aria-label="Cerrar" style={s('width:34px;height:34px;border-radius:10px;border:1px solid #e6eeed;background:#fff;color:#516160;font-size:16px;cursor:pointer;')}>✕</button>
        </div>
        <div style={s('padding:22px 26px;')}>{children}</div>
        <div style={s('padding:16px 26px;border-top:1px solid #eaeeed;display:flex;gap:10px;justify-content:flex-end;')}>{footer}</div>
      </div>
    </div>
  )
}

export function NoteModal() {
  const { noteForm, setNote, guardarNota, closeMedModal } = useStore()
  return (
    <Shell icon="📝" title="Registrar nota clínica" onClose={closeMedModal}
      footer={<><button onClick={closeMedModal} style={s(CANCEL)}>Cancelar</button><button onClick={guardarNota} style={s(SUBMIT)}>Guardar en historial</button></>}>
      <div style={s('font-size:12.5px;color:#8a9a98;margin-bottom:18px;')}>Paciente: <strong style={s('color:#0f211f;')}>Juan Carlos Pérez Quispe</strong> · el registro será inmutable y quedará auditado.</div>
      <label style={s(LABEL)}>Tipo de registro</label>
      <select value={noteForm.tipo} onChange={(e) => setNote('tipo', e.target.value)} style={s(SELECT)}>
        <option>Consulta</option><option>Emergencia</option><option>Laboratorio</option><option>Vacunación</option>
      </select>
      <label style={s(LABEL)}>Título / motivo</label>
      <Box as="input" value={noteForm.titulo} onChange={(e) => setNote('titulo', e.target.value)} placeholder="Ej. Control de asma bronquial" css={FIELD + 'margin-bottom:14px;'} focus={FOCUS} />
      <label style={s(LABEL)}>Diagnóstico</label>
      <Box as="textarea" value={noteForm.diagnostico} onChange={(e) => setNote('diagnostico', e.target.value)} placeholder="Descripción del diagnóstico…" rows={3} css={FIELD + 'margin-bottom:14px;resize:vertical;font-family:inherit;'} focus={FOCUS} />
      <label style={s(LABEL)}>Indicaciones <span style={s('font-weight:400;color:#a3b1af;')}>(opcional)</span></label>
      <Box as="textarea" value={noteForm.indicaciones} onChange={(e) => setNote('indicaciones', e.target.value)} placeholder="Indicaciones para el paciente…" rows={2} css={FIELD + 'margin-bottom:6px;resize:vertical;font-family:inherit;'} focus={FOCUS} />
      {noteForm.error && <div style={s(ERR)}>{noteForm.error}</div>}
    </Shell>
  )
}

export function RxModal() {
  const { rxForm, setRx, emitirReceta, closeMedModal } = useStore()
  const medRxOptions = MEDICINES.map((m) => m.principio)
  return (
    <Shell icon="💊" title="Emitir receta electrónica" onClose={closeMedModal}
      footer={<><button onClick={closeMedModal} style={s(CANCEL)}>Cancelar</button><button onClick={emitirReceta} style={s(SUBMIT)}>Emitir receta</button></>}>
      <div style={s('font-size:12.5px;color:#8a9a98;margin-bottom:18px;')}>Para: <strong style={s('color:#0f211f;')}>Juan Carlos Pérez Quispe</strong></div>
      <label style={s(LABEL)}>Medicamento / principio activo</label>
      <Box as="input" value={rxForm.medNombre} onChange={(e) => setRx('medNombre', e.target.value)} list="rxlist" placeholder="Ej. Budesonida 200 mcg" css={FIELD + 'margin-bottom:14px;'} focus={FOCUS} />
      <datalist id="rxlist">{medRxOptions.map((opt, i) => <option key={i} value={opt} />)}</datalist>
      <div style={s('display:flex;gap:12px;')}>
        <div style={s('flex:1;')}><label style={s(LABEL)}>Dosis / posología</label><Box as="input" value={rxForm.dosis} onChange={(e) => setRx('dosis', e.target.value)} placeholder="Ej. 1 inhalación c/12 h" css={FIELD + 'margin-bottom:6px;'} focus={FOCUS} /></div>
        <div style={s('flex:1;')}><label style={s(LABEL)}>Duración</label><Box as="input" value={rxForm.duracion} onChange={(e) => setRx('duracion', e.target.value)} placeholder="Ej. 8 semanas" css={FIELD + 'margin-bottom:6px;'} focus={FOCUS} /></div>
      </div>
      {rxForm.error && <div style={s(ERR)}>{rxForm.error}</div>}
    </Shell>
  )
}

export function StudyModal() {
  const { studyForm, setStudy, solicitarEstudio, closeMedModal } = useStore()
  return (
    <Shell icon="🔬" title="Solicitar estudio" onClose={closeMedModal}
      footer={<><button onClick={closeMedModal} style={s(CANCEL)}>Cancelar</button><button onClick={solicitarEstudio} style={s(SUBMIT)}>Solicitar</button></>}>
      <label style={s(LABEL)}>Tipo de estudio</label>
      <select value={studyForm.tipo} onChange={(e) => setStudy('tipo', e.target.value)} style={s(SELECT)}>
        <option>Laboratorio</option><option>Imagen</option>
      </select>
      <label style={s(LABEL)}>Estudio solicitado</label>
      <Box as="input" value={studyForm.nombre} onChange={(e) => setStudy('nombre', e.target.value)} placeholder="Ej. Espirometría / Radiografía de tórax" css={FIELD + 'margin-bottom:14px;'} focus={FOCUS} />
      <label style={s(LABEL)}>Indicación clínica <span style={s('font-weight:400;color:#a3b1af;')}>(opcional)</span></label>
      <Box as="input" value={studyForm.indicacion} onChange={(e) => setStudy('indicacion', e.target.value)} placeholder="Motivo de la solicitud…" css={FIELD + 'margin-bottom:6px;'} focus={FOCUS} />
      {studyForm.error && <div style={s(ERR)}>{studyForm.error}</div>}
    </Shell>
  )
}
