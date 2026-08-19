export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.toString().charAt(0).toUpperCase() + str.toString().slice(1).toLowerCase();
};

/** Mirrors the C# DayOfWeek enum. The API sends the raw int, so this order is the wire format. */
export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** Weekdays for a <select>: the value is the enum int the API expects. */
export const DAY_OPTIONS = DAY_NAMES.map((label, index) => ({ value: String(index), label }));

/**
 * Role and gender travel as the English literals below — wire values, never translated in a
 * request body. These maps only render them, falling back to the raw value if it's unexpected.
 */
export const ROLE_LABELS = {
  Client: 'Cliente',
  Trainer: 'Entrenador',
  Admin: 'Administrador',
};

export const roleLabel = (role) => ROLE_LABELS[role] ?? role ?? '—';

export const GENDER_LABELS = {
  Male: 'Masculino',
  Female: 'Femenino',
  Other: 'Otro',
  'Prefer not to say': 'Prefiero no decirlo',
};

export const genderLabel = (gender) => GENDER_LABELS[gender] ?? gender ?? '—';

/** Gender for a <select>: English on the wire, Spanish on screen. */
export const GENDER_OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => ({ value, label }));

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatMoney = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatPercent = (value) => `${(value ?? 0).toFixed(1)}%`;

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};
