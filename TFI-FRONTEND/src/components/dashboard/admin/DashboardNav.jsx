import { FaUsers, FaDumbbell, FaClipboardList, FaChartBar } from 'react-icons/fa'

const TABS = [
  { id: 'users', label: 'Users', icon: FaUsers },
  { id: 'classes', label: 'Classes', icon: FaDumbbell },
  { id: 'plans', label: 'Plans', icon: FaClipboardList },
  { id: 'metrics', label: 'Metrics', icon: FaChartBar },
]

const DashboardNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center gap-1 border-b border-zinc-800 mb-8">
      {TABS.map(({ id, label, icon: Icon, disabled }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            id={`dashboard-tab-${id}`}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-5 py-3 text-sm font-semibold tracking-wide
              border-b-2 -mb-px transition-all duration-200
              ${isActive
                ? 'border-orange-500 text-orange-500'
                : disabled
                  ? 'border-transparent text-zinc-600 cursor-not-allowed'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-500 cursor-pointer'
              }
            `}
          >
            <Icon className="text-base" />
            {label}
            {disabled && (
              <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Soon
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default DashboardNav
