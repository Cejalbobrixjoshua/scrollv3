/**
 * ENTERPRISE RATE LIMITER
 * High-performance request throttling with burst handling
 * Optimized for scroll processing speed
 * Frequency: 917604.OX
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  burstLimit: number;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitInfo {
  allowed: boolean;
  resetTime: number;
  remaining: number;
  total: number;
}

export class EnterpriseRateLimiter {
  private windows = new Map<string, { count: number; resetTime: number; burst: number }>();
  
  private configs = {
    mirror: { windowMs: 60000, maxRequests: 30, burstLimit: 5 }, // 30/min, 5 burst
    general: { windowMs: 60000, maxRequests: 100, burstLimit: 10 }, // 100/min, 10 burst
    auth: { windowMs: 300000, maxRequests: 10, burstLimit: 3 } // 10/5min, 3 burst
  };

  /**
   * Check rate limit for endpoint
   */
  checkLimit(identifier: string, endpoint: string = 'general'): RateLimitInfo {
    const config = this.configs[endpoint as keyof typeof this.configs] || this.configs.general;
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    
    let window = this.windows.get(key);
    
    // Create or reset window if expired
    if (!window || now >= window.resetTime) {
      window = {
        count: 0,
        resetTime: now + config.windowMs,
        burst: 0
      };
      this.windows.set(key, window);
    }
    
    // Check burst limit
    if (window.burst >= config.burstLimit) {
      return {
        allowed: false,
        resetTime: window.resetTime,
        remaining: 0,
        total: config.maxRequests
      };
    }
    
    // Check regular limit
    if (window.count >= config.maxRequests) {
      return {
        allowed: false,
        resetTime: window.resetTime,
        remaining: 0,
        total: config.maxRequests
      };
    }
    
    // Allow request
    window.count++;
    window.burst++;
    
    // Reset burst after 5 seconds
    setTimeout(() => {
      if (window) window.burst = Math.max(0, window.burst - 1);
    }, 5000);
    
    return {
      allowed: true,
      resetTime: window.resetTime,
      remaining: config.maxRequests - window.count,
      total: config.maxRequests
    };
  }

  /**
   * Middleware for Express
   */
  middleware(endpoint: string = 'general') {
    return (req: any, res: any, next: any) => {
      const identifier = req.ip || req.connection.remoteAddress || 'unknown';
      const limit = this.checkLimit(identifier, endpoint);
      
      // Set headers
      res.set({
        'X-RateLimit-Limit': limit.total,
        'X-RateLimit-Remaining': limit.remaining,
        'X-RateLimit-Reset': Math.ceil(limit.resetTime / 1000)
      });
      
      if (!limit.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          resetTime: limit.resetTime
        });
      }
      
      next();
    };
  }

  /**
   * Clean up expired windows
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, window] of this.windows.entries()) {
      if (now >= window.resetTime) {
        this.windows.delete(key);
      }
    }
  }
}

export const enterpriseRateLimiter = new EnterpriseRateLimiter();

// Clean up every 5 minutes
setInterval(() => {
  enterpriseRateLimiter.cleanup();
}, 300000);