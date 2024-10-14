import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ApiOptions {
  body?: any,
  headers?: { [key: string]: string },
  pathParams?: { [key: string]: string },
  queryParams?: { [key: string]: string }
}

export function useApi<T>(path: string, defaultData?: T) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T>(defaultData || {} as T)
  const [loading, setLoading] = useState(false)

  async function doExchange<R>(method: string, options?: ApiOptions): Promise<R> {
    let actualPath = path
    if (options?.pathParams) {
      Object.keys(options.pathParams)
        .forEach((key) => {
          const value = options.pathParams?.[key]
          if (value) {
            actualPath = actualPath.replaceAll(`:${key}`, value)
          }
        })
    }

    if (options?.queryParams) {
      const params = new URLSearchParams(options?.queryParams)
      actualPath = `${actualPath}?${params}`
    }

    const init: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      }
    }
    if (method !== 'GET') {
      init.method = method
      if (options?.body) {
        init.body = JSON.stringify(options?.body)
      }
    }

    const response = await fetch(actualPath, init);

    const body = await response.text()
    if (response.status === 401) {
      router.push("/login")
    } else if (response.status === 200) {
      const data = body ? JSON.parse(body) : undefined
      setData(data)
      return data
    } else if (body) {
      setError(JSON.parse(body).detail)
    }
    console.log('Common reject')
    return Promise.reject()
  }

  async function exchange<R>(method: string, options?: ApiOptions): Promise<R> {
    setLoading(true)
    try {
      return await doExchange(method, options)
    } finally {
      setLoading(false)
    }
  }

  async function get<R>(options?: ApiOptions): Promise<R> {
    return exchange("GET", options)
  }

  async function post<R>(options?: ApiOptions): Promise<R> {
    return exchange("POST", options)
  }

  async function put<R>(options?: ApiOptions): Promise<R> {
    return exchange("PUT", options)
  }

  async function patch<R>(options?: ApiOptions): Promise<R> {
    return exchange("PATCH", options)
  }

  async function del<R>(options?: ApiOptions): Promise<R> {
    return exchange("DELETE", options)
  }

  function reset() {
    setError(null)
    setData(defaultData || {} as T)
  }

  return { get, post, put, patch, del, data, error, loading, reset }
}
