"use client";

/** Root-level error boundary — catches any error not handled by a nested route segment. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-tip-dark px-4 text-white">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-stone-400">{error.message || "An unexpected error occurred."}</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-tip-orange px-5 py-2 text-sm font-semibold text-black transition hover:bg-tip-orange/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
