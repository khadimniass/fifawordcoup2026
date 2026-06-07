import { useQuery } from '@tanstack/react-query'
import { getMatches } from '../api/zafronix'

// Polling toutes les 5 min (cf. stratégie quota README). Les 304 ne coûtent rien.
export function useMatches(year = 2026) {
  return useQuery({
    queryKey: ['matches', year],
    queryFn: () => getMatches(year),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  })
}
