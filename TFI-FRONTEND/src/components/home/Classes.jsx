import { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import ClassCard from '../classes/ClassCard'
import ScheduledClassCard from '../classes/ScheduledClassCard'
import Search from '../shared/Search'
import useFetch from '../../hooks/useFetch'

// ─── Mock data (shape matches real API response) ──────────────────────────────
const MOCK_DATA = {
  specialClasses: [
    {
      gymClassId: '11111111-0000-0000-0000-000000000001',
      className: 'HIIT Blast',
      classDescription: 'High-intensity interval training for all levels.',
      maxCapacity: 20,
      trainer: { trainerId: 'tr-1', name: 'Marcus Webb', specialization: 'Strength & Conditioning' },
      schedule: '2026-08-04T08:00:00',
    },
    {
      gymClassId: '11111111-0000-0000-0000-000000000002',
      className: 'Power Yoga',
      classDescription: 'Deep stretching and mindful movement.',
      maxCapacity: 15,
      trainer: { trainerId: 'tr-2', name: 'Sofia Reyes', specialization: 'Yoga & Flexibility' },
      schedule: '2026-08-05T09:30:00',
    },
    {
      gymClassId: '11111111-0000-0000-0000-000000000003',
      className: 'Boxing Workshop',
      classDescription: 'Introductory session to boxing techniques.',
      maxCapacity: 12,
      trainer: { trainerId: 'tr-3', name: 'Darius Cole', specialization: 'Combat Sports' },
      schedule: '2026-08-07T18:00:00',
    },
  ],
  scheduledClasses: [
    {
      gymClassScheduleId: '22222222-0000-0000-0000-000000000001',
      className: 'Indoor Cycling',
      classDescription: 'High-energy spin session.',
      maxCapacity: 25,
      trainer: { trainerId: 'tr-4', name: 'Jake Torino', specialization: 'Endurance & Cardio' },
      dayOfWeek: 1, // Monday
      timeOfDay: '07:00:00',
      isWeekly: true,
      isActive: true,
    },
    {
      gymClassScheduleId: '22222222-0000-0000-0000-000000000002',
      className: 'Core & Stability',
      classDescription: 'Functional core work for all levels.',
      maxCapacity: 18,
      trainer: { trainerId: 'tr-5', name: 'Lena Marsh', specialization: 'Functional Training' },
      dayOfWeek: 3, // Wednesday
      timeOfDay: '10:00:00',
      isWeekly: true,
      isActive: true,
    },
    {
      gymClassScheduleId: '22222222-0000-0000-0000-000000000003',
      className: 'Pilates Flow',
      classDescription: 'Low-impact Pilates for strength and posture.',
      maxCapacity: 16,
      trainer: { trainerId: 'tr-6', name: 'Natalie Cruz', specialization: 'Pilates & Rehab' },
      dayOfWeek: 5, // Friday
      timeOfDay: '11:00:00',
      isWeekly: true,
      isActive: true,
    },
  ],
}
// ──────────────────────────────────────────────────────────────────────────────

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
        <p className="text-sm text-zinc-600">Try a different search term or check back later.</p>
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
        setSpecialClasses((data.specialClasses ?? []).map(normalizeSpecial))
        setScheduledClasses((data.scheduledClasses ?? []).map(normalizeScheduled))
      },
      // Backend not ready — fall back to mock data
      () => {
        setSpecialClasses(MOCK_DATA.specialClasses.map(normalizeSpecial))
        setScheduledClasses(MOCK_DATA.scheduledClasses.map(normalizeScheduled))
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
            Schedule
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white">Browse Classes</h1>
          <p className="mt-3 text-base text-zinc-400">
            Find the perfect session, pick your trainer, and show up ready.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-10">
          <Search
            entity="classes"
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
              title="Special Classes"
              subtitle="One-time sessions — book your spot before they fill up."
              isEmpty={filteredSpecial.length === 0}
              emptyMsg="No special classes found"
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
              title="Scheduled Classes"
              subtitle="Recurring sessions available every week — join anytime."
              isEmpty={filteredScheduled.length === 0}
              emptyMsg="No scheduled classes found"
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
