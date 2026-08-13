const API_URL = window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`);
const BASE_URL = API_URL;

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
