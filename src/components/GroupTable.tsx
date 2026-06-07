import type { StandingRow } from '../api/types'

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-2 py-1.5 text-center font-medium">{children}</th>
}

function GroupCard({ group, rows }: { group: string; rows: StandingRow[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-300">
        Groupe {group}
      </h3>
      <table className="w-full text-sm">
        <thead className="text-[11px] uppercase text-white/40">
          <tr>
            <th className="px-2 py-1.5 text-left font-medium">Équipe</th>
            <Th>J</Th>
            <Th>G</Th>
            <Th>N</Th>
            <Th>P</Th>
            <Th>Diff</Th>
            <Th>Pts</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.team}
              className={`border-t border-white/5 ${i < 2 ? 'text-white' : 'text-white/60'}`}
              title={r.tiebreakerNotes ?? undefined}
            >
              <td className="px-2 py-1.5 text-left">
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${i < 2 ? 'bg-emerald-400' : 'bg-transparent'}`}
                  />
                  {r.team}
                </span>
              </td>
              <td className="px-2 py-1.5 text-center tabular-nums">{r.played}</td>
              <td className="px-2 py-1.5 text-center tabular-nums">{r.won}</td>
              <td className="px-2 py-1.5 text-center tabular-nums">{r.drawn}</td>
              <td className="px-2 py-1.5 text-center tabular-nums">{r.lost}</td>
              <td className="px-2 py-1.5 text-center tabular-nums">
                {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
              </td>
              <td className="px-2 py-1.5 text-center font-semibold tabular-nums">
                {r.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GroupTables({
  groups,
}: {
  groups: Record<string, StandingRow[]>
}) {
  const keys = Object.keys(groups).sort()
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {keys.map((g) => (
        <GroupCard key={g} group={g} rows={groups[g]} />
      ))}
    </div>
  )
}
