# 🏆 FIFA World Cup 2026 — Dashboard & Prédictions IA

Interface web listant tous les matchs de la Coupe du Monde 2026 avec prédictions alimentées par un modèle entraîné sur l'historique des CdM (1930→2026).

---

## Stack technique

| Couche | Techno |
|---|---|
| Frontend | React 18 + TypeScript (Vite) |
| Styles | Tailwind CSS |
| State / Data fetching | React Query (TanStack Query) |
| ML / Prédictions | Python · FastAPI · XGBoost |
| Données live | Zafronix WC API |
| Données backup | football-data.org |
| Données historiques (ML training) | Zafronix WC API (1930→2022) |
| Conteneurisation | Docker + docker-compose |

---

## Initialisation du projet

```bash
npm create vite@latest world-coupe-2026 -- --template react-ts
cd world-coupe-2026
npm install
```

---

## Sources de données

### 1. Zafronix WC API *(principale — matchs live + historique ML)*

> Couvre tous les WC de 1930 à 2026 : matchs, équipes, joueurs, stades, brackets, classements.

```
Base URL   : https://api.zafronix.com/fifa/worldcup/v1
Auth Header: X-API-Key: zwc_free_76e29d8b3d1531a27d30fe8d
Free tier  : 250 req/jour
```

**Endpoints utilisés dans ce projet :**

| Endpoint | Usage |
|---|---|
| `GET /tournaments` | Liste tous les WC (1930→2026) |
| `GET /tournaments/2026` | Données complètes WC 2026 (équipes, groupes) |
| `GET /matches?year=2026` | 104 matchs WC 2026 avec scores |
| `GET /matches?year=2026&stage=group_a` | Filtrer par groupe |
| `GET /matches?year=YYYY` | Données historiques pour le ML |
| `GET /standings?year=2026` | Classements groupes en temps réel |
| `GET /bracket?year=2026` | Tableau phase finale |
| `GET /teams/{name}` | Stats cross-WC d'une équipe |
| `GET /teams/{name}/roster?year=2026` | Effectif d'une équipe |
| `GET /players/{name}` | Carrière d'un joueur en WC |

**Filtres disponibles sur `/matches` :**

```
?year=2026
?stage=group_a | group_b | ... | r32 | r16 | qf | sf | third_place | final
?team=France
?denormalize=true   # embed les détails du stade inline
```

**Rate limiting — headers à surveiller :**

```
X-RateLimit-Limit      # quota journalier
X-RateLimit-Remaining  # requêtes restantes
X-RateLimit-Reset      # epoch seconds du prochain reset
```

> ⚡ Les réponses `304 Not Modified` (ETag) ne décrément pas le quota — utiliser agressivement.

---

### 2. football-data.org *(backup)*

```
Base URL   : https://api.football-data.org/v4
Auth Header: X-Auth-Token: 69a6d33333f4479a827211c470030115
Free tier  : 10 req/min
WC code    : WC
```

| Endpoint | Usage |
|---|---|
| `GET /competitions/WC/matches` | Tous les matchs WC 2026 |
| `GET /competitions/WC/standings` | Classements groupes |
| `GET /competitions/WC/teams` | 48 équipes |

---

### 3. openfootball/worldcup.json *(dataset ML statique)*

> Domaine public, aucune clé. Utilisé uniquement pour le training ML.

```
https://raw.githubusercontent.com/openfootball/worldcup.json/master/2022/worldcup.json
https://raw.githubusercontent.com/openfootball/worldcup.json/master/2018/worldcup.json
https://raw.githubusercontent.com/openfootball/worldcup.json/master/2014/worldcup.json
```

---

## Variables d'environnement

Créer `.env` à la racine du projet Vite :

```env
# Zafronix WC API (principale)
VITE_ZAFRONIX_API_KEY=zwc_free_76e29d8b3d1531a27d30fe8d
VITE_ZAFRONIX_BASE_URL=https://api.zafronix.com/fifa/worldcup/v1

# ML API (FastAPI)
VITE_ML_API_URL=http://localhost:8000
```

> ⚠️ Avec Vite, seules les variables préfixées `VITE_` sont exposées au navigateur.

**football-data.org ne doit pas être appelé depuis le navigateur** (clé exposée + CORS).
Passer par un proxy — voir section ML API ci-dessous.

---

## Architecture du projet

```
world-coupe-2026/
├── src/
│   ├── api/
│   │   ├── zafronix.ts       # Client Zafronix (fetch + ETag cache)
│   │   └── types.ts          # Types TypeScript des réponses API
│   ├── components/
│   │   ├── MatchCard.tsx      # Carte d'un match
│   │   ├── MatchList.tsx      # Liste filtrée des matchs
│   │   ├── GroupTable.tsx     # Tableau de groupe
│   │   ├── Bracket.tsx        # Tableau phase finale
│   │   └── PredictionBadge.tsx # Badge prédiction IA
│   ├── pages/
│   │   ├── Home.tsx           # Matchs du jour
│   │   ├── Matches.tsx        # Tous les matchs
│   │   ├── Groups.tsx         # Classements groupes
│   │   └── Bracket.tsx        # Phase finale
│   ├── hooks/
│   │   ├── useMatches.ts      # React Query → Zafronix /matches
│   │   ├── useStandings.ts    # React Query → Zafronix /standings
│   │   └── usePrediction.ts   # React Query → ML API
│   ├── App.tsx
│   └── main.tsx
│
├── ml-api/                    # FastAPI Python (dossier séparé)
│   ├── main.py
│   ├── train.py
│   ├── features.py
│   ├── model.pkl              # généré par train.py
│   └── data/                 # JSONs historiques
│
├── .env
├── docker-compose.yml
├── vite.config.ts
└── README.md
```

---

## Client API Zafronix

```typescript
// src/api/zafronix.ts
const BASE = import.meta.env.VITE_ZAFRONIX_BASE_URL
const KEY  = import.meta.env.VITE_ZAFRONIX_API_KEY

const etagCache: Record<string, string> = {}

export async function zafronixFetch<T>(path: string): Promise<T | null> {
  const headers: HeadersInit = { 'X-API-Key': KEY }
  if (etagCache[path]) headers['If-None-Match'] = etagCache[path]

  const res = await fetch(`${BASE}${path}`, { headers })

  if (res.status === 304) return null               // pas de changement, quota épargné
  if (!res.ok) throw new Error(`${res.status} ${path}`)

  const etag = res.headers.get('ETag')
  if (etag) etagCache[path] = etag

  return res.json()
}

// Exemples d'utilisation
export const getMatches  = (year = 2026) => zafronixFetch(`/matches?year=${year}`)
export const getStandings = (year = 2026) => zafronixFetch(`/standings?year=${year}`)
export const getBracket  = (year = 2026) => zafronixFetch(`/bracket?year=${year}`)
```

---

## Modèle ML — Prédictions

### Features

```python
features = [
    "team1_fifa_ranking",
    "team2_fifa_ranking",
    "team1_goals_avg_last5",
    "team2_goals_avg_last5",
    "team1_wins_last5",
    "team2_wins_last5",
    "h2h_wins_team1",
    "h2h_wins_team2",
    "h2h_draws",
    "is_knockout",
    "stadium_elevation_m",    # via Zafronix /stadiums
]
```

### Output

```json
{
  "team1_win": 48.3,
  "draw": 27.1,
  "team2_win": 24.6
}
```

### Dataset

- **Source :** Zafronix `GET /matches?year={Y}` — boucle 1930→2022
- **Volume :** ~1 068 matchs
- **Modèle :** XGBoost (classification 3 classes)

---

## Démarrage

```bash
# Frontend
cd world-coupe-2026
npm install
npm run dev           # → http://localhost:5173

# ML API
cd ml-api
pip install -r requirements.txt
python train.py       # génère model.pkl
uvicorn main:app --reload  # → http://localhost:8000

# Tout en même temps
docker-compose up
```

---

## Limites free tier

| API | Limite | Stratégie |
|---|---|---|
| Zafronix | 250 req/jour | ETags + cache mémoire + polling 5 min |
| football-data.org | 10 req/min | Proxy backend uniquement |

---

## Références

- [Zafronix WC API Docs](https://api.zafronix.com/docs)
- [Zafronix WC Explorer (démo live)](https://api.zafronix.com/wc-explorer/)
- [football-data.org Docs](https://www.football-data.org/documentation/quickstart)
- [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json)
