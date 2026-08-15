// Mirrors GymManagement.Domain.Enums.AttendanceStatus. The API serialises enums as ints
// (same as DayOfWeek elsewhere in this app), so these numbers are the wire format —
// keep them in step with the C# enum.
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
