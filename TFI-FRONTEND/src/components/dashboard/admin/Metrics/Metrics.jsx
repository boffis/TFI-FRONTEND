import { useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { DataTable, Section, StatCard } from './MetricsPrimitives'
import { formatMoney, formatPercent } from '../../../../utils/formatters'

const Metrics = () => {
  const { get, isLoading } = useFetch()

  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    get(
      'Metrics',
      true,
      (data) => setMetrics(data),
      (err) => setError(err?.message ?? 'Failed to load metrics.')
    )
  }, [])

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 py-16 text-center">
        <p className="text-lg font-semibold text-red-400">{error}</p>
      </div>
    )
  }

  if (isLoading || !metrics) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-800/60" />
        ))}
      </div>
    )
  }

  const { revenue, members, plans, classes, attendance, trainers, recentWindowDays, revenueStates } = metrics
  const windowLabel = `last ${recentWindowDays} days`

  return (
    <div>
      <Section
        title="Revenue"
        subtitle={`Counting payments in state: ${revenueStates.join(', ')}`}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total revenue" value={formatMoney(revenue.total)} tone="accent" />
          <StatCard label="This month" value={formatMoney(revenue.thisMonth)} />
          <StatCard label="Paid payments" value={revenue.paidPaymentCount} />
          <StatCard
            label="Avg per payment"
            value={formatMoney(
              revenue.paidPaymentCount ? revenue.total / revenue.paidPaymentCount : 0
            )}
          />
        </div>

        <div className="mb-4">
          <DataTable
            columns={[
              { key: 'label', label: 'Month', render: (r) => <span className="text-white">{r.label}</span> },
              { key: 'count', label: 'Payments', align: 'right', render: (r) => r.paymentCount },
              {
                key: 'amount',
                label: 'Revenue',
                align: 'right',
                render: (r) => <span className="font-semibold text-white">{formatMoney(r.amount)}</span>,
              },
            ]}
            rows={revenue.byMonth}
            rowKey={(r) => `${r.year}-${r.month}`}
          />
        </div>

        <DataTable
          columns={[
            {
              key: 'state',
              label: 'Payment state',
              render: (r) => (
                <span className={r.countsAsRevenue ? 'font-semibold text-emerald-400' : 'text-zinc-400'}>
                  {r.state || '(empty)'}
                  {r.countsAsRevenue && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">
                      counted
                    </span>
                  )}
                </span>
              ),
            },
            { key: 'count', label: 'Payments', align: 'right', render: (r) => r.count },
            { key: 'amount', label: 'Value', align: 'right', render: (r) => formatMoney(r.amount) },
          ]}
          rows={revenue.byState}
          rowKey={(r) => r.state || 'empty'}
          emptyMessage="No payments recorded yet."
        />
      </Section>

      <Section title="Members">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total clients" value={members.totalClients} />
          <StatCard label="Active membership" value={members.withActiveMembership} tone="positive" />
          <StatCard label="Expired" value={members.expired} tone="warning" />
          <StatCard label="Cancelled" value={members.cancelled} />
        </div>
      </Section>

      <Section title="Plans">
        <DataTable
          columns={[
            { key: 'type', label: 'Plan', render: (r) => <span className="font-semibold text-white">{r.type}</span> },
            { key: 'price', label: 'Price', align: 'right', render: (r) => formatMoney(r.price) },
            { key: 'duration', label: 'Days', align: 'right', render: (r) => r.durationInDays },
            { key: 'active', label: 'Active', align: 'right', render: (r) => r.activeMemberships },
            { key: 'total', label: 'Total sold', align: 'right', render: (r) => r.totalMemberships },
            {
              key: 'revenue',
              label: 'Revenue',
              align: 'right',
              render: (r) => <span className="font-semibold text-white">{formatMoney(r.revenue)}</span>,
            },
          ]}
          rows={plans}
          rowKey={(r) => r.membershipPlanId}
          emptyMessage="No membership plans yet."
        />
      </Section>

      <Section title="Classes" subtitle={`Occupancy and popularity over the ${windowLabel}`}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Upcoming classes" value={classes.upcoming} />
          <StatCard label={`Held (${windowLabel})`} value={classes.heldInWindow} />
          <StatCard
            label="Occupancy"
            value={formatPercent(classes.occupancyRate)}
            hint={`${classes.inscriptionsInWindow} of ${classes.capacityInWindow} spots`}
            tone="accent"
          />
          <StatCard label="Enrolments" value={classes.inscriptionsInWindow} />
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Class', render: (r) => <span className="font-semibold text-white">{r.className}</span> },
            { key: 'sessions', label: 'Sessions', align: 'right', render: (r) => r.sessions },
            { key: 'inscriptions', label: 'Enrolments', align: 'right', render: (r) => r.inscriptions },
            { key: 'occupancy', label: 'Occupancy', align: 'right', render: (r) => formatPercent(r.occupancyRate) },
          ]}
          rows={classes.mostPopular}
          rowKey={(r) => r.className}
          emptyMessage={`No classes held in the ${windowLabel}.`}
        />
      </Section>

      <Section title="Attendance" subtitle={`Enrolments in classes held over the ${windowLabel}`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Present" value={attendance.present} tone="positive" />
          <StatCard label="Absent" value={attendance.absent} tone="warning" />
          <StatCard label="Not recorded" value={attendance.notRecorded} />
          <StatCard
            label="Attendance rate"
            value={formatPercent(attendance.attendanceRate)}
            hint="of marked enrolments"
            tone="accent"
          />
          <StatCard
            label="Recorded"
            value={formatPercent(attendance.recordedRate)}
            hint="of all enrolments"
          />
        </div>
      </Section>

      <Section title="Trainers" subtitle={`Activity over the ${windowLabel}`}>
        <DataTable
          columns={[
            { key: 'name', label: 'Trainer', render: (r) => <span className="font-semibold text-white">{r.name}</span> },
            { key: 'held', label: 'Classes held', align: 'right', render: (r) => r.classesInWindow },
            { key: 'upcoming', label: 'Upcoming', align: 'right', render: (r) => r.upcomingClasses },
            { key: 'enrolments', label: 'Enrolments', align: 'right', render: (r) => r.inscriptionsInWindow },
          ]}
          rows={trainers}
          rowKey={(r) => r.trainerId}
          emptyMessage="No trainers yet."
        />
      </Section>
    </div>
  )
}

export default Metrics
