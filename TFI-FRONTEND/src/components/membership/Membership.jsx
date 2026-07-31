import { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import useFetch from '../../hooks/useFetch'

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-8 flex flex-col gap-4">
    <div className="h-4 w-24 rounded-lg bg-zinc-800" />
    <div className="h-10 w-40 rounded-lg bg-zinc-800" />
    <div className="mt-auto h-11 w-full rounded-xl bg-zinc-800" />
  </div>
)

// ─── Plan card ────────────────────────────────────────────────────────────────
const PlanCard = ({ type, price }) => {
  const isPopular = type?.toLowerCase().includes('month') || type?.toLowerCase().includes('standard')

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border p-8 transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        ${isPopular
          ? 'border-orange-500/60 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-lg shadow-orange-500/10'
          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
        }
      `}
    >
      {/* Popular badge */}
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-orange-500/30">
          Most Popular
        </span>
      )}

      {/* Plan type */}
      <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">
        {type}
      </p>

      {/* Price */}
      <div className="flex items-end gap-1 mb-6">
        <span className="text-4xl font-extrabold tracking-tight text-white">
          ${Number(price).toFixed(2)}
        </span>
        <span className="mb-1 text-sm text-zinc-500">/ plan</span>
      </div>

      {/* Divider */}
      <hr className="border-zinc-800 mb-6" />

      {/* Perks placeholder */}
      <ul className="flex-1 flex flex-col gap-3 mb-8 text-sm text-zinc-400">
        <li className="flex items-center gap-2">
          <span className="text-orange-500">✓</span> Full gym access
        </li>
        <li className="flex items-center gap-2">
          <span className="text-orange-500">✓</span> Group classes included
        </li>
        <li className="flex items-center gap-2">
          <span className="text-orange-500">✓</span> Locker room access
        </li>
      </ul>

      {/* CTA */}
      <button
        className={`
          w-full rounded-xl py-3 text-sm font-bold tracking-wide transition-all duration-200
          ${isPopular
            ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-md shadow-orange-500/25'
            : 'border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:text-white active:scale-95'
          }
        `}
      >
        Buy now
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const Membership = () => {
  const { get, isLoading } = useFetch()
  const [plans, setPlans] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    get(
      'membershipplan',
      false,
      (data) => setPlans(data ?? []),
      (err) => setError(err?.message ?? 'Failed to load membership plans.')
    )
  }, [])

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">

        {/* Page header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-500">
            Pricing
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Choose your plan
          </h1>
          <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto">
            No hidden fees. Flexible options for every commitment level. Cancel anytime.
          </p>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-14 text-center">
            <p className="text-base font-semibold text-red-400">{error}</p>
            <p className="text-sm text-zinc-500">Please try again later.</p>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Plans grid */}
        {!isLoading && !error && plans.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.membershipPlanId}
                type={plan.type}
                price={plan.price}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 py-16 text-center">
            <p className="text-base font-semibold text-zinc-400">No plans available right now.</p>
            <p className="text-sm text-zinc-600">Check back soon — new plans are coming.</p>
          </div>
        )}

      </section>
    </Layout>
  )
}

export default Membership
