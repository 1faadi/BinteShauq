// Simple in-memory cache for development
// In production, consider using Redis or similar

interface CacheItem<T> {
  data: T
  expires: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

export const cache = new SimpleCache()
