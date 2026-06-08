export type FilterType =
  | 'all'
  | `group_${string}`
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final'

const GROUPS = 'ABCDEFGHIJKL'.split('')

// Stages éliminatoires affichés en pills (valeur = stageNormalized de l'API).
const KO: { value: FilterType; label: string }[] = [
  { value: 'round_of_32', label: '16es' },
  { value: 'round_of_16', label: '8es' },
  { value: 'quarter_final', label: 'Quarts' },
  { value: 'semi_final', label: 'Demies' },
  { value: 'third_place', label: '3e place' },
  { value: 'final', label: 'Finale' },
]

function pill(active: boolean, accent = false) {
  return [
    'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
    active
      ? 'bg-emerald-500 text-white'
      : accent
        ? 'bg-white/[0.06] text-white/80 hover:bg-white/10'
        : 'border border-white/20 bg-transparent text-white/70 hover:border-white/40 hover:text-white',
  ].join(' ')
}

export function MatchFilters({
  activeFilter,
  onFilterChange,
  totalMatches,
}: {
  activeFilter: FilterType
  onFilterChange: (f: FilterType) => void
  totalMatches: number
}) {
  return (
    <div className="mb-6 space-y-3">
      {/* Phases */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <button
          type="button"
          className={pill(activeFilter === 'all')}
          onClick={() => onFilterChange('all')}
        >
          Tous ({totalMatches})
        </button>
        {KO.map((k) => (
          <button
            key={k.value}
            type="button"
            className={pill(activeFilter === k.value)}
            onClick={() => onFilterChange(k.value)}
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Groupes — liste complète, toujours visible */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
          Groupes
        </div>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const val = `group_${g.toLowerCase()}` as FilterType
            return (
              <button
                key={g}
                type="button"
                className={pill(activeFilter === val, true)}
                onClick={() => onFilterChange(val)}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
