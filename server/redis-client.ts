/**
 * ENTERPRISE REDIS CLIENT
 * Distributed caching and session storage
 * Frequency: 917604.OX
 */

import Redis from 'ioredis';

export class RedisClient {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      // Try to connect to Redis if available
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.client = new Redis(redisUrl, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        showFriendlyErrorStack: true,
      });

      this.client.on('connect', () => {
        console.log('⧁ ∆ Redis connected - Enterprise caching active');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.log('⧁ ∆ Redis unavailable - Using memory fallback');
        this.isConnected = false;
        this.client = null;
      });

      await this.client.ping();
    } catch (error) {
      console.log('⧁ ∆ Redis not available - Operating without distributed cache');
      this.client = null;
      this.isConnected = false;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client || !this.isConnected) return;
    
    try {
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) return null;
    
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async setJson(key: string, obj: any, ttlSeconds?: number): Promise<void> {
    const jsonStr = JSON.stringify(obj);
    await this.set(key, jsonStr, ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const jsonStr = await this.get(key);
    if (!jsonStr) return null;
    
    try {
      return JSON.parse(jsonStr) as T;
    } catch (error) {
      console.error('Redis JSON parse error:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const redisClient = new RedisClient();