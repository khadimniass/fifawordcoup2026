import { useEffect, useMemo, useState } from 'react'
import { useChampions, useTrivia } from '../hooks/useInfo'

interface Fact {
  text: string
  tag: string
}

// Faits curatés (FR) pour étoffer la rotation au-delà des 2 faits de l'API.
const CURATED: Fact[] = [
  {
    text: 'La finale 2026 se jouera au MetLife Stadium (New Jersey) le 19 juillet 2026.',
    tag: 'Finale',
  },
  {
    text: 'Le Brésil est la seule nation à avoir participé à toutes les éditions de la Coupe du Monde.',
    tag: 'Record',
  },
  {
    text: "L'Estadio Azteca (Mexico) est le seul stade à accueillir trois Coupes du Monde : 1970, 1986 et 2026.",
    tag: 'Stades',
  },
  {
    text: 'Miroslav Klose détient le record de buts en phase finale de Coupe du Monde, avec 16 réalisations.',
    tag: 'Buteurs',
  },
  {
    text: 'Just Fontaine reste le recordman de buts sur une seule édition : 13 buts en 1958.',
    tag: 'Buteurs',
  },
  {
    text: "2026 accueille 48 équipes et 104 matchs, contre 32 équipes et 64 matchs en 2022.",
    tag: 'Format',
  },
]

// Fait aléatoire en rotation toutes les 8s, avec transition en fondu.
export function TriviaCard() {
  const { data: trivia } = useTrivia(2026)
  const { data: champions } = useChampions()
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  const facts = useMemo<Fact[]>(() => {
    const list: Fact[] = []
    for (const t of trivia ?? []) list.push({ text: t.fact, tag: t.category })
    if (champions) {
      const ranked = Object.entries(champions.byCountry).sort(
        (a, b) => b[1] - a[1],
      )
      if (ranked[0]) {
        list.push({
          text: `${ranked[0][0]} détient le record de sacres mondiaux : ${ranked[0][1]} titres.`,
          tag: 'Palmarès',
        })
      }
      const total = Object.values(champions.byCountry).reduce((a, b) => a + b, 0)
      list.push({
        text: `${Object.keys(champions.byCountry).length} nations différentes se sont partagé les ${total} Coupes du Monde de l'histoire.`,
        tag: 'Palmarès',
      })
    }
    list.push(...CURATED)
    return list
  }, [trivia, champions])

  useEffect(() => {
    if (facts.length <= 1) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % facts.length)
        setVisible(true)
      }, 400)
    }, 8000)
    return () => clearInterval(id)
  }, [facts.length])

  if (facts.length === 0) return null
  const item = facts[idx % facts.length]

  return (
    <div className="relative z-10 rounded-xl border border-white/10 bg-[#162216]/80 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-300">
          Le saviez-vous ?
        </h3>
        <div className="flex gap-1">
          {facts.slice(0, 8).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full transition ${i === idx % Math.min(facts.length, 8) ? 'bg-emerald-400' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
      <div
        className="min-h-[4.5rem] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="text-sm leading-relaxed text-white/80">
          <span className="mr-1">⚽</span>
          {item.text}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wide text-white/35">
          {item.tag}
        </p>
      </div>
    </div>
  )
}
