import { s } from '@/lib/style'

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={s(`width:42px;height:24px;border-radius:100px;border:none;cursor:pointer;padding:0;position:relative;background:${on ? '#0d7d74' : '#cdd7d6'};flex:none;`)}>
      <span style={s(`position:absolute;top:3px;left:${on ? '21px' : '3px'};width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);`)} />
    </button>
  )
}
