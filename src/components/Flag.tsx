import { flagUrl } from '../lib/flags'

// Drapeau d'une équipe via flagcdn (autorisé par la CSP de l'API).
// Résolution par table d'alias (gère les conflits de nommage de l'API et les
// nations historiques). Placeholder neutre si le pays est inconnu.
export function Flag({
  team,
  size = 40,
  className = '',
}: {
  team: string | null
  size?: 20 | 40 | 80 | 160
  className?: string
}) {
  const url = flagUrl(team, size)
  const w = size === 20 ? 'w-5' : size === 80 ? 'w-10' : 'w-6'

  if (!url) {
    return (
      <span
        className={`${w} aspect-[3/2] shrink-0 rounded-sm bg-white/10 ${className}`}
        title={team ?? undefined}
        aria-hidden
      />
    )
  }
  return (
    <img
      src={url}
      alt={team ?? ''}
      loading="lazy"
      className={`${w} aspect-[3/2] shrink-0 rounded-sm object-cover ring-1 ring-black/20 ${className}`}
    />
  )
}
