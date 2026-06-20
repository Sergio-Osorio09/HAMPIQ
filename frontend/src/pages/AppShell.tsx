import type { ComponentType } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { s } from '@/lib/style'
import { useStore, type PScreen } from '@/store/useStore'

import { Dashboard } from '@/pages/patient/Dashboard'
import { History } from '@/pages/patient/History'
import { Share } from '@/pages/patient/Share'
import { Card } from '@/pages/patient/Card'
import { Audit } from '@/pages/patient/Audit'
import { Medicines } from '@/pages/patient/Medicines'
import { Profile } from '@/pages/patient/Profile'
import { DoctorHome } from '@/pages/doctor/Home'
import { DoctorAccess } from '@/pages/doctor/Access'
import { DoctorPatients } from '@/pages/doctor/Patients'
import { DoctorConsultas } from '@/pages/doctor/Consultas'
import { DoctorRx } from '@/pages/doctor/Rx'
import { AdminPanel } from '@/pages/admin/Panel'
import { AdminAudit } from '@/pages/admin/AuditGlobal'
import { AdminTokens } from '@/pages/admin/Tokens'
import { AdminUsers } from '@/pages/admin/Users'
import { EventModal } from '@/pages/modals/EventModal'
import { NoteModal, RxModal, StudyModal } from '@/pages/modals/MedModals'

const SCREENS: Record<PScreen, ComponentType> = {
  dashboard: Dashboard,
  history: History,
  share: Share,
  card: Card,
  audit: Audit,
  medicines: Medicines,
  profile: Profile,
  'med-home': DoctorHome,
  doctor: DoctorAccess,
  'med-patients': DoctorPatients,
  'audit-med': DoctorConsultas,
  'med-rx': DoctorRx,
  admin: AdminPanel,
  'admin-audit': AdminAudit,
  'admin-tokens': AdminTokens,
  'admin-users': AdminUsers,
}

export function AppShell() {
  const { pscreen, modalEvent, medModal } = useStore()
  const Screen = SCREENS[pscreen] || Dashboard

  return (
    <div style={s('display:flex;min-height:100vh;')}>
      <Sidebar />
      <main className="hq-scroll" style={s('flex:1;height:100vh;overflow-y:auto;')}>
        <div style={s('max-width:1080px;margin:0 auto;padding:34px 40px 64px;')}>
          <Screen />
        </div>
      </main>

      {modalEvent && <EventModal />}
      {medModal === 'nota' && <NoteModal />}
      {medModal === 'receta' && <RxModal />}
      {medModal === 'estudio' && <StudyModal />}
    </div>
  )
}
