import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">404</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h3>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
