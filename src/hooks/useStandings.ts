import { useQuery } from '@tanstack/react-query'
import { getStandings } from '../api/zafronix'

export function useStandings(year = 2026) {
  return useQuery({
    queryKey: ['standings', year],
    queryFn: () => getStandings(year),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  })
}
