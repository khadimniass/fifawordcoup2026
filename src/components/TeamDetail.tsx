import { useEffect, useMemo } from 'react'
import type { RosterPlayer } from '../api/types'
import { useRoster, useTeam } from '../hooks/useTeamDetail'
import { useTeamsMeta } from '../hooks/useTeamsMeta'
import { flagUrl } from '../lib/flags'
import {
  bestResult,
  POSITION_ORDER,
  POSITION_STYLE,
  positionLabel,
} from '../lib/teamFormat'
import { SoccerBallLoader } from './SoccerBallLoader'

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-white/45">
        {label}
      </div>
    </div>
  )
}

function RosterTable({ players }: { players: RosterPlayer[] }) {
  const sorted = [...players].sort(
    (a, b) =>
      POSITION_ORDER[a.position] - POSITION_ORDER[b.position] ||
      a.jersey - b.jersey,
  )
  return (
    <table className="w-full min-w-[28rem] text-sm">
      <thead className="text-[11px] uppercase text-white/40">
        <tr>
          <th className="px-2 py-1.5 text-left font-medium">N°</th>
          <th className="px-2 py-1.5 text-left font-medium">Joueur</th>
          <th className="px-2 py-1.5 text-left font-medium">Poste</th>
          <th className="px-2 py-1.5 text-left font-medium">Club</th>
          <th className="px-2 py-1.5 text-center font-medium">Buts WC</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((p) => (
          <tr key={`${p.jersey}-${p.name}`} className="border-t border-white/5">
            <td className="px-2 py-1.5 tabular-nums text-white/50">{p.jersey}</td>
            <td className="px-2 py-1.5">
              <span className={p.captain ? 'font-bold text-white' : 'text-white/85'}>
                {p.name}
              </span>
              {p.captain && (
                <span className="ml-1.5 rounded bg-white/10 px-1 text-[10px] text-white/60">
                  C
                </span>
              )}
            </td>
            <td className="px-2 py-1.5">
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${POSITION_STYLE[p.position]}`}
              >
                {p.position}
              </span>
            </td>
            <td className="px-2 py-1.5 text-white/70">{p.club.name}</td>
            <td className="px-2 py-1.5 text-center tabular-nums text-white/70">
              {p.goals}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function TeamDetail({
  team,
  onClose,
}: {
  team: string
  onClose: () => void
}) {
  const { data: meta } = useTeamsMeta()
  const { data: detail, isLoading } = useTeam(team)
  const { data: roster } = useRoster(team)
  const m = meta?.get(team)
  const flag = flagUrl(team, 80)

  // Fermeture sur Escape + verrou du scroll du body.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const stats = useMemo(() => {
    const ap = detail?.appearances ?? []
    const years = ap.map((a) => a.year)
    return {
      count: ap.length,
      titles: ap.filter((a) => a.finalPosition === 1).length,
      best: bestResult(ap),
      first: years.length ? Math.min(...years) : null,
      last: years.length ? Math.max(...years) : null,
    }
  }, [detail])

  const timeline = useMemo(
    () => [...(detail?.appearances ?? [])].sort((a, b) => b.year - a.year),
    [detail],
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e1f16] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 p-5">
          {flag && (
            <img src={flag} alt="" className="w-12 rounded ring-1 ring-black/30" />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              {team}{' '}
              {m?.code && (
                <span className="text-sm font-normal text-white/40">{m.code}</span>
              )}
            </h2>
            {m?.group && (
              <span className="mt-1 inline-block rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                Groupe {m.group}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            ✕ Fermer
          </button>
        </div>

        {isLoading ? (
          <SoccerBallLoader label="Chargement de l'équipe…" size={56} />
        ) : (
          <div className="space-y-6 p-5">
            {/* Stats participation */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Participations" value={stats.count} />
              <Metric
                label="Meilleur résultat"
                value={positionLabel(stats.best).replace(' 🏆', '🏆')}
              />
              <Metric label="Titres" value={stats.titles} />
              <Metric
                label="1re → dernière"
                value={
                  stats.first ? `${stats.first}–${stats.last}` : '—'
                }
              />
            </div>

            {/* Coach */}
            {m?.coach && (
              <p className="text-sm text-white/60">
                Sélectionneur :{' '}
                <span className="text-white/90">{m.coach.name}</span>
              </p>
            )}

            {/* Effectif 2026 */}
            {roster && roster.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-emerald-300">
                  Effectif 2026
                </h3>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <RosterTable players={roster} />
                </div>
              </section>
            )}

            {/* Timeline des participations */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-emerald-300">
                Historique des participations
              </h3>
              <ol className="space-y-1.5 border-l border-white/10 pl-4">
                {timeline.map((a) => {
                  const champ = a.finalPosition === 1
                  const podium = a.finalPosition != null && a.finalPosition <= 3
                  return (
                    <li
                      key={a.year}
                      className="relative flex items-baseline gap-3 text-sm"
                    >
                      <span
                        className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${champ ? 'bg-amber-400' : podium ? 'bg-emerald-400' : 'bg-white/30'}`}
                      />
                      <span className="w-12 shrink-0 tabular-nums text-white/50">
                        {a.year}
                      </span>
                      <span
                        className={
                          podium ? 'font-medium text-emerald-300' : 'text-white/75'
                        }
                      >
                        {positionLabel(a.finalPosition)}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
