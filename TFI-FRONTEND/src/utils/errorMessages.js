/**
 * The API is English-only and the UI is Spanish, so the translation happens here, where useFetch
 * turns a failed response into an Error. The keys below are copied verbatim from the backend's
 * thrown exceptions, controller literals and GlobalExceptionHandler — keep them in sync.
 *
 * Many failures carry no message to look up (empty bodies, model-binding rejections, bare 401s),
 * so translation falls back to the field-level detail and then to the HTTP status.
 */

/** Fallback for anything this file doesn't know. */
export const GENERIC_ERROR = 'Algo salió mal. Intentá de nuevo.'

/** fetch() rejected — the request never reached the API. */
export const NETWORK_ERROR = 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.'

/** fetch() rejected while the browser reports no connectivity. */
export const OFFLINE_ERROR = 'Parece que no tenés conexión a internet. Revisá tu red e intentá de nuevo.'

/** The request was aborted — navigation away, or a cancelled call. */
export const ABORTED_ERROR = 'La solicitud se canceló antes de completarse.'

/** The response arrived but its body wasn't the JSON we expected. */
export const PARSE_ERROR = 'El servidor respondió en un formato inesperado. Intentá de nuevo.'

const EXACT = {
  // Application/Services — domain exceptions
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
  // EnsureNoConflictingMembershipAsync, admin wording.
  'This user already has a membership awaiting activation. Activate or cancel it before creating a new one.':
    'Este usuario ya tiene una membresía pendiente de activación. Activala o cancelala antes de crear una nueva.',
  'This user already has an active membership. Change the plan on the existing membership, or cancel it before creating a new one.':
    'Este usuario ya tiene una membresía activa. Cambiá el plan de la membresía existente, o cancelala antes de crear una nueva.',
  'Trainer not found, or the user doesn\'t have the Trainer role.':
    'No se encontró el entrenador, o el usuario no tiene el rol de Entrenador.',
  'User has no assigned role.': 'El usuario no tiene un rol asignado.',
  'User not authenticated.': 'Usuario no autenticado.',
  // Same check, client wording — what checkout shows on a 409.
  'You already have a membership awaiting activation. Cancel it from your account before subscribing to a new plan.':
    'Ya tenés una membresía pendiente de activación. Cancelala desde tu cuenta antes de suscribirte a un nuevo plan.',
  'You already have an active membership. Cancel it from your account before subscribing to a new plan.':
    'Ya tenés una membresía activa. Cancelala desde tu cuenta antes de suscribirte a un nuevo plan.',

  // Attendance
  'The attendance list contains an unrecognised status value.':
    'La lista de asistencia contiene un estado no reconocido.',
  'The attendance list contains clients who aren\'t enrolled in this class.':
    'La lista de asistencia contiene clientes que no están inscriptos en esta clase.',
  'The same client appears more than once in the attendance list.':
    'El mismo cliente aparece más de una vez en la lista de asistencia.',
  'This class hasn\'t started yet, so attendance can\'t be recorded.':
    'La clase todavía no comenzó, así que no se puede registrar la asistencia.',

  // Ownership / permission checks
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

  // Payments / Mercado Pago
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

  // AuthController — plain-string / { message } bodies
  'This email is already registered.': 'Este correo ya está registrado.',
  'Invalid credentials.': 'Credenciales inválidas.',
  'The reset token is invalid or has expired.': 'El token de restablecimiento es inválido o venció.',
  'The confirmation link is incorrect or more than 48 hours have passed. If your token expired, the account was deleted and you\'ll need to register again.':
    'El enlace de confirmación es incorrecto o pasaron más de 48 horas. Si tu token venció, la cuenta fue eliminada y vas a tener que registrarte de nuevo.',
  'The 48-hour window to confirm your email has expired and your account was deleted. Please register again.':
    'El plazo de 48 horas para confirmar tu correo venció y tu cuenta fue eliminada. Registrate nuevamente.',
  'You must confirm your email before logging in. Please check your inbox.':
    'Tenés que confirmar tu correo antes de iniciar sesión. Revisá tu bandeja de entrada.',

  // GlobalExceptionHandler — safe messages used when detail is withheld
  'Access denied.': 'Acceso denegado.',
  'You don\'t have permission to perform this action.': 'No tenés permiso para realizar esta acción.',
  'This action couldn\'t be completed.': 'No se pudo completar esta acción.',
  'The requested resource was not found.': 'No se encontró el recurso solicitado.',
  'There was a validation error in the request.': 'Hubo un error de validación en la solicitud.',
  'The payment provider is unavailable. Please try again later.':
    'El proveedor de pagos no está disponible. Intentá de nuevo más tarde.',
  'Something went wrong. Please try again later.': 'Algo salió mal. Intentá de nuevo más tarde.',

  // GlobalExceptionHandler titles — the fallback when there is no detail
  'Unauthorized': 'No autorizado',
  'Forbidden': 'Acceso denegado',
  'Conflict': 'Conflicto',
  'Not found': 'No encontrado',
  'Validation error': 'Error de validación',
  'Bad gateway': 'Error del proveedor de pagos',
  'Internal server error': 'Error interno del servidor',

  // Model-binding failures skip our handler and carry no detail, so this title is all there is.
  'One or more validation errors occurred.': 'Se produjeron uno o más errores de validación.',
}

/**
 * Interpolated messages, where an exact lookup can't work. Order matters: "Membership plan {id}
 * not found." must be tried before the looser "Membership {id} not found.".
 */
const PATTERNS = [
  [/^Membership plan .+ not found\.?$/i, () => 'No se encontró el plan de membresía.'],
  [/^Plan .+ not found\.?$/i, () => 'No se encontró el plan de membresía.'],
  [/^Membership .+ not found\.?$/i, () => 'No se encontró la membresía.'],
  [/^Unknown role: (.+)$/i, (m) => `Rol desconocido: ${m[1]}`],
]

/** Fallback per status, for the empty bodies of `NotFound()`, `Forbid()` and the JWT middleware. */
const STATUS_MESSAGES = {
  400: 'La solicitud tiene datos inválidos. Revisá los campos e intentá de nuevo.',
  401: 'Tu sesión venció o no es válida. Iniciá sesión de nuevo.',
  403: 'No tenés permiso para realizar esta acción.',
  404: 'No se encontró lo que buscabas. Puede que haya sido eliminado.',
  405: 'Esta operación no está permitida sobre este recurso.',
  408: 'El servidor tardó demasiado en responder. Intentá de nuevo.',
  409: 'La operación choca con el estado actual de los datos. Actualizá la página e intentá de nuevo.',
  413: 'Los datos que enviaste son demasiado grandes.',
  415: 'El servidor no aceptó el formato de los datos enviados.',
  422: 'Los datos enviados no se pudieron procesar. Revisá los campos e intentá de nuevo.',
  429: 'Hiciste demasiadas solicitudes seguidas. Esperá unos segundos e intentá de nuevo.',
  500: 'El servidor tuvo un error interno. Si vuelve a pasar, contactá con soporte.',
  501: 'Esta operación todavía no está implementada en el servidor.',
  502: 'El servidor no pudo comunicarse con un servicio externo. Intentá de nuevo en unos minutos.',
  503: 'El servidor no está disponible en este momento. Intentá de nuevo en unos minutos.',
  504: 'El servidor tardó demasiado en responder. Intentá de nuevo en unos minutos.',
}

/**
 * GlobalExceptionHandler's safe messages and titles, sent when it withholds the real detail.
 * Too vague to relay, so they defer to STATUS_MESSAGES.
 */
const VAGUE_BACKEND_MESSAGES = new Set([
  'Access denied.',
  'You don\'t have permission to perform this action.',
  'This action couldn\'t be completed.',
  'The requested resource was not found.',
  'There was a validation error in the request.',
  'Something went wrong. Please try again later.',
  'Unauthorized',
  'Forbidden',
  'Conflict',
  'Not found',
  'Validation error',
  'Bad gateway',
  'Internal server error',
  'One or more validation errors occurred.',
])

/** The 401s that mean the token is bad, not that an action was refused. */
const SESSION_REJECTED_MESSAGES = new Set([
  'User not authenticated.',
  'User has no assigned role.',
  'Could not retrieve user details.',
])

/**
 * Whether to sign the user out. Not every 401 qualifies: the API also throws
 * UnauthorizedException for permission checks (cancelling another user's membership), where the
 * session is fine. Allowlist rather than denylist, so unknown 401s keep the user logged in.
 */
export const isSessionRejected = (status, rawMessage) => {
  if (status !== 401) return false

  const raw = (rawMessage ?? '').toString().trim()

  // The JWT middleware challenges with a bare status and no body.
  if (!raw) return true

  return SESSION_REJECTED_MESSAGES.has(raw)
}

/**
 * @param {number} status
 * @param {{ isPrivate?: boolean }} [context] - Separates a stale token from a rejected sign-in,
 *   the two meanings of a 401 here.
 */
export const describeStatus = (status, { isPrivate = true } = {}) => {
  if (!status) return GENERIC_ERROR
  if (status === 401 && !isPrivate) return 'Credenciales incorrectas. Revisá tu correo y contraseña.'
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]
  if (status >= 500) return 'El servidor no pudo procesar la solicitud. Intentá de nuevo más tarde.'
  if (status >= 400) return 'El servidor rechazó la solicitud. Revisá los datos e intentá de nuevo.'
  return GENERIC_ERROR
}

/** Request properties as ProblemDetails `errors` names them, lower-cased, to form labels. */
const FIELD_LABELS = {
  classdescription: 'Descripción de la clase',
  classname: 'Nombre de la clase',
  clientid: 'Cliente',
  dateofbirth: 'Fecha de nacimiento',
  dayofweek: 'Día de la semana',
  dni: 'DNI',
  durationindays: 'Duración en días',
  email: 'Correo electrónico',
  entries: 'Lista de asistencia',
  gender: 'Género',
  identification: 'Documento del pagador',
  issuerid: 'Emisor de la tarjeta',
  maxcapacity: 'Capacidad máxima',
  membershipid: 'Membresía',
  membershipplanid: 'Plan de membresía',
  name: 'Nombre',
  newpassword: 'Nueva contraseña',
  number: 'Número de documento',
  password: 'Contraseña',
  payer: 'Datos del pagador',
  paymentmethodid: 'Medio de pago',
  phonenumber: 'Teléfono',
  price: 'Precio',
  schedule: 'Fecha y hora',
  specialization: 'Especialización',
  status: 'Estado',
  timeofday: 'Hora',
  token: 'Token',
  trainerid: 'Entrenador',
  type: 'Tipo',
  userid: 'Usuario',
}

/** Keys come as "ClassName" or as a JSON path "$.payer.identification.number" — the leaf names it. */
const labelForField = (key) => {
  const leaf = (key ?? '')
    .replace(/\[\d+\]/g, '')
    .split('.')
    .filter(Boolean)
    .pop()

  if (!leaf || leaf === '$') return null
  return FIELD_LABELS[leaf.toLowerCase()] ?? leaf
}

/** ASP.NET's validation wording, reduced to a short Spanish clause. */
const FIELD_ISSUES = [
  [/field is required|is required\.?$/i, () => 'es obligatorio'],
  [/could not be converted|invalid (?:start of a )?value|is not a valid/i, () => 'tiene un formato inválido'],
  [/minimum length of '(\d+)'/i, (m) => `debe tener al menos ${m[1]} caracteres`],
  [/maximum length of '(\d+)'/i, (m) => `no puede superar los ${m[1]} caracteres`],
  [/must be between (\S+) and (\S+)/i, (m) => `debe estar entre ${m[1]} y ${m[2]}`],
  [/not valid|invalid/i, () => 'no es válido'],
]

const describeFieldIssue = (message) => {
  const raw = (message ?? '').toString().trim()

  for (const [pattern, build] of FIELD_ISSUES) {
    const match = raw.match(pattern)
    if (match) return build(match)
  }

  return 'no es válido'
}

/**
 * A ProblemDetails `errors` dictionary as a sentence: "Revisá estos campos: Nombre de la clase
 * (es obligatorio)." Null when there is nothing usable, so callers can fall through.
 * @param {Record<string, string[]>} [errors]
 */
export const describeFieldErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return null

  const parts = []
  let bodyIsMalformed = false

  for (const [key, messages] of Object.entries(errors)) {
    const list = Array.isArray(messages) ? messages : [messages]
    const label = labelForField(key)

    // A `$`-rooted error with no field name means the body itself failed to parse.
    if (!label) {
      bodyIsMalformed = true
      continue
    }

    parts.push(`${label} (${describeFieldIssue(list[0])})`)
  }

  if (parts.length) {
    return `Revisá ${parts.length === 1 ? 'este campo' : 'estos campos'}: ${parts.join(', ')}.`
  }

  if (bodyIsMalformed) {
    return 'Los datos enviados tienen un formato inválido. Revisá el formulario e intentá de nuevo.'
  }

  return null
}

/**
 * Most specific message available, in order: field errors, exact map, patterns, HTTP status.
 * `isSpecific` says the message already names what went wrong, so `explainApiError` won't prefix
 * the caller's context. Unrecognised English is logged, not shown.
 *
 * @param {string} message - `detail`, `message` or `title` from the response body.
 * @param {{ status?: number, fieldErrors?: Record<string, string[]>, isPrivate?: boolean }} [context]
 * @returns {{ message: string, isSpecific: boolean }}
 */
export const translateApiErrorDetailed = (message, context = {}) => {
  const { status, fieldErrors, isPrivate } = context
  const raw = (message ?? '').toString().trim()

  // Field-level detail beats every generic phrasing, including the backend's validation title.
  const fieldDetail = describeFieldErrors(fieldErrors)
  if (fieldDetail) return { message: fieldDetail, isSpecific: true }

  if (raw) {
    // Translating these verbatim just relays the vagueness — the status says more than they do.
    if (VAGUE_BACKEND_MESSAGES.has(raw) && status) {
      return { message: describeStatus(status, { isPrivate }), isSpecific: false }
    }

    if (EXACT[raw]) return { message: EXACT[raw], isSpecific: !VAGUE_BACKEND_MESSAGES.has(raw) }

    for (const [pattern, build] of PATTERNS) {
      const match = raw.match(pattern)
      if (match) return { message: build(match), isSpecific: true }
    }

    console.warn(`[i18n] Mensaje del backend sin traducción: "${raw}"`)
  }

  return { message: describeStatus(status, { isPrivate }), isSpecific: false }
}

/** `translateApiErrorDetailed` when only the text is needed. */
export const translateApiError = (message, context = {}) =>
  translateApiErrorDetailed(message, context).message

/**
 * What components call from onError. A message that already explains itself stands alone; a status
 * or transport one gets the caller's context: "No se pudieron cargar las clases: el servidor…".
 *
 * @param {unknown} error - Whatever reached the onError callback.
 * @param {string} [whatFailed] - The action, without final punctuation, e.g. 'No se pudo guardar'.
 */
export const explainApiError = (error, whatFailed) => {
  const message = (error?.message ?? '').trim() || GENERIC_ERROR

  if (!whatFailed || error?.isSpecific) return message

  const lead = whatFailed.trim().replace(/[.:\s]+$/, '')
  if (!lead) return message

  // Lower-case the cause so it reads as one sentence, leaving acronyms like DNI alone.
  const cause = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(message)
    ? message.charAt(0).toLowerCase() + message.slice(1)
    : message

  return `${lead}: ${cause}`
}
