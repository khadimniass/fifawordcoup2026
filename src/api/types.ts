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

// --- Équipes / drapeaux -----------------------------------------------------

export interface Flag {
  iso: string | null
  iso3166_3: string | null
  fifaCode: string | null
  flagUrl: string | null
}

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW'

export interface Coach {
  name: string
  country: string | null
  born: string | null
}

// Une équipe du tournoi 2026 (source : /tournaments/2026 -> teams[]).
export interface Team2026 {
  name: string
  code: string // code FIFA, ex: "FRA"
  iso: string // ISO alpha-2 pour flagcdn, ex: "fr"
  confederation: string
  groupStage: { group: string } & Partial<{
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
    position: number | null
  }>
  knockoutPath: unknown[]
  finalPosition: number | null
  coach: Coach | null
  captain: string | null
}

export interface Tournament2026 {
  schemaVersion: number
  tournament: Record<string, unknown>
  teams: Team2026[]
  meta?: Record<string, unknown>
}

// --- Détail d'une équipe (cross-WC) -----------------------------------------

export interface TeamAppearance {
  year: number
  finalPosition: number | null
  groupStage: Record<string, unknown> | null
  squadSize: number
  goalsScored: number
}

export interface TeamDetail {
  name: string
  flag: Flag
  appearances: TeamAppearance[]
}

export interface RosterPlayer {
  jersey: number
  name: string
  position: PlayerPosition
  born: string | null
  ageAtTournament: number | null
  club: { name: string; country: string | null }
  goals: number
  captain: boolean
}

// --- Infos complémentaires --------------------------------------------------

export interface TriviaItem {
  id: string
  year: number
  category: string
  fact: string
  teams: string[]
}

export interface OnThisDayMatch {
  id: string
  date: string
  year: number
  stage: string
  homeTeam: string
  awayTeam: string
  score: string | null
  stadium: string | null
  city: string | null
  country: string | null
  attendance: number | null
  yearsAgo: number
}

export interface OnThisDayResponse {
  date: string
  monthName: string
  day: number
  counts: { matches: number; tournaments: number; facts: number }
  matches: OnThisDayMatch[]
}

export interface ChampionsResponse {
  byCountry: Record<string, number>
  byDecade: Record<string, { year: number; champion: string }[]>
}

// --- Recherche --------------------------------------------------------------

export type SearchType = 'team' | 'player' | 'match'

export interface SearchResult {
  type: SearchType
  id: string
  label: string
  href: string
  score: number
  preview: Record<string, unknown>
}

export interface SearchResponse {
  query: string
  count: number
  results: SearchResult[]
}
