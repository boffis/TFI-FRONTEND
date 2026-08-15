import { FaDumbbell, FaCalendarAlt } from 'react-icons/fa'

const TABS = [
  { id: 'classes', label: 'Próximas clases', icon: FaDumbbell },
  { id: 'schedules', label: 'Mis horarios', icon: FaCalendarAlt },
]

const TrainerDashboardNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center gap-1 border-b border-zinc-800 mb-8">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            id={`trainer-dashboard-tab-${id}`}
            onClick={() => onTabChange(id)}
            className={`
              flex items-center gap-2 px-5 py-3 text-sm font-semibold tracking-wide
              border-b-2 -mb-px transition-all duration-200
              ${isActive
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-500 cursor-pointer'
              }
            `}
          >
            <Icon className="text-base" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export default TrainerDashboardNav
