export default function SelectField({
  label,
  register,
  error,
  children,
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>

      <select
        {...register}
        className="w-full rounded-lg border p-3"
      >
        {children}
      </select>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}