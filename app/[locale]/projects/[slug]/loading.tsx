export default function ProjectDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Navbar Skeleton */}
      <div className="sticky top-0 z-50 h-20 w-full border-b border-white/5 bg-[#050816]/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-40 rounded-lg bg-slate-800/70 animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            <div className="h-4 w-20 rounded bg-slate-800/60 animate-pulse" />
            <div className="h-4 w-20 rounded bg-slate-800/60 animate-pulse" />
            <div className="h-4 w-20 rounded bg-slate-800/60 animate-pulse" />
            <div className="h-9 w-28 rounded-lg bg-slate-800/80 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <section className="relative min-h-[85vh] w-full bg-slate-950 flex flex-col justify-end p-6 sm:p-12 lg:p-16 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.08),transparent_60%)]" />

        <div className="mx-auto max-w-7xl w-full relative z-10">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 rounded bg-slate-800/80 animate-pulse mb-6" />

          {/* Status Pill Skeleton */}
          <div className="h-7 w-36 rounded-full bg-sky-500/10 border border-sky-400/20 animate-pulse mb-4" />

          {/* Project Title Skeleton */}
          <div className="h-10 sm:h-14 w-3/4 max-w-xl rounded-2xl bg-slate-800/80 animate-pulse mb-4" />

          {/* Location & Developer Skeleton */}
          <div className="h-5 w-64 rounded-lg bg-slate-800/60 animate-pulse mb-8" />

          {/* Action CTAs Skeleton */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-12 w-44 rounded-xl bg-slate-800/70 animate-pulse" />
            <div className="h-12 w-36 rounded-xl bg-emerald-500/20 border border-emerald-400/30 animate-pulse" />
            <div className="h-12 w-36 rounded-xl bg-sky-500/20 border border-sky-400/30 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Specifications Strip Skeleton */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl animate-pulse flex flex-col justify-between"
            >
              <div className="h-3 w-20 rounded bg-slate-800/80" />
              <div className="h-6 w-32 rounded bg-slate-800/90" />
            </div>
          ))}
        </div>
      </div>

      {/* Content & Gallery Skeleton */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="h-8 w-64 rounded-xl bg-slate-800/80 animate-pulse" />
          <div className="h-4 w-full rounded bg-slate-800/50 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-slate-800/50 animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-slate-800/50 animate-pulse" />
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
          <div className="sm:col-span-2 lg:col-span-2 h-[320px] sm:h-[420px] rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse" />
          <div className="h-[260px] sm:h-[320px] rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse" />
          <div className="h-[260px] sm:h-[320px] rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse" />
          <div className="h-[260px] sm:h-[320px] rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse" />
          <div className="h-[260px] sm:h-[320px] rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse" />
        </div>
      </section>
    </div>
  );
}
