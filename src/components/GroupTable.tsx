import type { StandingRow } from '../api/types'
import { useOpenTeam } from '../context/teamModal'
import { Flag } from './Flag'

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-1.5 py-1.5 text-center font-medium">{children}</th>
}

export function GroupCard({
  group,
  rows,
}: {
  group: string
  rows: StandingRow[]
}) {
  const openTeam = useOpenTeam()
  return (
    <div className="relative z-10 rounded-xl border border-white/10 bg-[#162216]/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-300">
        Groupe {group}
      </h3>
      <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full min-w-[20rem] text-sm">
        <thead className="text-[11px] uppercase text-white/40">
          <tr>
            <th className="px-1.5 py-1.5 text-left font-medium">Équipe</th>
            <Th>J</Th>
            <Th>G</Th>
            <Th>N</Th>
            <Th>P</Th>
            <Th>BP</Th>
            <Th>BC</Th>
            <Th>Diff</Th>
            <Th>Pts</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const advanced = r.advanced ?? i < 2
            return (
              <tr
                key={r.team}
                className={`border-t border-white/5 ${advanced ? 'bg-emerald-500/5 text-white' : 'text-white/60'}`}
                title={r.tiebreakerNotes ?? undefined}
              >
                <td className="px-1.5 py-1.5 text-left">
                  <button
                    type="button"
                    onClick={() => openTeam(r.team)}
                    className="flex items-center gap-2 hover:text-emerald-300"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${advanced ? 'bg-emerald-400' : 'bg-transparent'}`}
                    />
                    <Flag team={r.team} size={20} />
                    <span className="truncate hover:underline">{r.team}</span>
                  </button>
                </td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.played}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.won}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.drawn}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.lost}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.goalsFor}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">{r.goalsAgainst}</td>
                <td className="px-1.5 py-1.5 text-center tabular-nums">
                  {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
                </td>
                <td className="px-1.5 py-1.5 text-center font-semibold tabular-nums">
                  {r.points}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}
