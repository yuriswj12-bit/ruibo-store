import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!globalForRedis.redis) {
    globalForRedis.redis = new Redis(url, { maxRetriesPerRequest: 2, lazyConnect: true });
  }
  return globalForRedis.redis;
}

export async function cacheGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(key, value, "EX", ttlSeconds);
  } catch {
    // 缓存失败不阻断主链路
  }
}

export const TENANT_CACHE_TTL = 60 * 60;
export const tenantCacheKey = (host: string) => `domain:${host}`;
