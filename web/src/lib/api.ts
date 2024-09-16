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

  async function doExchange(method: string, options?: ApiOptions): Promise<void> {
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
    } else if (response.status === 200 && body) {
      setData(JSON.parse(body))
    } else if (body) {
      setError(JSON.parse(body).detail)
      return Promise.reject()
    }
  }

  async function exchange(method: string, options?: ApiOptions): Promise<void> {
    setLoading(true)
    try {
      await doExchange(method, options)
    } finally {
      setLoading(false)
    }
  }

  async function get(options?: ApiOptions): Promise<void> {
    return exchange("GET", options)
  }

  async function post(options?: ApiOptions): Promise<void> {
    return exchange("POST", options)
  }

  async function put(options?: ApiOptions): Promise<void> {
    return exchange("PUT", options)
  }

  async function patch(options?: ApiOptions): Promise<void> {
    return exchange("PATCH", options)
  }

  async function del(options?: ApiOptions): Promise<void> {
    return exchange("DELETE", options)
  }

  return { get, post, put, patch, del, data, error, loading }
}
