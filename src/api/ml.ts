// Client de l'API ML de prédiction (FastAPI, projet predict_ml).
// Le modèle est entraîné sur des noms openfootball ; les matchs 2026 (Zafronix)
// utilisent parfois d'autres libellés -> on normalise avant l'appel.

const BASE = import.meta.env.VITE_ML_API_URL as string

function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// nom 2026/Zafronix (normalisé) -> nom connu du modèle (openfootball).
const ALIAS: Record<string, string> = {
  'korea republic': 'South Korea',
  'south korea': 'South Korea',
  usa: 'United States',
  'united states': 'United States',
  czechia: 'Czech Republic',
  'czech republic': 'Czech Republic',
  'bosnia and herzegovina': 'Bosnia-Herzegovina',
  'ir iran': 'Iran',
  turkiye: 'Turkey',
  'ivory coast': "Côte d'Ivoire",
  'cote d ivoire': "Côte d'Ivoire",
}

export function mlTeamName(name: string): string {
  return ALIAS[norm(name)] ?? name
}

export interface MlPrediction {
  team1_win: number
  draw: number
  team2_win: number
  favorite: string
  confidence: 'low' | 'medium' | 'high'
}

export async function predictMatch(req: {
  team1: string
  team2: string
  stage?: string | null
  stadiumId?: string | null
}): Promise<MlPrediction> {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      team1: mlTeamName(req.team1),
      team2: mlTeamName(req.team2),
      stage: req.stage ?? null,
      stadiumId: req.stadiumId ?? null,
    }),
  })
  if (!res.ok) throw new Error(`ML API ${res.status}`)
  return res.json()
}
