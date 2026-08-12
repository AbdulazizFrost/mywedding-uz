const BASE_URL = import.meta.env.VITE_API_URL || API_URL + '';

const API_URL = import.meta.env.VITE_API_URL || API_URL + '';

/**
 * Минимальный fetch-обёртка. На Шаге 1 используется только
 * для проверки /health — остальные API-модули добавятся позже.
 */
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
