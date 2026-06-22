const BASE_URL = "/api";

type Params = Record<string, unknown>;

const buildQuery = (params?: Params): string => {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
};

const request = async <T>(
  method: "GET" | "POST",
  path: string,
  { body, params }: { body?: unknown; params?: Params } = {},
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method,
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
};

const api = {
  get: <T>(path: string, opts?: { params?: Params }) =>
    request<T>("GET", path, opts),
  post: <T>(path: string, body?: unknown) =>
    request<T>("POST", path, { body }),
};

export { api };
