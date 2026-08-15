import { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import ClassCard from '../classes/ClassCard'
import ScheduledClassCard from '../classes/ScheduledClassCard'
import Search from '../shared/Search'
import useFetch from '../../hooks/useFetch'

// Normalize raw API shapes into flat props that the cards expect
const normalizeSpecial = (item) => ({
  classId: item.gymClassId,
  className: item.className,
  trainerName: item.trainer?.name ?? '',
  trainerSpecialization: item.trainer?.specialization ?? '',
  schedule: item.schedule,
  maxCapacity: item.maxCapacity,
})

const normalizeScheduled = (item) => ({
  classId: item.gymClassScheduleId,
  className: item.className,
  trainerName: item.trainer?.name ?? '',
  trainerSpecialization: item.trainer?.specialization ?? '',
  dayOfWeek: item.dayOfWeek,
  timeOfDay: item.timeOfDay,
  maxCapacity: item.maxCapacity,
  isWeekly: item.isWeekly,
})

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, subtitle, children, isEmpty, emptyMsg }) => (
  <div className="mb-16">
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
    {isEmpty ? (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 py-16 text-center">
        <p className="text-base font-semibold text-zinc-400">{emptyMsg}</p>
        <p className="text-sm text-zinc-600">Probá con otra búsqueda o volvé a consultar más tarde.</p>
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    )}
  </div>
)

// ─── Skeleton grid ────────────────────────────────────────────────────────────
const SkeletonGrid = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
    ))}
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────
const Classes = () => {
  const { get, isLoading } = useFetch()
  const [specialClasses, setSpecialClasses] = useState([])
  const [scheduledClasses, setScheduledClasses] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    get(
      'gymclass/scheduledandspecialclasses',
      false,
      (data) => {
        console.log(data)
        setSpecialClasses((data?.specialClasses ?? []).map(normalizeSpecial))
        setScheduledClasses((data?.scheduledClasses ?? []).map(normalizeScheduled))
      },
      (err) => {
        console.error('Failed to fetch classes:', err)
        setSpecialClasses([])
        setScheduledClasses([])
      }
    )
  }, [])

  const matchesSearch = (c) => {
    const q = search.toLowerCase()
    return (
      c.className.toLowerCase().includes(q) ||
      c.trainerName.toLowerCase().includes(q) ||
      c.trainerSpecialization.toLowerCase().includes(q)
    )
  }

  const filteredSpecial = specialClasses.filter(matchesSearch)
  const filteredScheduled = scheduledClasses.filter(matchesSearch)

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">

        {/* Page header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Cronograma
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white">Ver clases</h1>
          <p className="mt-3 text-base text-zinc-400">
            Encontrá la sesión ideal, elegí tu entrenador y vení con todo.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-10">
          <Search
            entity="clases"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <>
            <div className="mb-4 h-7 w-48 animate-pulse rounded-lg bg-zinc-800" />
            <SkeletonGrid />
            <div className="mb-4 mt-14 h-7 w-48 animate-pulse rounded-lg bg-zinc-800" />
            <SkeletonGrid />
          </>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {/* ── Special Classes ── */}
            <Section
              title="Clases especiales"
              subtitle="Sesiones únicas: reservá tu lugar antes de que se llenen."
              isEmpty={filteredSpecial.length === 0}
              emptyMsg="No se encontraron clases especiales"
            >
              {filteredSpecial.map((c) => (
                <ClassCard
                  key={c.classId}
                  classId={c.classId}
                  className={c.className}
                  trainerName={c.trainerName}
                  trainerSpecialization={c.trainerSpecialization}
                  schedule={c.schedule}
                  maxCapacity={c.maxCapacity}
                />
              ))}
            </Section>

            {/* Divider */}
            <hr className="mb-16 border-zinc-800" />

            {/* ── Scheduled Classes ── */}
            <Section
              title="Clases programadas"
              subtitle="Sesiones recurrentes disponibles todas las semanas: sumate cuando quieras."
              isEmpty={filteredScheduled.length === 0}
              emptyMsg="No se encontraron clases programadas"
            >
              {filteredScheduled.map((c) => (
                <ScheduledClassCard
                  key={c.classId}
                  classId={c.classId}
                  className={c.className}
                  trainerName={c.trainerName}
                  trainerSpecialization={c.trainerSpecialization}
                  dayOfWeek={c.dayOfWeek}
                  timeOfDay={c.timeOfDay}
                  maxCapacity={c.maxCapacity}
                  isWeekly={c.isWeekly}
                />
              ))}
            </Section>
          </>
        )}
      </section>
    </Layout>
  )
}

export default Classes
