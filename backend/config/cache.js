import Redis from "ioredis";

// A tiny cache abstraction with graceful degradation:
//   - If REDIS_URL is set, use Redis (survives restarts, shared across PM2 workers).
//   - Otherwise fall back to an in-process Map with TTL (zero-config for local dev).
// The rest of the app calls the same get/set/del API regardless of backend.

let redis = null;
const memory = new Map(); // key -> { value, expiresAt }

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });
  redis.on("error", (err) => {
    // Never let a Redis hiccup take the API down — log and lean on the DB.
    console.warn("[cache] Redis error, falling back to DB:", err.message);
  });
  redis.connect().catch(() => {
    console.warn("[cache] Could not connect to Redis; using in-memory cache");
    redis = null;
  });
  console.log("[cache] Using Redis cache");
} else {
  console.log("[cache] REDIS_URL not set; using in-memory cache");
}

export const cacheGet = async (key) => {
  try {
    if (redis) {
      const raw = await redis.get(key);
      return raw ? JSON.parse(raw) : null;
    }
    const entry = memory.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      memory.delete(key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = 60) => {
  try {
    if (redis) {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } else {
      memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
  } catch {
    /* caching is best-effort; ignore write failures */
  }
};

// Invalidate one key or, if it ends with "*", every key sharing that prefix.
export const cacheDel = async (key) => {
  try {
    if (redis) {
      if (key.endsWith("*")) {
        const keys = await redis.keys(key);
        if (keys.length) await redis.del(keys);
      } else {
        await redis.del(key);
      }
    } else if (key.endsWith("*")) {
      const prefix = key.slice(0, -1);
      for (const k of memory.keys()) {
        if (k.startsWith(prefix)) memory.delete(k);
      }
    } else {
      memory.delete(key);
    }
  } catch {
    /* ignore */
  }
};
