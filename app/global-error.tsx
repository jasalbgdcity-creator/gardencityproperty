"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-slate-100 flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-3 text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 mb-6">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 active:scale-95"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
