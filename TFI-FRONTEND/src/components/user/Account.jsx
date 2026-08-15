import { useContext } from 'react'
import Layout from '../layout/Layout'
import { AuthContext } from '../../services/authContext/AuthContext'
import { capitalizeWords } from '../../utils/formatters'
import AccountInfoCard from './AccountInfoCard'
import AccountDeleteCard from './AccountDeleteCard'
import AccountInscriptionsCard from './AccountInscriptionsCard'
import UserMembershipsCard from '../dashboard/admin/UserDetail/UserMembershipsCard'
import UserPaymentsCard from '../dashboard/admin/UserDetail/UserPaymentsCard'
import UserTaughtClassesCard from '../dashboard/admin/UserDetail/UserTaughtClassesCard'

const Account = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return (
      <Layout>
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <p className="text-zinc-400">Cargando perfil...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        
        {/* Page header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
            Mi cuenta
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            {capitalizeWords(user.name)}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestioná tu información personal y tus preferencias.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <AccountInfoCard />
            
            {/* Conditional lists for Client */}
            {user.role === 'Client' && (
              <>
                <UserMembershipsCard memberships={user.memberships} allowCancel={true} />
                <AccountInscriptionsCard />
                <UserPaymentsCard payments={user.payments} />
              </>
            )}

            {/* Conditional lists for Trainer */}
            {user.role === 'Trainer' && (
              <UserTaughtClassesCard taughtClasses={user.taughtClasses} />
            )}
          </div>

          {/* Danger zone / side column */}
          <div className="flex flex-col gap-6">
            <AccountDeleteCard />
          </div>
        </div>

      </section>
    </Layout>
  )
}

export default Account