import type { Match } from '../api/types'
import { usePrediction } from '../hooks/usePrediction'

// Badge de prédiction IA : barre 3 classes (victoire 1 / nul / victoire 2).
// Alimenté pour l'instant par un stub local (cf. usePrediction).
export function PredictionBadge({ match }: { match: Match }) {
  const { data, isLoading } = usePrediction(match)

  if (!match.homeTeam || !match.awayTeam) return null
  if (isLoading || !data) {
    return <div className="h-9 animate-pulse rounded-md bg-white/5" />
  }

  const segs = [
    { v: data.team1_win, cls: 'bg-emerald-500', label: '1' },
    { v: data.draw, cls: 'bg-slate-400', label: 'N' },
    { v: data.team2_win, cls: 'bg-sky-500', label: '2' },
  ]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
        <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium text-white/60">
          Prédiction IA
        </span>
        <span className="text-white/30">(modèle stub)</span>
      </div>
      <div className="flex h-7 overflow-hidden rounded-md ring-1 ring-white/10">
        {segs.map((s) => (
          <div
            key={s.label}
            className={`${s.cls} flex items-center justify-center text-[11px] font-semibold text-black/70`}
            style={{ width: `${s.v}%` }}
            title={`${s.label} : ${s.v}%`}
          >
            {s.v >= 12 ? `${Math.round(s.v)}%` : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
