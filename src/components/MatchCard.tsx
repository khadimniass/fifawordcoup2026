import type { Match } from '../api/types'
import { useOpenTeam } from '../context/teamModal'
import {
  formatKickoffTime,
  formatMatchDate,
  matchStatus,
  stageLabel,
} from '../lib/format'
import { Flag } from './Flag'
import { PredictionBadge } from './PredictionBadge'

function TeamName({ name }: { name: string | null }) {
  const openTeam = useOpenTeam()
  if (!name) return <span className="italic text-white/40">À déterminer</span>
  return (
    <button
      type="button"
      onClick={() => openTeam(name)}
      className="truncate text-left hover:text-emerald-300 hover:underline"
    >
      {name}
    </button>
  )
}

function Side({
  name,
  score,
  winner,
  showScore,
  align,
}: {
  name: string | null
  score: number | null
  winner: boolean
  showScore: boolean
  align: 'left' | 'right'
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
    >
      <Flag team={name} size={40} />
      <span
        className={`min-w-0 flex-1 truncate text-[15px] ${winner ? 'font-bold text-white' : 'text-white/85'}`}
      >
        <TeamName name={name} />
      </span>
      {showScore && (
        <span
          className={`text-2xl tabular-nums ${winner ? 'font-bold text-white' : 'text-white/70'}`}
        >
          {score ?? '–'}
        </span>
      )}
    </div>
  )
}

export function MatchCard({ match, now }: { match: Match; now: number }) {
  const hasScore = match.homeScore != null && match.awayScore != null
  const status = matchStatus(hasScore, match.kickoffUtc, now)
  const homeWin = hasScore && match.homeScore! > match.awayScore!
  const awayWin = hasScore && match.awayScore! > match.homeScore!
  const stage = stageLabel(match.stageNormalized ?? match.stage)

  return (
    <article className="relative z-10 rounded-xl border border-white/10 bg-[#162216]/80 p-4 shadow-lg shadow-black/20 backdrop-blur transition hover:border-emerald-400/30 hover:bg-[#1a2a1a]/80">
      <header className="mb-3 flex items-center justify-between text-xs text-white/45">
        <span>{stage}</span>
        {status === 'live' && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 font-semibold text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            EN DIRECT
          </span>
        )}
        {status === 'finished' && <span className="text-white/40">Terminé</span>}
        {status === 'upcoming' && (
          <span className="text-emerald-300/70">À venir</span>
        )}
      </header>

      <div className="flex items-center gap-2">
        <Side
          name={match.homeTeam}
          score={match.homeScore}
          winner={homeWin}
          showScore={status !== 'upcoming'}
          align="left"
        />
        <span className="shrink-0 px-1 text-xs font-medium text-white/30">
          {status === 'upcoming' ? 'VS' : '-'}
        </span>
        <Side
          name={match.awayTeam}
          score={match.awayScore}
          winner={awayWin}
          showScore={status !== 'upcoming'}
          align="right"
        />
      </div>

      {match.penalties && (
        <p className="mt-1 text-center text-xs text-amber-300/80">
          T.a.b. {match.penalties}
        </p>
      )}

      <footer className="mt-3 border-t border-white/5 pt-3 text-xs text-white/45">
        {status === 'finished' ? (
          <div>Score final · {stage}</div>
        ) : (
          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{formatMatchDate(match.kickoffUtc)}</span>
            <span>·</span>
            <span>{formatKickoffTime(match.kickoffUtc)}</span>
            <span>·</span>
            <span className="truncate">
              {match.stadium}, {match.city}
            </span>
          </div>
        )}
        {status !== 'finished' && <PredictionBadge match={match} />}
      </footer>
    </article>
  )
}
