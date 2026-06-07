import { useQuery } from '@tanstack/react-query'
import type { Match, Prediction } from '../api/types'

// L'API ML (FastAPI/XGBoost) décrite dans le README n'est pas encore déployée.
// En attendant, on génère une prédiction *stub* déterministe à partir des noms
// d'équipes, pour pouvoir construire et valider l'UI du badge de prédiction.
// À remplacer par un fetch vers VITE_ML_API_URL une fois l'API ML disponible.

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function stubPredict(home: string, away: string): Prediction {
  const hStrength = (hash(home) % 60) + 40 // 40..99
  const aStrength = (hash(away) % 60) + 40
  const drawBase = 22 + (hash(home + away) % 10) // 22..31
  const remaining = 100 - drawBase
  const total = hStrength + aStrength
  const team1 = (remaining * hStrength) / total
  const team2 = remaining - team1
  const round = (n: number) => Math.round(n * 10) / 10
  return { team1_win: round(team1), draw: drawBase, team2_win: round(team2) }
}

export function usePrediction(match: Match | null) {
  const home = match?.homeTeam ?? null
  const away = match?.awayTeam ?? null
  return useQuery({
    queryKey: ['prediction', home, away],
    enabled: Boolean(home && away),
    staleTime: Infinity,
    queryFn: async (): Promise<Prediction> => stubPredict(home!, away!),
  })
}
