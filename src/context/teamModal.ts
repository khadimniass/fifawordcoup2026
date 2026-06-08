import { createContext, useContext } from 'react'

// Permet à n'importe quel composant (MatchCard, GroupTable, Search) d'ouvrir
// la fiche détaillée d'une équipe, sans prop-drilling.
export const TeamModalContext = createContext<(team: string) => void>(() => {})

export function useOpenTeam() {
  return useContext(TeamModalContext)
}
