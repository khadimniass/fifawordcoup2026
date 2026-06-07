import { useMemo, useState } from 'react'
import { useMatches } from '../hooks/useMatches'
import type { Match } from '../api/types'
import { stageLabel } from '../lib/format'
import { MatchCard } from './MatchCard'

// Ordre d'affichage des stages.
const STAGE_ORDER = [
  'group_a', 'group_b', 'group_c', 'group_d', 'group_e', 'group_f',
  'group_g', 'group_h', 'group_i', 'group_j', 'group_k', 'group_l',
  'round_of_32', 'round_of_16', 'quarter_final', 'semi_final',
  'third_place', 'final',
]

function stageRank(stage: string | null): number {
  const i = STAGE_ORDER.indexOf(stage ?? '')
  return i === -1 ? 999 : i
}

export function MatchList({ now }: { now: number }) {
  const { data, isLoading, isError, error } = useMatches(2026)
  const [filter, setFilter] = useState<string>('all')

  const matches = useMemo(() => data?.data ?? [], [data])

  const stages = useMemo(() => {
    const set = new Set<string>()
    for (const m of matches) set.add(m.stageNormalized ?? m.stage)
    return [...set].sort((a, b) => stageRank(a) - stageRank(b))
  }, [matches])

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

  if (isLoading) return <ListSkeleton />
  if (isError) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Erreur de chargement des matchs : {(error as Error).message}
      </p>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          Tous ({matches.length})
        </FilterChip>
        {stages.map((st) => (
          <FilterChip key={st} active={filter === st} onClick={() => setFilter(st)}>
            {stageLabel(st)}
          </FilterChip>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m: Match) => (
          <MatchCard key={m.id} match={m} now={now} />
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-emerald-500 text-black'
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90'
      }`}
    >
      {children}
    </button>
  )
}

function ListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-xl border border-white/10 bg-white/5"
        />
      ))}
    </div>
  )
}
