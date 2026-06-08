import { useOnThisDay } from '../hooks/useInfo'

// "Aujourd'hui dans l'histoire" : matchs joués ce jour lors d'éditions passées.
// Masqué s'il n'y a aucun match.
export function TodayInHistory() {
  const { data } = useOnThisDay()
  if (!data || data.matches.length === 0) return null

  return (
    <div className="relative z-10 rounded-xl border border-white/10 bg-[#162216]/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-300">
        Aujourd'hui dans l'histoire du Mondial
      </h3>
      <ul className="space-y-2 text-sm">
        {data.matches.slice(0, 8).map((m) => (
          <li key={m.id} className="flex items-baseline gap-2">
            <span className="w-10 shrink-0 tabular-nums text-white/40">
              {m.year}
            </span>
            <span className="min-w-0 flex-1 truncate text-white/80">
              {m.homeTeam}{' '}
              <span className="font-semibold text-white">
                {m.score ?? 'v.'}
              </span>{' '}
              {m.awayTeam}
            </span>
            <span className="shrink-0 text-[11px] text-white/35">
              il y a {m.yearsAgo} ans
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
