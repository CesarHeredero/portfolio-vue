const API_BASE = (process.env.VUE_APP_CONTENT_API_BASE || "").replace(/\/+$/, "");

const buildUrl = (path) => {
  if (!API_BASE) return null;
  const cleanPath = String(path).replace(/^\/+/, "");
  return `${API_BASE}/${cleanPath}`;
};

const fetchJson = async (path) => {
  const url = buildUrl(path);
  if (!url) {
    return null;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error cargando ${path}`);
  }
  return response.json();
};

export const intranetApi = {
  hasApi: Boolean(API_BASE),
  get: fetchJson,
};
