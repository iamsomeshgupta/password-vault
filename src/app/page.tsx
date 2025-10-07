export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Password Vault</h1>
      <p className="text-lg text-gray-400">Keep your passwords safe and secure.</p>
      <div className="flex gap-4 mt-6">
        <a
          href="/signup"
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white font-semibold"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded text-white font-semibold"
        >
          Log In
        </a>
      </div>
    </main>
  );
}
