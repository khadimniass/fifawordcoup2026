import { useMemo } from 'react'
import { useTeamsMeta, type TeamMeta } from '../hooks/useTeamsMeta'
import { useChampions } from '../hooks/useInfo'
import { useOpenTeam } from '../context/teamModal'
import { resolveIso } from '../lib/flags'
import { Flag } from './Flag'
import { SoccerBallLoader } from './SoccerBallLoader'

// Ordre d'affichage des confédérations.
const CONF_ORDER = ['UEFA', 'CONMEBOL', 'CAF', 'AFC', 'Concacaf', 'OFC']

export function CountriesPage() {
  const { data: meta, isLoading } = useTeamsMeta()
  const { data: champions } = useChampions()
  const openTeam = useOpenTeam()

  // Titres par ISO (somme les variantes historiques : RFA + Allemagne -> de).
  const titlesByIso = useMemo(() => {
    const out: Record<string, number> = {}
    for (const [country, n] of Object.entries(champions?.byCountry ?? {})) {
      const iso = resolveIso(country)
      if (iso) out[iso] = (out[iso] ?? 0) + n
    }
    return out
  }, [champions])

  const byConf = useMemo(() => {
    const groups: Record<string, TeamMeta[]> = {}
    for (const t of meta?.list ?? []) {
      ;(groups[t.confederation] ??= []).push(t)
    }
    for (const list of Object.values(groups)) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    }
    return groups
  }, [meta])

  if (isLoading) return <SoccerBallLoader label="Chargement des nations…" />

  const confs = Object.keys(byConf).sort(
    (a, b) => CONF_ORDER.indexOf(a) - CONF_ORDER.indexOf(b),
  )

  return (
    <div className="space-y-8">
      {confs.map((conf) => (
        <section key={conf}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            {conf}
            <span className="text-white/30">({byConf[conf].length})</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {byConf[conf].map((t) => {
              const titles = titlesByIso[resolveIso(t.name) ?? ''] ?? 0
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => openTeam(t.name)}
                  className="relative z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-[#162216]/80 p-3 text-left transition hover:border-emerald-400/40 hover:bg-[#1a2a1a]/80"
                >
                  <Flag team={t.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">{t.name}</div>
                    <div className="text-xs text-white/45">Groupe {t.group}</div>
                  </div>
                  {titles > 0 && (
                    <span
                      className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300"
                      title={`${titles} titre${titles > 1 ? 's' : ''} mondial`}
                    >
                      🏆 {titles}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
