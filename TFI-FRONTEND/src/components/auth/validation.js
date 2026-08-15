const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{3,}$/
const DNI_REGEX = /^\d{7,8}$/
const PHONE_REGEX = /^\d{10,13}$/

export const validateEmail = (email) => {
  if (!email.trim()) return 'El correo electrónico es obligatorio.'
  if (!EMAIL_REGEX.test(email.trim())) return 'Ingresá una dirección de correo válida.'
  return ''
}

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'La contraseña debe incluir al menos una letra y un número.'
  }
  return ''
}

export const validateFullName = (fullName) => {
  if (!fullName.trim()) return 'El nombre completo es obligatorio.'
  if (!NAME_REGEX.test(fullName.trim())) return 'Ingresá un nombre válido (solo letras, mínimo 3 caracteres).'
  return ''
}

export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return 'La fecha de nacimiento es obligatoria.'

  const birthDate = new Date(dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) return 'Ingresá una fecha válida.'

  const today = new Date()
  if (birthDate >= today) return 'La fecha de nacimiento debe ser anterior a hoy.'

  const age = today.getFullYear() - birthDate.getFullYear()
  const hadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  const actualAge = hadBirthday ? age : age - 1
  if (actualAge < 16) return 'Tenés que tener al menos 16 años para registrarte.'

  return ''
}

export const validateDni = (dni) => {
  if (!dni.trim()) return 'El DNI es obligatorio.'
  if (!DNI_REGEX.test(dni.trim())) return 'El DNI debe tener 7 u 8 dígitos.'
  return ''
}

export const validateGender = (gender) => {
  if (!gender) return 'El género es obligatorio.'
  return ''
}

export const validatePhone = (phone) => {
  if (!phone.trim()) return 'El teléfono es obligatorio.'
  if (!PHONE_REGEX.test(phone.trim())) return 'Ingresá un teléfono válido (de 10 a 13 dígitos).'
  return ''
}

export const validateRepeatPassword = (password, repeatPassword) => {
  if (!repeatPassword) return 'Repetí tu contraseña.'
  if (password !== repeatPassword) return 'Las contraseñas no coinciden.'
  return ''
}
