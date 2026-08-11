// Must match GymTime.TimeZoneId on the API (Application/Common/GymTime.cs).
export const GYM_TIME_ZONE = 'America/Argentina/Buenos_Aires'

/**
 * "Now" as wall-clock time at the gym, returned as a Date whose fields read as gym-local.
 *
 * Class schedules are stored without a time zone and mean gym-local time, so comparing them
 * against the *viewer's* clock is only correct when the viewer happens to be in Argentina.
 * This mirrors GymTime on the backend, so the UI enables an action exactly when the API
 * would accept it — no enabled button that answers 409, and no disabled button that would
 * have worked.
 */
export const gymNow = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: GYM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // h23 rather than hour12:false — the latter renders midnight as "24" in some engines.
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const part = (type) => parts.find((p) => p.type === type)?.value ?? '00'

  return new Date(
    `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}`
  )
}
