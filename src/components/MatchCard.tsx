import type { Match } from '../api/types'
import { formatMatchDate, matchStatus, stageLabel } from '../lib/format'
import { PredictionBadge } from './PredictionBadge'

const STATUS_STYLE = {
  live: { dot: 'bg-red-500 animate-pulse', label: 'EN DIRECT', cls: 'text-red-400' },
  finished: { dot: 'bg-white/30', label: 'Terminé', cls: 'text-white/40' },
  upcoming: { dot: 'bg-emerald-400', label: 'À venir', cls: 'text-emerald-300/70' },
} as const

function TeamRow({
  name,
  score,
  winner,
}: {
  name: string | null
  score: number | null
  winner: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`truncate text-[15px] ${winner ? 'font-bold text-white' : 'text-white/85'}`}
      >
        {name ?? <span className="italic text-white/40">À déterminer</span>}
      </span>
      <span
        className={`min-w-6 text-right text-lg tabular-nums ${winner ? 'font-bold text-white' : 'text-white/70'}`}
      >
        {score ?? '–'}
      </span>
    </div>
  )
}

export function MatchCard({ match, now }: { match: Match; now: number }) {
  const hasScore = match.homeScore != null && match.awayScore != null
  const status = matchStatus(hasScore, match.kickoffUtc, now)
  const s = STATUS_STYLE[status]
  const homeWin = hasScore && match.homeScore! > match.awayScore!
  const awayWin = hasScore && match.awayScore! > match.homeScore!

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 backdrop-blur transition hover:border-emerald-400/30 hover:bg-white/[0.06]">
      <header className="mb-3 flex items-center justify-between text-xs text-white/45">
        <span>{stageLabel(match.stageNormalized ?? match.stage)}</span>
        <span className={`flex items-center gap-1.5 font-medium ${s.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </header>

      <div className="space-y-2">
        <TeamRow name={match.homeTeam} score={match.homeScore} winner={homeWin} />
        <TeamRow name={match.awayTeam} score={match.awayScore} winner={awayWin} />
      </div>

      {match.penalties && (
        <p className="mt-1 text-right text-xs text-amber-300/80">
          T.a.b. {match.penalties}
        </p>
      )}

      <footer className="mt-3 border-t border-white/5 pt-3 text-xs text-white/45">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{formatMatchDate(match.date)}</span>
          <span>·</span>
          <span>{match.kickoff}</span>
          <span>·</span>
          <span className="truncate">
            {match.stadium}, {match.city}
          </span>
        </div>
        {status !== 'finished' && <PredictionBadge match={match} />}
      </footer>
    </article>
  )
}
