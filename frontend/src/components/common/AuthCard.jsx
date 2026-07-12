export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {title && (
          <h2 className="text-3xl font-bold text-center text-emerald-700">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="mt-2 mb-6 text-center text-gray-500">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}