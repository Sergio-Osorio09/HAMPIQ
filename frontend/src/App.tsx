import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Landing } from '@/pages/Landing'
import { Auth } from '@/pages/Auth'
import { Emergency } from '@/pages/Emergency'
import { AppShell } from '@/pages/AppShell'
import { Toast } from '@/components/Toast'

export default function App() {
  const screen = useStore((st) => st.screen)
  const tick = useStore((st) => st.tick)

  // Drive the live countdowns (token TTL, doctor grant) — mirrors the
  // prototype's 1-second forceUpdate loop.
  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  return (
    <>
      {screen === 'landing' && <Landing />}
      {screen === 'auth' && <Auth />}
      {screen === 'emergency' && <Emergency />}
      {screen === 'app' && <AppShell />}
      <Toast />
    </>
  )
}
