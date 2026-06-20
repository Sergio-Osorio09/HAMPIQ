import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

export function Toast() {
  const toast = useStore((st) => st.toast)
  if (!toast) return null
  return (
    <div style={s(`position:fixed;left:50%;bottom:30px;transform:translateX(-50%);z-index:90;background:${toast.bg};color:#fff;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 16px 40px -12px rgba(15,33,31,.5);display:flex;align-items:center;gap:10px;animation:hq-toast .3s ease;`)}>
      <span>{toast.icon}</span><span>{toast.msg}</span>
    </div>
  )
}
