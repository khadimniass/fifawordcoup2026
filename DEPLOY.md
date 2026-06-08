# 🚀 Déploiement gratuit (frontend + API ML)

Deux apps, deux hébergeurs gratuits :

| App | Hébergeur | Type |
|---|---|---|
| `world-coupe-2026` (Vite/React) | **Vercel** | site statique |
| `predict_ml` (FastAPI) | **Render** | web service Python |

> Ordre conseillé : **backend d'abord** (pour obtenir son URL) → **frontend** →
> revenir mettre l'URL du frontend dans le CORS du backend.

---

## 0. Mettre le code sur GitHub

```bash
cd /Users/bamba/Documents/code/fifa2026
git init && git add . && git commit -m "WC 2026 dashboard + ML API"
gh repo create fifa2026 --public --source=. --push   # ou via github.com
```

Monorepo (les deux dossiers dans un repo) : Vercel et Render pointeront chacun
vers son sous-dossier via le réglage **Root Directory**.

---

## 1. API ML → Render (gratuit)

1. [render.com](https://render.com) → **New ▸ Web Service** → connecte le repo.
2. Réglages :
   - **Root Directory** : `predict_ml`
   - **Build Command** :
     `pip install -r requirements.txt && python fetch_data.py && python train.py`
   - **Start Command** :
     `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path** : `/health`
3. **Environment** :
   - `PYTHON_VERSION` = `3.12.7`
   - `CORS_ORIGINS` = *(vide pour l'instant, on le remplit à l'étape 3)*
4. **Create Web Service**. Le build télécharge les données + entraîne le modèle
   (~1 min). Note l'URL, ex : `https://wc2026-ml-api.onrender.com`.
5. Vérifie : ouvre `…onrender.com/health` → `{"status":"ok","model_loaded":true}`.

> Un `render.yaml` est fourni pour un déploiement « blueprint » en 1 clic.
> ⚠️ Free tier : le service **s'endort après 15 min d'inactivité** (1er appel
> ensuite ~50 s). Le frontend retombe alors sur le stub le temps du réveil.

---

## 2. Frontend → Vercel (gratuit)

1. [vercel.com](https://vercel.com) → **Add New ▸ Project** → importe le repo.
2. **Root Directory** : `world-coupe-2026` (Vercel détecte Vite tout seul).
3. **Environment Variables** :
   - `VITE_ML_API_URL` = l'URL Render de l'étape 1
   - `VITE_ZAFRONIX_API_KEY` = `zwc_free_76e29d8b3d1531a27d30fe8d`
   - `VITE_ZAFRONIX_BASE_URL` = `https://api.zafronix.com/fifa/worldcup/v1`
4. **Deploy**. Note l'URL, ex : `https://world-coupe-2026.vercel.app`.

> Les variables `VITE_*` sont injectées **au build** : si tu les changes,
> relance un déploiement.

---

## 3. Autoriser le frontend dans le CORS du backend

1. Render → ton service → **Environment** → `CORS_ORIGINS` =
   `https://world-coupe-2026.vercel.app` (l'URL Vercel exacte, sans `/` final).
2. **Save** → Render redéploie. Terminé : les prédictions s'affichent en ligne.

---

## Récapitulatif des variables

| Service | Variable | Valeur |
|---|---|---|
| Render | `PYTHON_VERSION` | `3.12.7` |
| Render | `CORS_ORIGINS` | URL Vercel du frontend |
| Render | `WC_API_KEY` | *(optionnel)* clé Zafronix perso |
| Vercel | `VITE_ML_API_URL` | URL Render du backend |
| Vercel | `VITE_ZAFRONIX_API_KEY` | clé Zafronix |
| Vercel | `VITE_ZAFRONIX_BASE_URL` | base URL Zafronix |

## Alternatives gratuites

- **Frontend** : Netlify, Cloudflare Pages, GitHub Pages (même build `dist/`).
- **Backend** : Hugging Face Spaces (Docker, pas de mise en veille pendant 48 h),
  Fly.io, Koyeb, Railway.
