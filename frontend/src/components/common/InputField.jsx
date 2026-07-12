export default function InputField({
  label,
  register,
  error,
  ...props
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>

      <input
        {...register}
        {...props}
        className="w-full rounded-lg border p-3"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}