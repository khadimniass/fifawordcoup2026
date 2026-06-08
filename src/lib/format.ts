// Helpers de présentation (libellés de stage, dates) pour l'UI.

const STAGE_LABELS: Record<string, string> = {
  round_of_32: '16es de finale',
  round_of_16: '8es de finale',
  quarter_final: 'Quarts de finale',
  semi_final: 'Demi-finales',
  third_place: 'Match pour la 3e place',
  final: 'Finale',
}

export function stageLabel(stage: string | null): string {
  if (!stage) return 'À déterminer'
  if (stage.startsWith('group_')) return `Groupe ${stage.slice(6).toUpperCase()}`
  return STAGE_LABELS[stage] ?? stage
}

export function groupKey(stage: string | null): string | null {
  if (stage?.startsWith('group_')) return stage.slice(6).toUpperCase()
  return null
}

// Date affichée en UTC (GMT+0) pour homogénéiser tous les fuseaux des stades.
const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

// Heure affichée en UTC (GMT+0).
const TIME_FMT = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
})

// Date du coup d'envoi en GMT+0, dérivée de kickoffUtc.
export function formatMatchDate(kickoffUtc: string): string {
  return DATE_FMT.format(new Date(kickoffUtc))
}

// Heure du coup d'envoi en GMT+0 (suffixe "GMT").
export function formatKickoffTime(kickoffUtc: string): string {
  return `${TIME_FMT.format(new Date(kickoffUtc))} GMT`
}

export type MatchStatus = 'upcoming' | 'live' | 'finished'

// Statut dérivé : pas de champ "status" dans l'API → on l'infère du score + kickoff.
export function matchStatus(
  hasScore: boolean,
  kickoffUtc: string,
  now: number,
): MatchStatus {
  const kickoff = new Date(kickoffUtc).getTime()
  if (hasScore) {
    // ~2h après le coup d'envoi on considère le match terminé.
    return now > kickoff + 2 * 60 * 60 * 1000 ? 'finished' : 'live'
  }
  return now >= kickoff && now < kickoff + 2 * 60 * 60 * 1000 ? 'live' : 'upcoming'
}
