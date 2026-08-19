import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import MembershipPlanInfoCard from './MembershipPlanInfoCard'
import MembershipPlanMembershipsCard from './MembershipPlanMembershipsCard'
import MembershipPlanDeleteCard from './MembershipPlanDeleteCard'

const MembershipPlanDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()

  const [planData, setPlanData] = useState(null)
  const [error, setError] = useState(null)

  const loadPlan = () => {
    get(
      `MembershipPlan/admin/${id}`,
      true,
      (data) => setPlanData(data),
      (err) => setError(err?.message ?? 'No se pudo cargar el plan de membresía.')
    )
  }

  useEffect(() => {
    loadPlan()
  }, [id])

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        <button
          id="btn-back-dashboard"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
        >
          <FaArrowLeft />
          Volver al panel
        </button>

        {isLoading && !planData && (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-zinc-800/60" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 py-16 text-center">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">No se pudieron cargar los datos del plan. Intentá de nuevo más tarde.</p>
          </div>
        )}

        {planData && !error && (
          <div className="space-y-6">
            <div className="mb-2">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
                Plan de membresía
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                  {planData.type || 'Plan sin nombre'}
                </h1>
                {planData.isDeleted && (
                  <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Discontinuado
                  </span>
                )}
              </div>
              {planData.isDeleted && (
                <p className="mt-2 text-sm text-zinc-400">
                  Este plan ya no se ofrece ni se puede asignar. Las membresías que seguían activas
                  no se renuevan y vencen en su fecha original.
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-500">
                ID: <span className="font-mono text-zinc-400">{planData.membershipPlanId}</span>
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MembershipPlanInfoCard planData={planData} onUpdated={loadPlan} />
              </div>
              <div className="flex flex-col gap-6">
                <MembershipPlanDeleteCard
                  planId={id}
                  planName={planData.type}
                  isDiscontinued={planData.isDeleted}
                  onRestored={loadPlan}
                />
              </div>
            </div>

            <MembershipPlanMembershipsCard memberships={planData.memberships} />
          </div>
        )}

      </section>
    </Layout>
  )
}

export default MembershipPlanDetail
