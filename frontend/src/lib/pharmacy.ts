/**
 * Enlaces de compra a las tiendas reales de cada farmacia.
 *
 * Los precios del comparador son referenciales (mock); este helper construye el
 * enlace al buscador real de la cadena para que el usuario pueda comprar. Para las
 * cadenas cuyo buscador no está confirmado se usa una búsqueda de Google que aterriza
 * igualmente en su sitio, de modo que ningún botón quede sin destino.
 */

// Plantilla de búsqueda por farmacia ({q} = término del medicamento).
const SEARCH_URL: Record<string, string> = {
  Inkafarma: 'https://inkafarma.pe/buscador?keyword={q}',
  Mifarma: 'https://www.mifarma.com.pe/buscador?keyword={q}',
}

/** Cadenas de farmacias reales para búsquedas libres (fuera del catálogo). */
export const PHARMACIES: string[] = [
  'Inkafarma',
  'Mifarma',
  'Boticas BTL',
  'Boticas Perú',
  'Farmacias Universal',
]

export function buyUrl(farmacia: string, medicamento: string): string {
  const tpl = SEARCH_URL[farmacia]
  if (tpl) return tpl.replace('{q}', encodeURIComponent(medicamento))
  return 'https://www.google.com/search?q=' + encodeURIComponent(`${medicamento} ${farmacia} Perú comprar`)
}
