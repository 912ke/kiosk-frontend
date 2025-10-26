const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (typeof window !== "undefined" ? window.location.origin : "");

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers||{}) } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json() as Promise<T>;
}

export async function getCatalog() {
  return json(`${API_BASE}/api/catalog`);
}
export async function getHosts(params = new URLSearchParams()) {
  return json(`${API_BASE}/api/hosts?${params}`);
}
export async function getSlots(params: Record<string,string|number>) {
  const qp = new URLSearchParams(Object.entries(params).map(([k,v]) => [k, String(v)]));
  return json(`${API_BASE}/api/slots?${qp.toString()}`);
}
export async function createBooking(body: any) {
  return json(`${API_BASE}/api/book`, { method: "POST", body: JSON.stringify(body) });
}
