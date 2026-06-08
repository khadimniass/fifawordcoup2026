import { useQuery } from '@tanstack/react-query'
import type { Match } from '../api/types'
import { predictMatch } from '../api/ml'

// Prédiction affichée par l'UI : probabilités + métadonnées + provenance.
export interface UiPrediction {
  team1_win: number
  draw: number
  team2_win: number
  favorite: string | null
  confidence: 'low' | 'medium' | 'high' | null
  source: 'ml' | 'stub'
}

// Repli local déterministe si l'API ML (predict_ml) n'est pas démarrée.
function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function stubPredict(home: string, away: string): UiPrediction {
  const hStrength = (hash(home) % 60) + 40
  const aStrength = (hash(away) % 60) + 40
  const drawBase = 22 + (hash(home + away) % 10)
  const remaining = 100 - drawBase
  const total = hStrength + aStrength
  const team1 = (remaining * hStrength) / total
  const team2 = remaining - team1
  const round = (n: number) => Math.round(n * 10) / 10
  return {
    team1_win: round(team1),
    draw: drawBase,
    team2_win: round(team2),
    favorite: team1 >= team2 ? home : away,
    confidence: null,
    source: 'stub',
  }
}

export function usePrediction(match: Match | null) {
  const home = match?.homeTeam ?? null
  const away = match?.awayTeam ?? null
  const stage = match?.stageNormalized ?? match?.stage ?? null
  const stadiumId = match?.stadiumId ?? null

  return useQuery({
    queryKey: ['prediction', home, away, stage, stadiumId],
    enabled: Boolean(home && away),
    staleTime: 30 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<UiPrediction> => {
      try {
        const p = await predictMatch({ team1: home!, team2: away!, stage, stadiumId })
        return { ...p, source: 'ml' }
      } catch {
        // API ML éteinte / injoignable -> repli sur le stub local.
        return stubPredict(home!, away!)
      }
    },
  })
}
