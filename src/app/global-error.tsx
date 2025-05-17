"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-700 mb-6">
              A global error occurred in the application. Please try again.
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Try again
            </button>

            <div className="mt-4">
              <a
                href="/login"
                className="block text-center text-indigo-600 hover:text-indigo-800"
              >
                Return to login
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
