import { useState } from 'react'
import { useStandings } from '../hooks/useStandings'
import { GroupCard } from './GroupTable'
import { SoccerBallLoader } from './SoccerBallLoader'

export function GroupsPage() {
  const { data, isLoading, isError, error } = useStandings(2026)
  const [active, setActive] = useState<string>('all')

  if (isLoading) return <SoccerBallLoader label="Chargement des classements…" />
  if (isError || !data) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Erreur de chargement des classements : {(error as Error)?.message}
      </p>
    )
  }

  const keys = Object.keys(data.groups).sort()
  const shown = active === 'all' ? keys : keys.filter((g) => g === active)

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Chip active={active === 'all'} onClick={() => setActive('all')}>
          Tous les groupes
        </Chip>
        {keys.map((g) => (
          <Chip key={g} active={active === g} onClick={() => setActive(g)}>
            Groupe {g}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((g) => (
          <GroupCard key={g} group={g} rows={data.groups[g]} />
        ))}
      </div>
    </div>
  )
}

function Chip({
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
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-emerald-500 text-white'
          : 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
