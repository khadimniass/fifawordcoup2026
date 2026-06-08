import { SoccerBall } from './SoccerBall'

// Loader affiché pendant les appels API : ballon qui rebondit + ombre synchro.
export function SoccerBallLoader({
  label = 'Chargement des matchs…',
  size = 80,
}: {
  label?: string
  size?: number
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="relative flex flex-col items-center"
        style={{ height: size + 60 }}
      >
        <div className="ball-bounce" style={{ transformOrigin: 'bottom center' }}>
          <div className="ball-spin">
            <SoccerBall size={size} />
          </div>
        </div>
        <div
          className="ball-shadow mt-1 rounded-[50%] bg-black"
          style={{ width: size * 0.7, height: size * 0.12 }}
        />
      </div>
      <p className="text-sm italic text-white/50">{label}</p>
    </div>
  )
}
