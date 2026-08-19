/**
 * The API is English-only: every message the backend produces — the ProblemDetails `detail` from
 * our own thrown exceptions, the generic `title`/safe message from GlobalExceptionHandler, and the
 * plain-string bodies a few AuthController actions return — is written in English and stays that
 * way on the wire. The UI is Spanish, so the translation happens here, at the single point where
 * useFetch turns a failed response into an Error.
 *
 * Keep this in sync with the backend: the exact strings below are copied verbatim from the
 * `throw new *Exception("…")` sites in TFI-Backend/src/Application/Services, the
 * BadRequest/Unauthorized literals in TFI-Backend/src/GymManagement/Controllers, and the
 * title/safeMessage pairs in Middlewares/GlobalExceptionHandler.cs.
 */

/** Shown when the backend sends something this file doesn't know about. */
export const GENERIC_ERROR = 'Algo salió mal. Intentá de nuevo.'

/** fetch() itself rejected — the request never reached the API. */
export const NETWORK_ERROR = 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.'

const EXACT = {
  // ── Application/Services — domain exceptions ────────────────────────────────
  'Class not found.': 'No se encontró la clase.',
  'Client not found.': 'No se encontró el cliente.',
  'Could not retrieve user details.': 'No se pudieron obtener los datos del usuario.',
  'Incorrect credentials.': 'Credenciales incorrectas.',
  'Membership does not have an associated plan.': 'La membresía no tiene un plan asociado.',
  'Membership not found': 'No se encontró la membresía.',
  'Membership plan not found.': 'No se encontró el plan de membresía.',
  'This membership plan is no longer available.': 'Este plan de membresía ya no está disponible.',
  'This membership plan is already discontinued.': 'Este plan de membresía ya está discontinuado.',
  'This membership plan is not discontinued.': 'Este plan de membresía no está discontinuado.',
  'Schedule not found.': 'No se encontró el horario.',
  'The class is full.': 'La clase está completa.',
  'The client is already enrolled.': 'El cliente ya está inscripto.',
  'This client doesn\'t have an active membership.': 'Este cliente no tiene una membresía activa.',
  'This client isn\'t enrolled in this class.': 'Este cliente no está inscripto en esta clase.',
  'This membership is already cancelled.': 'Esta membresía ya está cancelada.',
  'This trainer has been deactivated.': 'Este entrenador fue dado de baja.',
  // MembershipService.EnsureNoConflictingMembershipAsync, admin wording (selfService: false)
  'This user already has a membership awaiting activation. Activate or cancel it before creating a new one.':
    'Este usuario ya tiene una membresía pendiente de activación. Activala o cancelala antes de crear una nueva.',
  'This user already has an active membership. Change the plan on the existing membership, or cancel it before creating a new one.':
    'Este usuario ya tiene una membresía activa. Cambiá el plan de la membresía existente, o cancelala antes de crear una nueva.',
  'Trainer not found, or the user doesn\'t have the Trainer role.':
    'No se encontró el entrenador, o el usuario no tiene el rol de Entrenador.',
  'User has no assigned role.': 'El usuario no tiene un rol asignado.',
  'User not authenticated.': 'Usuario no autenticado.',
  // Same check, client wording (selfService: true) — what the checkout page shows on a 409
  'You already have a membership awaiting activation. Cancel it from your account before subscribing to a new plan.':
    'Ya tenés una membresía pendiente de activación. Cancelala desde tu cuenta antes de suscribirte a un nuevo plan.',
  'You already have an active membership. Cancel it from your account before subscribing to a new plan.':
    'Ya tenés una membresía activa. Cancelala desde tu cuenta antes de suscribirte a un nuevo plan.',

  // ── Attendance ──────────────────────────────────────────────────────────────
  'The attendance list contains an unrecognised status value.':
    'La lista de asistencia contiene un estado no reconocido.',
  'The attendance list contains clients who aren\'t enrolled in this class.':
    'La lista de asistencia contiene clientes que no están inscriptos en esta clase.',
  'The same client appears more than once in the attendance list.':
    'El mismo cliente aparece más de una vez en la lista de asistencia.',
  'This class hasn\'t started yet, so attendance can\'t be recorded.':
    'La clase todavía no comenzó, así que no se puede registrar la asistencia.',

  // ── Ownership / permission checks ───────────────────────────────────────────
  'You can\'t enroll another client.': 'No podés inscribir a otro cliente.',
  'You can\'t enroll clients in a class that isn\'t yours.':
    'No podés inscribir clientes en una clase que no es tuya.',
  'You can\'t modify a class that hasn\'t been assigned to you.':
    'No podés modificar una clase que no te fue asignada.',
  'You can\'t modify a schedule that isn\'t yours.': 'No podés modificar un horario que no es tuyo.',
  'You can\'t reassign a class to another trainer.': 'No podés reasignar una clase a otro entrenador.',
  'You can\'t reassign a schedule to another trainer.': 'No podés reasignar un horario a otro entrenador.',
  'You can\'t record attendance for a class that isn\'t yours.':
    'No podés registrar la asistencia de una clase que no es tuya.',
  'You can\'t remove another client\'s enrollment.':
    'No podés dar de baja la inscripción de otro cliente.',
  'You can\'t remove enrollments from a class that isn\'t yours.':
    'No podés dar de baja inscripciones de una clase que no es tuya.',
  'You can\'t view a class that isn\'t yours.': 'No podés ver una clase que no es tuya.',
  'You can\'t view another trainer\'s classes.': 'No podés ver las clases de otro entrenador.',
  'You can\'t view the clients of a class that isn\'t yours.':
    'No podés ver los clientes de una clase que no es tuya.',
  'You don\'t have permission to cancel this membership.':
    'No tenés permiso para cancelar esta membresía.',

  // ── Payments / Mercado Pago ─────────────────────────────────────────────────
  'Mercado Pago couldn\'t cancel the subscription.': 'Mercado Pago no pudo cancelar la suscripción.',
  'Mercado Pago couldn\'t cancel the previous subscription. Please try again.':
    'Mercado Pago no pudo cancelar la suscripción anterior. Intentá de nuevo.',
  'The \'payment_method_id\' field is required.': 'El campo \'payment_method_id\' es obligatorio.',
  'The card \'token\' field is required.': 'El campo \'token\' de la tarjeta es obligatorio.',
  'We couldn\'t set up your subscription with the payment provider. Please check your card details and try again.':
    'No pudimos crear tu suscripción con el proveedor de pagos. Revisá los datos de tu tarjeta e intentá de nuevo.',
  'We couldn\'t set up your subscription. Please try again or contact support.':
    'No pudimos crear tu suscripción. Intentá de nuevo o contactá con soporte.',
  'Invalid webhook signature.': 'Firma de webhook inválida.',

  // ── AuthController — plain-string / { message } bodies ──────────────────────
  'This email is already registered.': 'Este correo ya está registrado.',
  'Invalid credentials.': 'Credenciales inválidas.',
  'The reset token is invalid or has expired.': 'El token de restablecimiento es inválido o venció.',
  'The confirmation link is incorrect or more than 48 hours have passed. If your token expired, the account was deleted and you\'ll need to register again.':
    'El enlace de confirmación es incorrecto o pasaron más de 48 horas. Si tu token venció, la cuenta fue eliminada y vas a tener que registrarte de nuevo.',
  'The 48-hour window to confirm your email has expired and your account was deleted. Please register again.':
    'El plazo de 48 horas para confirmar tu correo venció y tu cuenta fue eliminada. Registrate nuevamente.',
  'You must confirm your email before logging in. Please check your inbox.':
    'Tenés que confirmar tu correo antes de iniciar sesión. Revisá tu bandeja de entrada.',

  // ── GlobalExceptionHandler — safe messages used when detail is withheld ─────
  'Access denied.': 'Acceso denegado.',
  'You don\'t have permission to perform this action.': 'No tenés permiso para realizar esta acción.',
  'This action couldn\'t be completed.': 'No se pudo completar esta acción.',
  'The requested resource was not found.': 'No se encontró el recurso solicitado.',
  'There was a validation error in the request.': 'Hubo un error de validación en la solicitud.',
  'The payment provider is unavailable. Please try again later.':
    'El proveedor de pagos no está disponible. Intentá de nuevo más tarde.',
  'Something went wrong. Please try again later.': 'Algo salió mal. Intentá de nuevo más tarde.',

  // ── GlobalExceptionHandler titles — the fallback when there is no detail ────
  'Unauthorized': 'No autorizado',
  'Forbidden': 'Acceso denegado',
  'Conflict': 'Conflicto',
  'Not found': 'No encontrado',
  'Validation error': 'Error de validación',
  'Bad gateway': 'Error del proveedor de pagos',
  'Internal server error': 'Error interno del servidor',

  // ASP.NET model-binding failures never reach our handler and carry no detail,
  // so this title is what the user would otherwise see.
  'One or more validation errors occurred.': 'Se produjeron uno o más errores de validación.',
}

/**
 * Messages the backend builds with string interpolation, so the id in the middle is never the same
 * twice and an exact lookup can't work. Order matters: "Membership plan {id} not found." has to be
 * tried before the looser "Membership {id} not found.".
 */
const PATTERNS = [
  [/^Membership plan .+ not found\.?$/i, () => 'No se encontró el plan de membresía.'],
  [/^Plan .+ not found\.?$/i, () => 'No se encontró el plan de membresía.'],
  [/^Membership .+ not found\.?$/i, () => 'No se encontró la membresía.'],
  [/^Unknown role: (.+)$/i, (m) => `Rol desconocido: ${m[1]}`],
]

/**
 * Translate one English backend message into Spanish.
 *
 * Anything unrecognised falls back to GENERIC_ERROR rather than passing the English through —
 * a stray English sentence in an otherwise Spanish UI is worse for the user than a vague one.
 * The original is logged so it can be added to the map above.
 */
export const translateApiError = (message) => {
  const raw = (message ?? '').toString().trim()
  if (!raw) return GENERIC_ERROR

  if (EXACT[raw]) return EXACT[raw]

  for (const [pattern, build] of PATTERNS) {
    const match = raw.match(pattern)
    if (match) return build(match)
  }

  console.warn(`[i18n] Mensaje del backend sin traducción: "${raw}"`)
  return GENERIC_ERROR
}
