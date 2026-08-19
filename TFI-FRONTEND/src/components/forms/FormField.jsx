/** Label, optional inline error, then the input child. Mirrors Register.jsx's inline Field. */
const FormField = ({ label, id, error, children }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
      {label}
    </label>
    {error && <p className="text-sm text-red-400">{error}</p>}
    {children}
  </div>
)

/** Input className for the dark admin theme; `hasError` switches to a red border. */
export const inputCls = (hasError = false) =>
  `w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500
   focus:outline-none transition-colors duration-150
   ${hasError
     ? 'border-red-500 focus:border-red-500'
     : 'border-zinc-700 focus:border-orange-500'
   }`

export default FormField
