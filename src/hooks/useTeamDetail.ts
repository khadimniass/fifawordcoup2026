import { useQuery } from '@tanstack/react-query'
import { getRoster, getTeam } from '../api/zafronix'

export function useTeam(name: string | null) {
  return useQuery({
    queryKey: ['team', name],
    enabled: Boolean(name),
    staleTime: 30 * 60 * 1000,
    queryFn: () => getTeam(name!),
  })
}

export function useRoster(name: string | null, year = 2026) {
  return useQuery({
    queryKey: ['roster', name, year],
    enabled: Boolean(name),
    staleTime: 30 * 60 * 1000,
    queryFn: () => getRoster(name!, year),
  })
}
