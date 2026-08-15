import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import { capitalizeWords } from '../../../../utils/formatters'
import UserInfoCard from './UserInfoCard'
import UserRoleCard from './UserRoleCard'
import GrantCashMembershipCard from './GrantCashMembershipCard'
import UserPaymentsCard from './UserPaymentsCard'
import UserMembershipsCard from './UserMembershipsCard'
import UserInscriptionsCard from './UserInscriptionsCard'
import UserTaughtClassesCard from './UserTaughtClassesCard'
import UserDeleteCard from './UserDeleteCard'

const UserDetail = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()

  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)

  const loadUser = () => {
    get(
      `user/${userId}`,
      true,
      (data) => setUserData(data),
      (err) => setError(err?.message ?? 'No se pudo cargar el usuario.')
    )
  }

  useEffect(() => {
    loadUser()
  }, [userId])

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        {/* Back button */}
        <button
          id="btn-back-dashboard"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
        >
          <FaArrowLeft />
          Volver al panel
        </button>

        {/* Loading skeleton */}
        {isLoading && !userData && (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-zinc-800/60" />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 py-16 text-center">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">No se pudieron cargar los datos del usuario. Intentá de nuevo más tarde.</p>
          </div>
        )}

        {/* Content */}
        {userData && !error && (
          <div className="space-y-6">
            {/* Page header */}
            <div className="mb-2">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
                Perfil del usuario
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {capitalizeWords(userData.name)}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                ID: <span className="font-mono text-zinc-400">{userData.userId}</span>
              </p>
            </div>

            {/* Info + Role side by side on large screens */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <UserInfoCard userData={userData} onUpdated={loadUser} />
              </div>
              <div className="flex flex-col gap-6">
                <UserRoleCard userData={userData} onUpdated={loadUser} />
                {userData.role === 'Client' && (
                  <GrantCashMembershipCard userId={userId} onGranted={loadUser} />
                )}
                <UserDeleteCard userId={userId} userName={userData.name} />
              </div>
            </div>

            {/* Lists */}
            <UserMembershipsCard memberships={userData.memberships} isAdmin onRevoked={loadUser} />
            <UserPaymentsCard payments={userData.payments} />
            <UserInscriptionsCard inscriptions={userData.inscriptions} />
            <UserTaughtClassesCard taughtClasses={userData.taughtClasses} />
          </div>
        )}

      </section>
    </Layout>
  )
}

export default UserDetail
