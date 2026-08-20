import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import GymClassScheduleInfoCard from './GymClassScheduleInfoCard'
import GymClassScheduleInstancesCard from './GymClassScheduleInstancesCard'
import GymClassScheduleDeleteCard from './GymClassScheduleDeleteCard'
import { explainApiError } from '../../../../utils/errorMessages'

const GymClassScheduleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()

  const [scheduleData, setScheduleData] = useState(null)
  const [error, setError] = useState(null)

  const loadSchedule = () => {
    get(
      `GymClassSchedule/admin/${id}`,
      true,
      (data) => setScheduleData(data),
      (err) => setError(explainApiError(err, 'No se pudo cargar el horario de la clase.'))
    )
  }

  useEffect(() => {
    loadSchedule()
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

        {isLoading && !scheduleData && (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-zinc-800/60" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 py-16 text-center">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">No se pudieron cargar los datos del horario. Intentá de nuevo más tarde.</p>
          </div>
        )}

        {scheduleData && !error && (
          <div className="space-y-6">
            <div className="mb-2">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
                Horario de clase
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {scheduleData.className}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                ID: <span className="font-mono text-zinc-400">{scheduleData.gymClassScheduleId}</span>
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GymClassScheduleInfoCard scheduleData={scheduleData} onUpdated={loadSchedule} />
              </div>
              <div className="flex flex-col gap-6">
                <GymClassScheduleDeleteCard scheduleId={id} classNameStr={scheduleData.className} />
              </div>
            </div>

            <GymClassScheduleInstancesCard gymClasses={scheduleData.gymClasses} />
          </div>
        )}

      </section>
    </Layout>
  )
}

export default GymClassScheduleDetail
