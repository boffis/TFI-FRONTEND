import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import GymClassInfoCard from './GymClassInfoCard'
import GymClassInscribedClientsCard from './GymClassInscribedClientsCard'
import GymClassDeleteCard from './GymClassDeleteCard'

const GymClassDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()

  const [classData, setClassData] = useState(null)
  const [error, setError] = useState(null)

  const loadClass = () => {
    get(
      `GymClass/admin/${id}`,
      true,
      (data) => setClassData(data),
      (err) => setError(err?.message ?? 'Failed to load gym class.')
    )
  }

  useEffect(() => {
    loadClass()
  }, [id])

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
          Back to Dashboard
        </button>

        {/* Loading skeleton */}
        {isLoading && !classData && (
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
            <p className="mt-2 text-sm text-zinc-500">Could not load class data. Please try again later.</p>
          </div>
        )}

        {/* Content */}
        {classData && !error && (
          <div className="space-y-6">
            {/* Page header */}
            <div className="mb-2">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
                Gym Class
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {classData.className}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                ID: <span className="font-mono text-zinc-400">{classData.gymClassId}</span>
              </p>
            </div>

            {/* Info and Delete side by side on large screens */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GymClassInfoCard classData={classData} onUpdated={loadClass} />
              </div>
              <div className="flex flex-col gap-6">
                <GymClassDeleteCard
                  classId={id}
                  classNameStr={classData.className}
                  enrolledCount={classData.inscribedClients?.length ?? 0}
                />
              </div>
            </div>

            {/* Inscribed Clients */}
            <GymClassInscribedClientsCard
              classId={classData.gymClassId}
              hasClassStarted={classData.hasStarted}
              clients={classData.inscribedClients}
              onSaved={loadClass}
            />
          </div>
        )}

      </section>
    </Layout>
  )
}

export default GymClassDetail
