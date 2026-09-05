import Link from 'next/link';

export const dynamic = 'force-static';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header Navigation */}
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-4">
          {/* MoSPI Emblem Placeholder (Ashoka Lion Capital simplified) */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
            GoI
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight tracking-tight" style={{ color: 'var(--foreground)' }}>Ministry of Statistics & Programme Implementation</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Government of India</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" style={{ color: 'var(--muted-foreground)' }}>About</Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" style={{ color: 'var(--muted-foreground)' }}>Contact</Link>
          <Link href="/auth/login" className="px-5 py-2.5 rounded-md text-sm font-semibold transition-colors" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Official Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', borderColor: 'var(--primary)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></span>
          StatVidya National Skill Assessment Portal
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--foreground)', textWrap: 'balance' }}>
          Adaptive Competency Framework for India&apos;s Statistical Workforce
        </h2>

        <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl" style={{ color: 'var(--muted-foreground)', textWrap: 'balance' }}>
          A unified platform for assessing, tracking, and enhancing the professional skills of government officials from Field Investigators to Senior Directors, aligned strictly with the National Statistical Commission&apos;s guidelines.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/auth/login" className="w-full sm:w-auto px-8 py-3.5 rounded-md text-center font-semibold transition-colors shadow-sm hover:opacity-90" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Enter Portal →
          </Link>
          <Link href="/auth/login" className="w-full sm:w-auto px-8 py-3.5 rounded-md text-center font-semibold transition-colors border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
            Track My Progress
          </Link>
        </div>

        {/* Key Features / Trust Markers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left border-t pt-12" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--primary)' }}>FRAC Aligned</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Grounded in the Functional Requirements for Administrative Competencies model adopted by MoSPI.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--primary)' }}>Offline-First</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Progressive Web App capabilities ensure field investigators in remote census blocks can capture assessments without reliable internet.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--primary)' }}>Transparent Analytics</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              All synthetic data and algorithmic recommendations are explicitly labeled with provenance markers to guarantee institutional trust.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        © {new Date().getFullYear()} Ministry of Statistics & Programme Implementation, Government of India. All Rights Reserved.
      </footer>
    </div>
  );
}
