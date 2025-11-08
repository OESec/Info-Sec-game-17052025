import { InfoSecGame } from "@/components/infosec-game"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">InfoSec Challenge</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Test your cybersecurity knowledge with real-world scenarios
          </p>
        </header>
        <div className="mb-6 px-4 py-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg">
          <p className="text-sm text-purple-900 dark:text-purple-300 flex items-center justify-center gap-2">
            <img src="/images/vibe-coded-icon.png" alt="Vibe-Coded" className="w-5 h-5" />
            <span>
              <strong>Vibe-Coded Tool:</strong> AI-generated analysis may contain errors. Verify all security guidance.
            </span>
          </p>
        </div>
        <InfoSecGame />
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <span>Created May 17th 2025 | Edewede O. |</span>
            <img src="/images/vibe-coded-icon.png" alt="Vibe-Coded" className="inline-block w-4 h-4" />
            <span>Vibe-Coded Platform (AI-assisted)</span>
          </p>
        </footer>
      </div>
    </main>
  )
}
