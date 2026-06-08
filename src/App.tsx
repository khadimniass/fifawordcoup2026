import { useCallback, useEffect, useState } from 'react'
import { MatchList } from './components/MatchList'
import { GroupsPage } from './components/GroupsPage'
import { CountriesPage } from './components/CountriesPage'
import { FloatingBalls } from './components/FloatingBalls'
import { SearchBar } from './components/SearchBar'
import { TeamDetail } from './components/TeamDetail'
import { TriviaCard } from './components/TriviaCard'
import { TodayInHistory } from './components/TodayInHistory'
import { ChampionsBar } from './components/ChampionsBar'
import { TeamModalContext } from './context/teamModal'

type Tab = 'matches' | 'groups' | 'countries'

function App() {
  const [tab, setTab] = useState<Tab>('matches')
  const [now, setNow] = useState(() => Date.now())
  const [team, setTeam] = useState<string | null>(null)

  const openTeam = useCallback((name: string) => setTeam(name), [])

  // Rafraîchit "now" chaque minute pour les statuts live / à venir.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <TeamModalContext.Provider value={openTeam}>
      <FloatingBalls />

      <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
            <SearchBar />
          </div>

          <nav className="mt-6 flex gap-6 border-b border-white/10 text-sm">
            {(
              [
                ['matches', 'Matchs'],
                ['groups', 'Groupes'],
                ['countries', 'Pays'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`-mb-px border-b-2 px-1 pb-3 font-medium transition ${
                  tab === key
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <main className="min-w-0">
            {tab === 'matches' && <MatchList now={now} />}
            {tab === 'groups' && <GroupsPage />}
            {tab === 'countries' && <CountriesPage />}
          </main>
          <aside className="space-y-4">
            <TriviaCard />
            <TodayInHistory />
          </aside>
        </div>

        <div className="mt-6">
          <ChampionsBar />
        </div>

        <footer className="mt-12 border-t border-white/5 pt-4 text-center text-xs text-white/30">
          Données : Zafronix WC API · Prédictions : modèle ML (predict_ml)
        </footer>
      </div>

      {team && <TeamDetail team={team} onClose={() => setTeam(null)} />}
    </TeamModalContext.Provider>
  )
}

export default App
