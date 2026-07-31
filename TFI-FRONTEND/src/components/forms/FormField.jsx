/**
 * Shared field wrapper — label, optional inline error, then the input child.
 * Mirrors the inline Field component from Register.jsx.
 */
const FormField = ({ label, id, error, children }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
      {label}
    </label>
    {error && <p className="text-sm text-red-400">{error}</p>}
    {children}
  </div>
)

/**
 * Returns a className string for inputs/selects/textareas, styled for
 * the dark admin theme. Pass `hasError` to switch to red border.
 */
export const inputCls = (hasError = false) =>
  `w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500
   focus:outline-none transition-colors duration-150
   ${hasError
     ? 'border-red-500 focus:border-red-500'
     : 'border-zinc-700 focus:border-orange-500'
   }`

export default FormField
