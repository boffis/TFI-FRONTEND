import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPlus } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import MembershipPlanTable from './MembershipPlanTable'

const SectionHeader = ({ title, subtitle, count, onAction, actionLabel }) => (
  <div className="flex items-start justify-between mb-6 mt-2">
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      {count != null && (
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
          {count} en total
        </span>
      )}
      {onAction && (
        <button
          onClick={onAction}
          className="
            flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white
            hover:bg-orange-600 active:scale-[.98] transition-all duration-150 cursor-pointer
          "
        >
          <FaPlus className="text-xs" />
          {actionLabel ?? 'Crear nuevo'}
        </button>
      )}
    </div>
  </div>
)

const MembershipPlanList = () => {
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()
  const [plans, setPlans] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    get(
      'membershipplan',
      true,
      data => setPlans(Array.isArray(data) ? data : []),
      err => setError(err?.message ?? 'No se pudieron cargar los planes de membresía.')
    )
  }, [])

  return (
    <div>
      <SectionHeader
        title="Planes de membresía"
        subtitle="Gestioná los planes de membresía disponibles y sus precios."
        count={!isLoading && !error ? plans.length : null}
        onAction={() => navigate('/admin/new/membershipplan')}
        actionLabel="Nuevo plan"
      />

      {error && !isLoading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center mb-10">
          <p className="font-semibold text-red-400">{error}</p>
          <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
        </div>
      )}

      {!error && (
        <MembershipPlanTable plans={plans} isLoading={isLoading} />
      )}
    </div>
  )
}

export default MembershipPlanList
