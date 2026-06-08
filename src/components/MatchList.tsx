import { useMemo, useState } from 'react'
import { useMatches } from '../hooks/useMatches'
import type { Match } from '../api/types'
import { MatchCard } from './MatchCard'
import { MatchFilters, type FilterType } from './MatchFilters'
import { SoccerBallLoader } from './SoccerBallLoader'

export function MatchList({ now }: { now: number }) {
  const { data, isLoading, isError, error } = useMatches(2026)
  const [filter, setFilter] = useState<FilterType>('all')

  const matches = useMemo(() => data?.data ?? [], [data])

  const visible = useMemo(() => {
    const filtered =
      filter === 'all'
        ? matches
        : matches.filter((m) => (m.stageNormalized ?? m.stage) === filter)
    return [...filtered].sort(
      (a, b) =>
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    )
  }, [matches, filter])

  if (isLoading) return <SoccerBallLoader />
  if (isError) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Erreur de chargement des matchs : {(error as Error).message}
      </p>
    )
  }

  return (
    <div>
      <MatchFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        totalMatches={matches.length}
      />

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/40">
          Aucun match pour ce filtre.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m: Match) => (
            <MatchCard key={m.id} match={m} now={now} />
          ))}
        </div>
      )}
    </div>
  )
}
