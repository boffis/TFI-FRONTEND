import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Layout from '../layout/Layout'
import useFetch from '../../hooks/useFetch'
import { AuthContext, ROLE } from '../../services/authContext/AuthContext'

const formatSchedule = (schedule) => {
  if (!schedule) return ''
  const start = new Date(schedule)
  const end = new Date(start.getTime() + 60 * 60 * 1000)

  const day = start.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const fmt = (d) =>
    d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${day} a las ${fmt(start)} – ${fmt(end)}`
}

const hasActiveMembership = (user) =>
  !!user?.memberships?.some((m) => !m.isCancelled && m.expirationDate && new Date(m.expirationDate) > new Date())

const GymClassDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, post, dele, isLoading } = useFetch()
  const { user, handleUpdateUser } = useContext(AuthContext)
  const [gymClass, setGymClass] = useState(null)
  const [actionError, setActionError] = useState(null)

  const currentUserId = user?.userId
  const isClient = user?.role === ROLE.MEMBER
  const isMember = hasActiveMembership(user)

  const fetchClass = () => {
    get(`GymClass/${id}`, true, (data) => setGymClass(data))
  }

  useEffect(() => {
    fetchClass()
  }, [id])

  if (isLoading && !gymClass) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500" />
        </div>
      </Layout>
    )
  }

  if (!gymClass) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-white">Clase no encontrada</h1>
          <p className="text-zinc-400">La clase que buscás no existe o fue eliminada.</p>
          <button onClick={() => navigate('/classes')} className="text-orange-500 hover:underline">
            ← Volver a clases
          </button>
        </div>
      </Layout>
    )
  }

  const { className, classDescription, maxCapacity, schedule, trainer, inscriptionCount, isCurrentUserInscribed } = gymClass
  const currentInscriptions = inscriptionCount ?? 0
  const isFull = currentInscriptions >= maxCapacity
  const isJoined = isCurrentUserInscribed

  // Join/leave touch only the Inscription table, so the AuthContext user goes stale unless resynced.
  const syncUser = () => {
    get(`user/${currentUserId}`, true, (data) => handleUpdateUser(data))
  }

  const handleJoinLeave = () => {
    setActionError(null)

    // No membership, no booking — send them to get one.
    if (!isJoined && !isMember) {
      navigate('/memberships')
      return
    }

    if (isJoined) {
      dele(
        `GymClass/${id}/leave/${currentUserId}`,
        true,
        () => {
          fetchClass()
          syncUser()
        },
        (err) => setActionError(err?.message ?? 'No se pudo cancelar la inscripción.')
      )
    } else {
      post(
        `GymClass/${id}/join/${currentUserId}`,
        true,
        null,
        () => {
          fetchClass()
          syncUser()
        },
        (err) => setActionError(err?.message ?? 'No se pudo completar la inscripción.')
      )
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <button 
          onClick={() => navigate('/classes')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white"
        >
          <span>←</span> Volver a clases
        </button>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <div className="relative border-b border-zinc-800 p-8 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {className}
                </h1>
                <p className="mt-2 text-lg text-zinc-400">{classDescription || 'Sin descripción.'}</p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-widest ${isFull ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {isFull ? 'Solo lista de espera' : 'Disponible'}
                </span>
                <span className="text-sm font-medium text-zinc-300">
                  {currentInscriptions} / {maxCapacity} lugares ocupados
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 sm:grid-cols-2 sm:p-10">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Instructor</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-orange-500 font-bold">
                    {trainer?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{trainer?.name}</p>
                    {trainer?.specialization && (
                      <p className="text-sm text-zinc-400">{trainer.specialization}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Horario</h3>
                <p className="mt-2 font-medium text-white">{formatSchedule(schedule)}</p>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-3">
              {actionError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                  {actionError}
                </div>
              )}

              {isClient && !isJoined && !isMember && (
                <p className="text-sm text-zinc-400">
                  Necesitás una membresía activa para reservar esta clase.
                </p>
              )}

              <button
                onClick={handleJoinLeave}
                disabled={!isClient || (!isJoined && isMember && isFull)}
                className={`w-full rounded-xl px-6 py-4 text-base font-bold transition-all duration-200
                  ${!isClient
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : isJoined
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-red-400'
                      : !isMember
                        ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20'
                        : isFull
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20'
                  }`}
              >
                {!user
                  ? 'Iniciá sesión para reservar'
                  : !isClient
                    ? 'Solo para clientes'
                    : isJoined
                      ? 'Cancelar inscripción'
                      : !isMember
                        ? 'Obtener una membresía'
                        : isFull
                          ? 'La clase está completa'
                          : 'Reservar mi lugar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GymClassDetail
