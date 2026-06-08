import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { search } from '../api/zafronix'
import type { SearchType } from '../api/types'

const TYPES: SearchType[] = ['team', 'player', 'match']

// Recherche avec debounce 300ms ; ne lance la requête qu'à partir de 2 caractères.
export function useSearch(query: string) {
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(id)
  }, [query])

  return useQuery({
    queryKey: ['search', debounced],
    enabled: debounced.length >= 2,
    staleTime: 5 * 60 * 1000,
    queryFn: () => search(debounced, TYPES),
  })
}
