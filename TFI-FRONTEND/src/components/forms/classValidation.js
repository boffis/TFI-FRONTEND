// ─── Class Name ───────────────────────────────────────────────────────────────
export const validateClassName = (value) => {
  if (!value.trim()) return 'Class name is required.'
  if (value.trim().length < 3) return 'Class name must be at least 3 characters.'
  return ''
}

// ─── Description (optional) ───────────────────────────────────────────────────
export const validateClassDescription = (value) => {
  // Optional — no required rule, but cap at 500 chars for sanity
  if (value && value.length > 500) return 'Description must be 500 characters or fewer.'
  return ''
}

// ─── Max Capacity ─────────────────────────────────────────────────────────────
export const validateMaxCapacity = (value) => {
  if (value === '' || value === null || value === undefined) return 'Max capacity is required.'
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) return 'Max capacity must be a whole number of at least 1.'
  return ''
}

// ─── Trainer ──────────────────────────────────────────────────────────────────
export const validateTrainerId = (value) => {
  if (!value) return 'Please select a trainer.'
  return ''
}

// ─── Schedule date-time (GymClass) ────────────────────────────────────────────
export const validateScheduleDateTime = (value) => {
  if (!value) return 'Schedule date and time are required.'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Enter a valid date and time.'
  if (d <= new Date()) return 'Schedule must be a future date and time.'
  return ''
}

// ─── Day of week (GymClassSchedule) ──────────────────────────────────────────
export const validateDayOfWeek = (value) => {
  const n = Number(value)
  if (Number.isNaN(n) || n < 0 || n > 6) return 'Please select a valid day.'
  return ''
}

// ─── Time of day (GymClassSchedule) ──────────────────────────────────────────
export const validateTimeOfDay = (value) => {
  if (!value) return 'Time of day is required.'
  // HTML time inputs return "HH:MM" — validate format
  if (!/^\d{2}:\d{2}$/.test(value)) return 'Enter a valid time.'
  return ''
}
