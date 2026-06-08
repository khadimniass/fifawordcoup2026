import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchResult, SearchType } from '../api/types'
import { useSearch } from '../hooks/useSearch'
import { useOpenTeam } from '../context/teamModal'
import { Flag } from './Flag'

// Nom d'équipe « propre » à partir d'un résultat (label "France (1930)" -> "France").
const teamName = (r: SearchResult) => r.label.split(' (')[0].trim()

const GROUP_LABEL: Record<SearchType, string> = {
  team: 'Équipes',
  player: 'Joueurs',
  match: 'Matchs',
}

export function SearchBar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const openTeam = useOpenTeam()
  const ref = useRef<HTMLDivElement>(null)
  const { data, isFetching } = useSearch(q)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Regroupe par type et déduplique (l'API renvoie une entrée par édition).
  const grouped = useMemo(() => {
    const out: Record<SearchType, SearchResult[]> = {
      team: [],
      player: [],
      match: [],
    }
    const seen: Record<string, Set<string>> = {
      team: new Set(),
      player: new Set(),
      match: new Set(),
    }
    for (const r of data?.results ?? []) {
      const key = r.type === 'team' ? teamName(r) : r.label
      if (seen[r.type].has(key)) continue
      seen[r.type].add(key)
      out[r.type].push(r)
    }
    return out
  }, [data])

  const hasResults =
    grouped.team.length || grouped.player.length || grouped.match.length

  return (
    <div className="relative w-full sm:w-72" ref={ref}>
      <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 focus-within:border-emerald-400/50">
        <span className="text-white/40">🔍</span>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher équipe, joueur, match…"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 top-full z-40 mt-1 max-h-96 w-80 max-w-[90vw] overflow-y-auto rounded-lg border border-white/10 bg-[#0e1f16] p-2 shadow-2xl shadow-black/50">
          {isFetching && !hasResults && (
            <p className="px-2 py-3 text-sm text-white/40">Recherche…</p>
          )}
          {!isFetching && !hasResults && (
            <p className="px-2 py-3 text-sm text-white/40">Aucun résultat.</p>
          )}

          {(['team', 'player', 'match'] as SearchType[]).map((type) =>
            grouped[type].length ? (
              <div key={type} className="mb-2 last:mb-0">
                <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-white/35">
                  {GROUP_LABEL[type]}
                </div>
                {grouped[type].slice(0, 6).map((r) => {
                  const isTeam = type === 'team'
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={!isTeam}
                      onClick={() => {
                        if (isTeam) {
                          openTeam(teamName(r))
                          setOpen(false)
                          setQ('')
                        }
                      }}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                        isTeam
                          ? 'text-white/85 hover:bg-white/10'
                          : 'cursor-default text-white/55'
                      }`}
                    >
                      {isTeam && <Flag team={teamName(r)} size={20} />}
                      <span className="truncate">{r.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  )
}
