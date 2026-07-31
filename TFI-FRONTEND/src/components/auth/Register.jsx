import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import Layout from '../layout/Layout'
import {
  validateDateOfBirth,
  validateDni,
  validateEmail,
  validateFullName,
  validateGender,
  validatePassword,
  validatePhone,
  validateRepeatPassword,
} from './validation'

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none ${
    hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-zinc-700 focus:border-orange-500'
  }`

const Field = ({ label, id, error, children }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
      {label}
    </label>
    {error && <p className="text-sm text-red-500">{error}</p>}
    {children}
  </div>
)

const Register = () => {
  const navigate = useNavigate()
  const { post, isLoading } = useFetch()
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    dni: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    const fullNameError = validateFullName(form.fullName)
    if (fullNameError) newErrors.fullName = fullNameError

    const dateOfBirthError = validateDateOfBirth(form.dateOfBirth)
    if (dateOfBirthError) newErrors.dateOfBirth = dateOfBirthError

    const dniError = validateDni(form.dni)
    if (dniError) newErrors.dni = dniError

    const genderError = validateGender(form.gender)
    if (genderError) newErrors.gender = genderError

    const phoneError = validatePhone(form.phone)
    if (phoneError) newErrors.phone = phoneError

    const emailError = validateEmail(form.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(form.password)
    if (passwordError) newErrors.password = passwordError

    const repeatPasswordError = validateRepeatPassword(form.password, form.repeatPassword)
    if (repeatPasswordError) newErrors.repeatPassword = repeatPasswordError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setApiError(null)

    post(
      'auth/signup',
      false,
      {
        Name: form.fullName,
        Email: form.email,
        Password: form.password,
        DateOfBirth: form.dateOfBirth,
        DNI: form.dni,
        Gender: form.gender,
        PhoneNumber: form.phone,
      },
      () => navigate('/register/success'),
      (err) => setApiError(err.message || 'Something went wrong. Please try again.')
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">
            Log in
          </Link>
        </p>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

          <Field label="Email" id="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass(errors.email)}
            />
          </Field>
          
          <Field label="Full name" id="fullName" error={errors.fullName}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass(errors.fullName)}
            />
          </Field>

          <Field label="Date of birth" id="dateOfBirth" error={errors.dateOfBirth}>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass(errors.dateOfBirth)}
            />
          </Field>

          <Field label="DNI" id="dni" error={errors.dni}>
            <input
              id="dni"
              name="dni"
              type="text"
              inputMode="numeric"
              value={form.dni}
              onChange={handleChange}
              placeholder="12345678"
              className={inputClass(errors.dni)}
            />
          </Field>

          <Field label="Gender" id="gender" error={errors.gender}>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass(errors.gender)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </Field>

          <Field label="Phone number" id="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handleChange}
              placeholder="1123456789"
              className={inputClass(errors.phone)}
            />
          </Field>

          

          <Field label="Password" id="password" error={errors.password}>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass(errors.password)}
            />
          </Field>

          <Field label="Repeat password" id="repeatPassword" error={errors.repeatPassword}>
            <input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              value={form.repeatPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass(errors.repeatPassword)}
            />
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Creating account…' : 'Register'}
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default Register
