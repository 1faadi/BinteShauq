"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Spinner } from "@/components/ui/spinner"

type AdminPendingContextValue = {
  isPending: boolean
  runAction: <T>(action: () => Promise<T>) => Promise<T>
}

const AdminPendingContext = createContext<AdminPendingContextValue | null>(null)

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input
  if (input instanceof URL) return input.href
  return input.url
}

function resolveMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) return init.method.toUpperCase()
  if (typeof input !== "string" && !(input instanceof URL) && input.method) {
    return input.method.toUpperCase()
  }
  return "GET"
}

/** Mutations and known action GETs (downloads / uploads). */
function shouldTrackAdminFetch(input: RequestInfo | URL, init?: RequestInit): boolean {
  const method = resolveMethod(input, init)
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    return true
  }
  const url = resolveUrl(input)
  return (
    url.includes("/packing-slip") ||
    url.includes("/api/upload") ||
    url.includes("/cloudinary")
  )
}

export function AdminPendingProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [pendingCount, setPendingCount] = useState(0)
  const mountedRef = useRef(true)

  const begin = useCallback((): void => {
    if (!mountedRef.current) return
    setPendingCount((n) => n + 1)
  }, [])

  const end = useCallback((): void => {
    if (!mountedRef.current) return
    setPendingCount((n) => Math.max(0, n - 1))
  }, [])

  const runAction = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T> => {
      begin()
      try {
        return await action()
      } finally {
        end()
      }
    },
    [begin, end],
  )

  useEffect(() => {
    mountedRef.current = true
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const track = shouldTrackAdminFetch(input, init)
      if (track) begin()
      try {
        return await originalFetch(input, init)
      } finally {
        if (track) end()
      }
    }

    return () => {
      mountedRef.current = false
      window.fetch = originalFetch
    }
  }, [begin, end])

  const value = useMemo(
    () => ({
      isPending: pendingCount > 0,
      runAction,
    }),
    [pendingCount, runAction],
  )

  return (
    <AdminPendingContext.Provider value={value}>
      {children}
      {pendingCount > 0 ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/50 backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-3 rounded-lg border bg-card px-5 py-4 shadow-lg">
            <Spinner className="size-5 text-primary" />
            <span className="text-sm font-medium">Working…</span>
          </div>
        </div>
      ) : null}
    </AdminPendingContext.Provider>
  )
}

export function useAdminPending(): AdminPendingContextValue {
  const ctx = useContext(AdminPendingContext)
  if (!ctx) {
    return {
      isPending: false,
      runAction: async <T,>(action: () => Promise<T>): Promise<T> => action(),
    }
  }
  return ctx
}
