// Types des réponses de l'API Zafronix WC — dérivés des réponses réelles.

export interface Referee {
  name: string
  country: string
}

export interface Match {
  id: string
  matchNo: number
  date: string // YYYY-MM-DD
  kickoff: string // HH:MM (heure locale du stade)
  kickoffUtc: string // ISO 8601
  timezone: string
  stage: string // brut, ex: "group_a", "r32"
  stageNormalized: string | null // ex: "group_a", "round_of_32", "final"
  homeTeam: string | null
  awayTeam: string | null
  homeRef: string | null // placeholder bracket, ex: "2A", "1E"
  awayRef: string | null
  homeScore: number | null
  awayScore: number | null
  result: string | null // ex: "4-1"
  extraTime: boolean
  penalties: string | null
  stadium: string
  stadiumId: string
  city: string
  country: string
  attendance: number | null
  referee: Referee | null
  weather: string | null
}

export interface MatchesResponse {
  year: number
  count: number
  data: Match[]
}

export interface StandingRow {
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  position: number | null
  tiebreakerNotes: string | null
  advanced?: boolean
}

export interface StandingsResponse {
  year: number
  groups: Record<string, StandingRow[]> // "A".."L"
}

export interface BracketMatch {
  matchId: string
  matchNo: number
  stage: string
  stageRaw: string
  homeRef: string | null
  awayRef: string | null
  home: string | null
  away: string | null
  kickoffUtc: string
  stadium: string
  city: string
  homeScore: number | null
  awayScore: number | null
  winner: string | null
  loser: string | null
}

export interface BracketResponse {
  year: number
  stages: Record<string, BracketMatch[]>
}

export interface Tournament {
  year: number
  host: string[]
  champion: string
  file: string
}

// Sortie du modèle ML (API non encore implémentée — stub côté frontend).
export interface Prediction {
  team1_win: number
  draw: number
  team2_win: number
}
