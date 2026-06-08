import { useChampions } from '../hooks/useInfo'
import { Flag } from './Flag'

// Palmarès : nations championnes triées par nombre de titres décroissant.
export function ChampionsBar() {
  const { data } = useChampions()
  if (!data) return null

  const ranked = Object.entries(data.byCountry).sort((a, b) => b[1] - a[1])

  return (
    <div className="relative z-10 rounded-xl border border-white/10 bg-[#162216]/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-300">Palmarès</h3>
      <div className="flex flex-wrap gap-2">
        {ranked.map(([country, titles]) => (
          <span
            key={country}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-2.5 text-sm"
            title={`${country} — ${titles} titre${titles > 1 ? 's' : ''}`}
          >
            <Flag team={country} size={20} />
            <span className="text-white/80">{country}</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 text-xs font-semibold text-emerald-300">
              {titles}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
