"use client";

export default function ExploreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-xl font-semibold text-white">Couldn&apos;t load creators</h1>
      <p className="text-sm text-stone-400">{error.message || "An unexpected error occurred."}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-tip-orange px-5 py-2 text-sm font-semibold text-black transition hover:bg-tip-orange/90"
      >
        Try again
      </button>
    </div>
  );
}
