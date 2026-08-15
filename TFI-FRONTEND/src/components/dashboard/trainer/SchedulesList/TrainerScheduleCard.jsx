import { FaClock, FaRedo, FaUsers } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import EditableNameAndDescription from '../EditableNameAndDescription'
import { DAY_NAMES } from '../../../../utils/formatters'

const TrainerScheduleCard = ({ scheduleData, trainerId, onUpdated }) => {
  const { put } = useFetch()

  const handleSave = (newName, newDescription, done) => {
    put(
      `GymClassSchedule/${scheduleData.gymClassScheduleId}?updateUpcomingClasses=true`,
      true,
      {
        className: newName,
        classDescription: newDescription,
        maxCapacity: scheduleData.maxCapacity,
        dayOfWeek: scheduleData.dayOfWeek,
        timeOfDay: scheduleData.timeOfDay,
        isWeekly: scheduleData.isWeekly,
        trainerId,
      },
      () => {
        onUpdated(scheduleData.gymClassScheduleId, { className: newName, classDescription: newDescription })
        done(true)
      },
      (err) => done(false, err?.message)
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <EditableNameAndDescription
        name={scheduleData.className}
        description={scheduleData.classDescription}
        onSave={handleSave}
        nameClassName="text-lg font-bold text-white"
        idPrefix={`schedule-${scheduleData.gymClassScheduleId}`}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
        <span className="flex items-center gap-2">
          <FaClock className="text-orange-500/70" />
          {DAY_NAMES[scheduleData.dayOfWeek]}, {scheduleData.timeOfDay?.slice(0, 5)}
        </span>
        {scheduleData.isWeekly && (
          <span className="flex items-center gap-2">
            <FaRedo className="text-orange-500/70" />
            Semanal
          </span>
        )}
        <span className="flex items-center gap-2">
          <FaUsers className="text-orange-500/70" />
          Capacidad máxima: {scheduleData.maxCapacity}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
          scheduleData.isActive
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-zinc-700 text-zinc-500'
        }`}>
          {scheduleData.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  )
}

export default TrainerScheduleCard
