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
        <InfoSecGame />
      </div>
    </main>
  )
}
