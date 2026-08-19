export const validateClassName = (value) => {
  if (!value.trim()) return 'El nombre de la clase es obligatorio.'
  if (value.trim().length < 3) return 'El nombre de la clase debe tener al menos 3 caracteres.'
  return ''
}

export const validateClassDescription = (value) => {
  // Optional, but capped for sanity.
  if (value && value.length > 500) return 'La descripción no puede superar los 500 caracteres.'
  return ''
}

export const validateMaxCapacity = (value) => {
  if (value === '' || value === null || value === undefined) return 'La capacidad máxima es obligatoria.'
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) return 'La capacidad máxima debe ser un número entero mayor o igual a 1.'
  return ''
}

export const validateTrainerId = (value) => {
  if (!value) return 'Seleccioná un entrenador.'
  return ''
}

export const validateScheduleDateTime = (value) => {
  if (!value) return 'La fecha y hora son obligatorias.'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Ingresá una fecha y hora válidas.'
  if (d <= new Date()) return 'La fecha y hora deben ser futuras.'
  return ''
}

export const validateDayOfWeek = (value) => {
  const n = Number(value)
  if (Number.isNaN(n) || n < 0 || n > 6) return 'Seleccioná un día válido.'
  return ''
}

export const validateTimeOfDay = (value) => {
  if (!value) return 'El horario es obligatorio.'
  if (!/^\d{2}:\d{2}$/.test(value)) return 'Ingresá un horario válido.'
  return ''
}
