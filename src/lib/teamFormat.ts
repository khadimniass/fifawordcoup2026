import type { PlayerPosition, TeamAppearance } from '../api/types'

// finalPosition (rang final dans l'édition) -> libellé lisible.
export function positionLabel(pos: number | null): string {
  if (pos == null) return 'En cours'
  if (pos === 1) return 'Champion 🏆'
  if (pos === 2) return 'Finaliste'
  if (pos === 3) return '3e place'
  if (pos === 4) return '4e place'
  if (pos <= 8) return 'Quart de finale'
  if (pos <= 16) return 'Huitièmes de finale'
  return 'Phase de groupes'
}

export const POSITION_ORDER: Record<PlayerPosition, number> = {
  GK: 0,
  DF: 1,
  MF: 2,
  FW: 3,
}

export const POSITION_STYLE: Record<PlayerPosition, string> = {
  GK: 'bg-amber-400/20 text-amber-300',
  DF: 'bg-sky-400/20 text-sky-300',
  MF: 'bg-emerald-400/20 text-emerald-300',
  FW: 'bg-red-400/20 text-red-300',
}

export function bestResult(appearances: TeamAppearance[]): number | null {
  const valid = appearances
    .map((a) => a.finalPosition)
    .filter((p): p is number => p != null)
  return valid.length ? Math.min(...valid) : null
}
