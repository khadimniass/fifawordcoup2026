import { useQuery } from '@tanstack/react-query'
import { getChampions, getOnThisDay, getTrivia } from '../api/zafronix'

export function useTrivia(year = 2026) {
  return useQuery({
    queryKey: ['trivia', year],
    staleTime: 60 * 60 * 1000,
    queryFn: () => getTrivia(year),
  })
}

export function useOnThisDay() {
  return useQuery({
    queryKey: ['on-this-day'],
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: getOnThisDay,
  })
}

export function useChampions() {
  return useQuery({
    queryKey: ['champions'],
    staleTime: 24 * 60 * 60 * 1000,
    queryFn: getChampions,
  })
}
