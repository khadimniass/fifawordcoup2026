import { useQuery } from '@tanstack/react-query'
import { getTournament2026 } from '../api/zafronix'
import type { Coach } from '../api/types'
import { resolveIso } from '../lib/flags'

export interface TeamMeta {
  name: string
  code: string // FIFA, ex "FRA"
  iso: string // alpha-2, ex "fr"
  group: string // "A".."L"
  confederation: string
  coach: Coach | null
}

export interface TeamsMeta {
  list: TeamMeta[]
  // Recherche tolérante au conflit de nommage (clé canonique = ISO).
  get: (name: string | null | undefined) => TeamMeta | undefined
}

// Métadonnées des 48 équipes 2026 (groupe, code, confédération, coach).
// Indexées par ISO pour absorber les divergences de noms entre endpoints.
// Source : /tournaments/2026. Quasi statique -> cache long.
export function useTeamsMeta() {
  return useQuery({
    queryKey: ['teams-meta', 2026],
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<TeamsMeta> => {
      const t = await getTournament2026()
      const byIso: Record<string, TeamMeta> = {}
      const list: TeamMeta[] = t.teams.map((team) => {
        const meta: TeamMeta = {
          name: team.name,
          code: team.code,
          iso: team.iso,
          group: team.groupStage?.group ?? '',
          confederation: team.confederation,
          coach: team.coach,
        }
        const iso = resolveIso(team.name) ?? team.iso
        if (iso) byIso[iso] = meta
        return meta
      })
      return {
        list,
        get: (name) => {
          const iso = resolveIso(name)
          return iso ? byIso[iso] : undefined
        },
      }
    },
  })
}
