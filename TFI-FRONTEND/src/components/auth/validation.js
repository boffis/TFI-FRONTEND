const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{3,}$/
const DNI_REGEX = /^\d{7,8}$/
const PHONE_REGEX = /^\d{10,13}$/

export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required.'
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address.'
  return ''
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include at least one letter and one number.'
  }
  return ''
}

export const validateFullName = (fullName) => {
  if (!fullName.trim()) return 'Full name is required.'
  if (!NAME_REGEX.test(fullName.trim())) return 'Enter a valid full name (letters only, min. 3 characters).'
  return ''
}

export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return 'Date of birth is required.'

  const birthDate = new Date(dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) return 'Enter a valid date.'

  const today = new Date()
  if (birthDate >= today) return 'Date of birth must be in the past.'

  const age = today.getFullYear() - birthDate.getFullYear()
  const hadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  const actualAge = hadBirthday ? age : age - 1
  if (actualAge < 16) return 'You must be at least 16 years old to register.'

  return ''
}

export const validateDni = (dni) => {
  if (!dni.trim()) return 'DNI is required.'
  if (!DNI_REGEX.test(dni.trim())) return 'DNI must be 7 or 8 digits.'
  return ''
}

export const validateGender = (gender) => {
  if (!gender) return 'Gender is required.'
  return ''
}

export const validatePhone = (phone) => {
  if (!phone.trim()) return 'Phone number is required.'
  if (!PHONE_REGEX.test(phone.trim())) return 'Enter a valid phone number (10 to 13 digits).'
  return ''
}

export const validateRepeatPassword = (password, repeatPassword) => {
  if (!repeatPassword) return 'Please repeat your password.'
  if (password !== repeatPassword) return 'Passwords do not match.'
  return ''
}
