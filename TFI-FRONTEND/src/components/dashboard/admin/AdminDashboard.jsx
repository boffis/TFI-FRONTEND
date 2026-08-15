import { useState } from 'react'
import Layout from '../../layout/Layout'
import DashboardNav from './DashboardNav'
import UserList from './UserList/UserList'
import ClassList from './ClassList/ClassList'
import MembershipPlanList from './MembershipPlanList/MembershipPlanList'
import Metrics from './Metrics/Metrics'

const SECTION_COMPONENTS = {
  users: <UserList />,
  classes: <ClassList />,
  plans: <MembershipPlanList />,
  metrics: <Metrics />,
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* Page header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
            Panel de administración
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Panel
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Controlá y gestioná todos los datos del gimnasio desde un solo lugar.
          </p>
        </div>

        {/* Tab navigation */}
        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Active section */}
        <div className="mt-2">
          {SECTION_COMPONENTS[activeTab] ?? null}
        </div>

      </section>
    </Layout>
  )
}

export default AdminDashboard
