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
      (err) => setError(err?.message ?? 'No se pudieron cargar las métricas.')
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
  const windowLabel = `últimos ${recentWindowDays} días`

  return (
    <div>
      <Section
        title="Ingresos"
        subtitle={`Se cuentan los pagos en estado: ${revenueStates.join(', ')}`}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Ingresos totales" value={formatMoney(revenue.total)} tone="accent" />
          <StatCard label="Este mes" value={formatMoney(revenue.thisMonth)} />
          <StatCard label="Pagos cobrados" value={revenue.paidPaymentCount} />
          <StatCard
            label="Promedio por pago"
            value={formatMoney(
              revenue.paidPaymentCount ? revenue.total / revenue.paidPaymentCount : 0
            )}
          />
        </div>

        <div className="mb-4">
          <DataTable
            columns={[
              { key: 'label', label: 'Mes', render: (r) => <span className="text-white">{r.label}</span> },
              { key: 'count', label: 'Pagos', align: 'right', render: (r) => r.paymentCount },
              {
                key: 'amount',
                label: 'Ingresos',
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
              label: 'Estado del pago',
              render: (r) => (
                <span className={r.countsAsRevenue ? 'font-semibold text-emerald-400' : 'text-zinc-400'}>
                  {r.state || '(vacío)'}
                  {r.countsAsRevenue && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">
                      contabilizado
                    </span>
                  )}
                </span>
              ),
            },
            { key: 'count', label: 'Pagos', align: 'right', render: (r) => r.count },
            { key: 'amount', label: 'Importe', align: 'right', render: (r) => formatMoney(r.amount) },
          ]}
          rows={revenue.byState}
          rowKey={(r) => r.state || 'empty'}
          emptyMessage="Todavía no se registraron pagos."
        />
      </Section>

      <Section title="Miembros">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Clientes totales" value={members.totalClients} />
          <StatCard label="Con membresía activa" value={members.withActiveMembership} tone="positive" />
          <StatCard label="Vencidas" value={members.expired} tone="warning" />
          <StatCard label="Canceladas" value={members.cancelled} />
        </div>
      </Section>

      <Section title="Planes">
        <DataTable
          columns={[
            { key: 'type', label: 'Plan', render: (r) => <span className="font-semibold text-white">{r.type}</span> },
            { key: 'price', label: 'Precio', align: 'right', render: (r) => formatMoney(r.price) },
            { key: 'duration', label: 'Días', align: 'right', render: (r) => r.durationInDays },
            { key: 'active', label: 'Activas', align: 'right', render: (r) => r.activeMemberships },
            { key: 'total', label: 'Total vendidas', align: 'right', render: (r) => r.totalMemberships },
            {
              key: 'revenue',
              label: 'Ingresos',
              align: 'right',
              render: (r) => <span className="font-semibold text-white">{formatMoney(r.revenue)}</span>,
            },
          ]}
          rows={plans}
          rowKey={(r) => r.membershipPlanId}
          emptyMessage="Todavía no hay planes de membresía."
        />
      </Section>

      <Section title="Clases" subtitle={`Ocupación y popularidad en los ${windowLabel}`}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Próximas clases" value={classes.upcoming} />
          <StatCard label={`Dictadas (${windowLabel})`} value={classes.heldInWindow} />
          <StatCard
            label="Ocupación"
            value={formatPercent(classes.occupancyRate)}
            hint={`${classes.inscriptionsInWindow} de ${classes.capacityInWindow} lugares`}
            tone="accent"
          />
          <StatCard label="Inscripciones" value={classes.inscriptionsInWindow} />
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Clase', render: (r) => <span className="font-semibold text-white">{r.className}</span> },
            { key: 'sessions', label: 'Sesiones', align: 'right', render: (r) => r.sessions },
            { key: 'inscriptions', label: 'Inscripciones', align: 'right', render: (r) => r.inscriptions },
            { key: 'occupancy', label: 'Ocupación', align: 'right', render: (r) => formatPercent(r.occupancyRate) },
          ]}
          rows={classes.mostPopular}
          rowKey={(r) => r.className}
          emptyMessage={`No se dictaron clases en los ${windowLabel}.`}
        />
      </Section>

      <Section title="Asistencia" subtitle={`Inscripciones en clases dictadas en los ${windowLabel}`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Presentes" value={attendance.present} tone="positive" />
          <StatCard label="Ausentes" value={attendance.absent} tone="warning" />
          <StatCard label="Sin registrar" value={attendance.notRecorded} />
          <StatCard
            label="Tasa de asistencia"
            value={formatPercent(attendance.attendanceRate)}
            hint="sobre las inscripciones registradas"
            tone="accent"
          />
          <StatCard
            label="Registradas"
            value={formatPercent(attendance.recordedRate)}
            hint="sobre el total de inscripciones"
          />
        </div>
      </Section>

      <Section title="Entrenadores" subtitle={`Actividad en los ${windowLabel}`}>
        <DataTable
          columns={[
            { key: 'name', label: 'Entrenador', render: (r) => <span className="font-semibold text-white">{r.name}</span> },
            { key: 'held', label: 'Clases dictadas', align: 'right', render: (r) => r.classesInWindow },
            { key: 'upcoming', label: 'Próximas', align: 'right', render: (r) => r.upcomingClasses },
            { key: 'enrolments', label: 'Inscripciones', align: 'right', render: (r) => r.inscriptionsInWindow },
          ]}
          rows={trainers}
          rowKey={(r) => r.trainerId}
          emptyMessage="Todavía no hay entrenadores."
        />
      </Section>
    </div>
  )
}

export default Metrics
