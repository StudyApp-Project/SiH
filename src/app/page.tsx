import { 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  BrainCircuit, 
  WifiOff, 
  ChevronRight,
  GraduationCap
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      {/* Top Institutional Bar */}
      <header className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm dark:bg-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg sm:text-xl">StatVidya</span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/70 dark:text-blue-300">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय | National Statistical Systems Training Academy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Phase 1 Core Engine Active
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Workforce Competency Intelligence Platform
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-zinc-50">
                Empowering India&apos;s Official Statistical Workforce
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-zinc-400">
                Role-based competency mapping, localized training recommendations, and continuous proficiency tracking for ISS Officers, SSS personnel, and Field Investigators under Mission Karmayogi.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#modules"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Explore Modules
                  <ChevronRight className="h-4 w-4" />
                </a>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  Smart India Hackathon 2024 • Problem PS 26101
                </span>
              </div>
            </div>

            {/* Architecture Highlights Grid */}
            <div id="modules" className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold text-base">Competency Matrix</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                  Granular skill taxonomies spanning Survey Operations, Econometrics, and Data Governance.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold text-base">AI Proficiency Radar</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                  Targeted learning paths mapped to NSSTA curricula and iGOT Karmayogi courses.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <WifiOff className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold text-base">Offline-First Engine</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                  IndexedDB background sync engineered for zero-connectivity field assessments.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold text-base">Institutional Governance</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                  Role-based hierarchy for MoSPI leadership, NSSTA instructors, and field cadres.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center text-xs text-slate-500 sm:flex-row dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Built for MoSPI & NSSTA • Developed for SIH 2024</span>
          </div>
          <div>Next.js 16 • Tailwind CSS v4 • Supabase • Serwist PWA</div>
        </div>
      </footer>
    </div>
  );
}
