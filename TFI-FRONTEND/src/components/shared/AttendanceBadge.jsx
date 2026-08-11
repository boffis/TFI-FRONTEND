import { ATTENDANCE, ATTENDANCE_LABELS } from '../../utils/attendance'

const STYLES = {
  [ATTENDANCE.NOT_RECORDED]: 'border-zinc-700 text-zinc-500',
  [ATTENDANCE.PRESENT]: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  [ATTENDANCE.ABSENT]: 'border-red-500/30 bg-red-500/10 text-red-400',
}

const AttendanceBadge = ({ status }) => {
  const key = status ?? ATTENDANCE.NOT_RECORDED
  const label = ATTENDANCE_LABELS[key] ?? ATTENDANCE_LABELS[ATTENDANCE.NOT_RECORDED]
  const className = STYLES[key] ?? STYLES[ATTENDANCE.NOT_RECORDED]

  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
      {label}
    </span>
  )
}

export default AttendanceBadge
