import { useEffect, useState } from 'react'
import { MatchList } from './components/MatchList'
import { GroupTables } from './components/GroupTable'
import { useStandings } from './hooks/useStandings'

type Tab = 'matches' | 'groups'

function GroupsView() {
  const { data, isLoading, isError, error } = useStandings(2026)
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    )
  }
  if (isError || !data) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Erreur de chargement des classements : {(error as Error)?.message}
      </p>
    )
  }
  return <GroupTables groups={data.groups} />
}

function App() {
  const [tab, setTab] = useState<Tab>('matches')
  const [now, setNow] = useState(() => Date.now())

  // Rafraîchit le "now" chaque minute pour les statuts live / à venir.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Coupe du Monde 2026
            </h1>
            <p className="text-sm text-white/50">
              Matchs en direct &amp; prédictions IA · 🇨🇦 🇲🇽 🇺🇸
            </p>
          </div>
        </div>

        <nav className="mt-6 flex gap-1 rounded-lg bg-white/5 p-1 text-sm">
          {(
            [
              ['matches', 'Matchs'],
              ['groups', 'Groupes'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-4 py-2 font-medium transition ${
                tab === key
                  ? 'bg-emerald-500 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'matches' ? <MatchList now={now} /> : <GroupsView />}
      </main>

      <footer className="mt-12 border-t border-white/5 pt-4 text-center text-xs text-white/30">
        Données : Zafronix WC API · Prédictions : modèle stub (API ML à venir)
      </footer>
    </div>
  )
}

export default App
