// Client de l'API Zafronix WC : fetch + cache mémoire ETag.
// Les réponses 304 (Not Modified) ne décrémentent pas le quota (250 req/jour).

import type {
  BracketResponse,
  ChampionsResponse,
  MatchesResponse,
  OnThisDayResponse,
  RosterPlayer,
  SearchResponse,
  SearchType,
  StandingsResponse,
  TeamDetail,
  Tournament,
  Tournament2026,
  TriviaItem,
} from './types'

const BASE = import.meta.env.VITE_ZAFRONIX_BASE_URL as string
const KEY = import.meta.env.VITE_ZAFRONIX_API_KEY as string

// Cache ETag + dernière réponse par path, pour réutiliser le corps sur un 304.
const cache: Record<string, { etag: string; body: unknown }> = {}

export class ZafronixError extends Error {
  status: number
  path: string
  retryAfter: number | null // secondes, renseigné sur un 429
  constructor(
    status: number,
    path: string,
    message?: string,
    retryAfter: number | null = null,
  ) {
    super(message ?? `Zafronix ${status} sur ${path}`)
    this.name = 'ZafronixError'
    this.status = status
    this.path = path
    this.retryAfter = retryAfter
  }
}

export async function zafronixFetch<T>(path: string): Promise<T> {
  if (!BASE || !KEY) {
    throw new ZafronixError(
      0,
      path,
      'Configuration manquante : définir VITE_ZAFRONIX_BASE_URL et VITE_ZAFRONIX_API_KEY dans .env',
    )
  }

  const headers: HeadersInit = { 'X-API-Key': KEY }
  const cached = cache[path]
  if (cached) headers['If-None-Match'] = cached.etag

  const res = await fetch(`${BASE}${path}`, { headers })

  // 304 : rien n'a changé, on renvoie le corps mis en cache (quota épargné).
  if (res.status === 304 && cached) return cached.body as T

  if (!res.ok) {
    let message: string | undefined
    try {
      const err = (await res.json()) as { message?: string }
      message = err.message
    } catch {
      /* corps non-JSON, on garde le message par défaut */
    }
    // 429 : quota atteint → exposer le délai du header Retry-After.
    if (res.status === 429) {
      const ra = Number(res.headers.get('Retry-After'))
      const retryAfter = Number.isFinite(ra) && ra > 0 ? ra : 60
      throw new ZafronixError(
        429,
        path,
        `Quota API atteint, réessai dans ${retryAfter}s`,
        retryAfter,
      )
    }
    throw new ZafronixError(res.status, path, message)
  }

  const body = (await res.json()) as T
  const etag = res.headers.get('ETag')
  if (etag) cache[path] = { etag, body }

  return body
}

export const getTournaments = () => zafronixFetch<Tournament[]>('/tournaments')

export const getMatches = (year = 2026) =>
  zafronixFetch<MatchesResponse>(`/matches?year=${year}`)

export const getStandings = (year = 2026) =>
  zafronixFetch<StandingsResponse>(`/standings?year=${year}`)

export const getBracket = (year = 2026) =>
  zafronixFetch<BracketResponse>(`/bracket?year=${year}`)

export const getTournament2026 = () =>
  zafronixFetch<Tournament2026>('/tournaments/2026')

export const getTeam = (name: string) =>
  zafronixFetch<TeamDetail>(`/teams/${encodeURIComponent(name)}`)

export const getRoster = (name: string, year = 2026) =>
  zafronixFetch<RosterPlayer[]>(
    `/teams/${encodeURIComponent(name)}/roster?year=${year}`,
  )

export const getTrivia = (year = 2026) =>
  zafronixFetch<TriviaItem[]>(`/trivia?year=${year}`)

export const getOnThisDay = () =>
  zafronixFetch<OnThisDayResponse>('/on-this-day')

export const getChampions = () =>
  zafronixFetch<ChampionsResponse>('/aggregates/champions')

export const search = (query: string, types: SearchType[]) =>
  zafronixFetch<SearchResponse>(
    `/search?q=${encodeURIComponent(query)}&types=${types.join(',')}`,
  )
