
const API_URL = process.env.API_URL

export function rest<T>(
  url: string,
  data?: any,
  method?: string,
  headers?: Record<string, string>
): Promise<T> {
  return fetch(url, {
    method: method ?? (data ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: data ? JSON.stringify(data) : undefined
  }).then((x) => x.json())
}

export function api<T>(url: string, data?: any, method?: string): Promise<T> {
  return rest<T>(API_URL + url, data, method)
}
