// Mirrors the C# AttendanceStatus enum: the API sends ints, so these numbers are the wire format.
export const ATTENDANCE = {
  NOT_RECORDED: 0,
  PRESENT: 1,
  ABSENT: 2,
}

export const ATTENDANCE_LABELS = {
  [ATTENDANCE.NOT_RECORDED]: 'Sin registrar',
  [ATTENDANCE.PRESENT]: 'Presente',
  [ATTENDANCE.ABSENT]: 'Ausente',
}
