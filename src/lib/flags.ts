// Résolution nom d'équipe -> code ISO pour flagcdn.
// Nécessaire car l'API mélange deux nommages : /matches & /standings disent
// "Korea Republic" / "Czechia" / "USA" / "Türkiye", tandis que /tournaments/2026
// dit "South Korea" / "Czech Republic" / "United States". On gère aussi les
// nations historiques (palmarès, "à ce jour dans l'histoire") absentes de 2026.

// Normalise une clé : sans accents, minuscules, espaces/ponctuation réduits.
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Clés déjà normalisées -> ISO (alpha-2, ou codes flagcdn gb-eng/gb-sct/...).
const ISO: Record<string, string> = {
  // --- Équipes 2026 (les deux nommages) ---
  mexico: 'mx',
  'south africa': 'za',
  'south korea': 'kr',
  'korea republic': 'kr',
  korea: 'kr',
  'czech republic': 'cz',
  czechia: 'cz',
  canada: 'ca',
  'bosnia and herzegovina': 'ba',
  qatar: 'qa',
  switzerland: 'ch',
  brazil: 'br',
  morocco: 'ma',
  haiti: 'ht',
  scotland: 'gb-sct',
  'united states': 'us',
  usa: 'us',
  paraguay: 'py',
  australia: 'au',
  turkey: 'tr',
  turkiye: 'tr',
  germany: 'de',
  curacao: 'cw',
  'ivory coast': 'ci',
  'cote d ivoire': 'ci',
  ecuador: 'ec',
  netherlands: 'nl',
  japan: 'jp',
  sweden: 'se',
  tunisia: 'tn',
  belgium: 'be',
  egypt: 'eg',
  iran: 'ir',
  'ir iran': 'ir',
  'new zealand': 'nz',
  spain: 'es',
  'cape verde': 'cv',
  'saudi arabia': 'sa',
  uruguay: 'uy',
  france: 'fr',
  senegal: 'sn',
  iraq: 'iq',
  norway: 'no',
  argentina: 'ar',
  algeria: 'dz',
  austria: 'at',
  jordan: 'jo',
  portugal: 'pt',
  'dr congo': 'cd',
  'congo dr': 'cd',
  'democratic republic of the congo': 'cd',
  uzbekistan: 'uz',
  colombia: 'co',
  england: 'gb-eng',
  croatia: 'hr',
  ghana: 'gh',
  panama: 'pa',

  // --- Nations historiques / autres participants WC ---
  italy: 'it',
  'west germany': 'de',
  'east germany': 'de',
  'soviet union': 'ru',
  ussr: 'ru',
  russia: 'ru',
  czechoslovakia: 'cz',
  yugoslavia: 'rs',
  serbia: 'rs',
  'serbia and montenegro': 'rs',
  wales: 'gb-wls',
  'northern ireland': 'gb-nir',
  'republic of ireland': 'ie',
  ireland: 'ie',
  hungary: 'hu',
  poland: 'pl',
  romania: 'ro',
  bulgaria: 'bg',
  greece: 'gr',
  denmark: 'dk',
  finland: 'fi',
  ukraine: 'ua',
  slovenia: 'si',
  slovakia: 'sk',
  chile: 'cl',
  peru: 'pe',
  bolivia: 'bo',
  venezuela: 've',
  'costa rica': 'cr',
  honduras: 'hn',
  'el salvador': 'sv',
  jamaica: 'jm',
  'trinidad and tobago': 'tt',
  cuba: 'cu',
  cameroon: 'cm',
  nigeria: 'ng',
  angola: 'ao',
  togo: 'tg',
  zaire: 'cd',
  congo: 'cg',
  kenya: 'ke',
  israel: 'il',
  china: 'cn',
  'china pr': 'cn',
  'north korea': 'kp',
  'korea dpr': 'kp',
  indonesia: 'id',
  'dutch east indies': 'id',
  india: 'in',
  'united arab emirates': 'ae',
  uae: 'ae',
  kuwait: 'kw',
  bahrain: 'bh',
  thailand: 'th',
}

export function resolveIso(name: string | null | undefined): string | null {
  if (!name) return null
  return ISO[norm(name)] ?? null
}

export function flagUrl(
  name: string | null | undefined,
  size: 20 | 40 | 80 | 160 = 40,
): string | null {
  const iso = resolveIso(name)
  return iso ? `https://flagcdn.com/w${size}/${iso}.png` : null
}
