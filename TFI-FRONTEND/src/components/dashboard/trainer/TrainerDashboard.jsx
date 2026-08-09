import { useState } from 'react'
import Layout from '../../layout/Layout'
import TrainerDashboardNav from './TrainerDashboardNav'
import TrainerClassesList from './ClassesList/TrainerClassesList'
import TrainerSchedulesList from './SchedulesList/TrainerSchedulesList'

const SECTION_COMPONENTS = {
  classes: <TrainerClassesList />,
  schedules: <TrainerSchedulesList />,
}

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('classes')

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* Page header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
            Trainer Panel
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage your upcoming classes and the schedules you're in charge of.
          </p>
        </div>

        {/* Tab navigation */}
        <TrainerDashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Active section */}
        <div className="mt-2">
          {SECTION_COMPONENTS[activeTab] ?? null}
        </div>

      </section>
    </Layout>
  )
}

export default TrainerDashboard
