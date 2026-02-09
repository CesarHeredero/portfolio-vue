const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ : null;
const API_BASE = (
  (runtimeConfig && runtimeConfig.CONTENT_API_BASE) ||
  process.env.VUE_APP_CONTENT_API_BASE ||
  ""
).replace(/\/+$/, "");

const buildUrl = (path) => {
  if (!API_BASE) return null;
  const cleanPath = String(path).replace(/^\/+/, "");
  return `${API_BASE}/${cleanPath}`;
};

const fetchJson = async (path) => {
  const baseUrl = buildUrl(path);
  if (!baseUrl) {
    return null;
  }
  const url = new URL(baseUrl);
  url.searchParams.set("_t", Date.now().toString());
  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Error cargando ${path}`);
  }
  return response.json();
};

export const intranetApi = {
  hasApi: Boolean(API_BASE),
  get: fetchJson,
};
