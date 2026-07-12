export default function Dashboard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100">
      <div className="rounded-2xl border border-emerald-200 bg-white px-10 py-8 shadow-xl">
        <h1 className="text-center text-4xl font-bold text-emerald-700">
          🌿 EcoSphere
        </h1>

        <p className="mt-3 text-center text-gray-600">
          ESG Management Platform
        </p>

        <p className="mt-6 text-center text-lg font-medium">
          Welcome to your Dashboard
        </p>
      </div>
    </main>
  );
}