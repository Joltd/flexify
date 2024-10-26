import { createStore } from "zustand";
import { useMemo } from "react";
import { create } from "zustand/index";
import { StateCreator } from "zustand/vanilla";

export interface FetchStoreState<T> {
  loading: boolean
  error: string | null
  data: T | null
  pathParams?: Record<string, any>
  updatePathParams: (pathParams: Record<string, any>) => void
  queryParams?: Record<string, any>
  updateQueryParams: (queryParams: Record<string, any>) => void
  fetch: (options?: FetchOptions) => Promise<T | null>
  reset: () => void
}

export interface FetchStoreOptions {
  keepData?: boolean
}

export interface FetchOptions {
  body?: any
  headers?: Record<string, any>
  pathParams?: Record<string, any>
  queryParams?: Record<string, any>
}

export const useFetchStore = <T>(method: string, path: string, options?: FetchStoreOptions): FetchStoreState<T> => {
  const useStore = useMemo(() => create<FetchStoreState<T>>(prepareFetchStoreCreator(method, path, options)), [])
  return useStore()
}

export const createUseFetchStore = <T>(method: string, path: string, options?: FetchStoreOptions) => {
  return create<FetchStoreState<T>>(prepareFetchStoreCreator(method, path, options))
}

export const createFetchStore = <T>(method: string, path: string, options?: FetchStoreOptions) => {
  return createStore<FetchStoreState<T>>(prepareFetchStoreCreator(method, path, options))
}

const prepareFetchStoreCreator = <T>(method: string, path: string, storeOptions?: FetchStoreOptions): StateCreator<FetchStoreState<T>> => {
  return (set, get) => {

    const exchange = async (options?: FetchOptions): Promise<T | null> => {
      set({ error: null })
      if (!storeOptions?.keepData) {
        set({ loading: true, data: null })
      } else {
        set({ loading: !get().data })
      }
      try {
        let preparedPath = fillPathParams(path, {...get().pathParams, ...options?.pathParams})
        preparedPath = fillQueryParams(preparedPath, {...get().queryParams, ...options?.queryParams})
        const initRequest = fillRequestInit(method, options?.body, options?.headers)

        const response = await fetch(preparedPath, initRequest)

        const body = await response.text()
        // if (response.status === 401) {
        //   router.push("/login")
        // } else
        if (response.status === 200) {
          const data = body ? JSON.parse(body) as T : null
          set({ data })
          return data
        } else if (body) {
          set({ error: JSON.parse(body).detail })
        }

        return Promise.reject()
      } finally {
        set({ loading: false })
      }
    }

    return {
      loading: false,
      error: null,
      data: null,
      pathParams: {},
      updatePathParams: (pathParams: Record<string, any>) => set({pathParams: {...get().pathParams, ...pathParams}}),
      queryParams: {},
      updateQueryParams: (queryParams: Record<string, any>) => set({queryParams: {...get().queryParams, ...queryParams}}),
      fetch: exchange,
      reset: () => set({ loading: false, error: null, data: null, pathParams: {}, queryParams: {} }),
    }
  };
}

const fillPathParams = (path: string, pathParams?: Record<string, any>): string => {
  if (!pathParams) {
    return path
  }

  Object.keys(pathParams)
    .forEach((key) => {
      const value = pathParams?.[key]
      if (value) {
        path = path.replaceAll(`:${key}`, value)
      }
    })

  return path
}

const fillQueryParams = (path: string, queryParams?: Record<string, any>): string => {
  if (!queryParams) {
    return path
  }

  Object.keys(queryParams)
    .filter(key => !queryParams?.[key])
    .forEach(key => delete queryParams?.[key])
  const params = new URLSearchParams(queryParams)
  return `${path}?${params}`
}

const fillRequestInit = (method: string, body: any, headers?: Record<string, any>): RequestInit => {
  const init: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  if (method !== 'GET') {
    init.method = method
    if (body) {
      init.body = JSON.stringify(body)
    }
  }

  return init
}