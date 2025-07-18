import { storage } from "./storage";

export const MAX_TOKENS_PER_MONTH = 650000;

export interface TokenCheckResult {
  status: "allowed" | "blocked";
  message?: string;
  remainingTokens?: number;
  totalUsed?: number;
}

export class TokenLimiter {
  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  private getEnforcementMessage(): string {
    return `⧁ ∆ Mirror limit reached.

You've maxed out your scroll mirror interface for the month.

To unlock extended scroll enforcement, book your Quantum Jump:
👉 https://viralgrowthmedia.ai/quantum-jump`;
  }

  async forceTokenLimit(userId: number): Promise<void> {
    // Test method to simulate hitting the token limit
    const currentMonth = this.getCurrentMonth();
    
    // First ensure user has token usage record
    let usage = await storage.getUserTokenUsage(userId, currentMonth);
    if (!usage) {
      usage = await storage.createUserTokenUsage(userId, currentMonth, 0);
    }
    
    // Force the limit
    await storage.updateUserTokenUsage(userId, currentMonth, {
      tokenCount: MAX_TOKENS_PER_MONTH,
      isBlocked: true
    });
    
    console.log(`Forced token limit for user ${userId}, month ${currentMonth}`);
  }

  async checkTokenLimit(userId: number, estimatedTokens: number): Promise<TokenCheckResult> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usage = await storage.getUserTokenUsage(userId, currentMonth);
      
      if (!usage) {
        // First time user - create token usage record
        await storage.createUserTokenUsage(userId, currentMonth, 0);
        return {
          status: "allowed",
          remainingTokens: MAX_TOKENS_PER_MONTH - estimatedTokens,
          totalUsed: 0
        };
      }

      // Check if user is already blocked
      if (usage.isBlocked) {
        return {
          status: "blocked",
          message: this.getEnforcementMessage(),
          totalUsed: usage.tokenCount,
          remainingTokens: 0
        };
      }

      // Check if adding new tokens would exceed limit
      const newTotal = usage.tokenCount + estimatedTokens;
      if (newTotal >= MAX_TOKENS_PER_MONTH) {
        // Block the user and return enforcement message
        await storage.updateUserTokenUsage(userId, currentMonth, {
          tokenCount: newTotal,
          isBlocked: true
        });

        return {
          status: "blocked",
          message: this.getEnforcementMessage(),
          totalUsed: newTotal,
          remainingTokens: 0
        };
      }

      // User is within limits
      return {
        status: "allowed",
        remainingTokens: MAX_TOKENS_PER_MONTH - newTotal,
        totalUsed: usage.tokenCount
      };
    } catch (error) {
      console.error("Token limit check failed:", error);
      // Allow on error to avoid blocking legitimate users
      return {
        status: "allowed",
        remainingTokens: MAX_TOKENS_PER_MONTH,
        totalUsed: 0
      };
    }
  }

  async updateTokenUsage(userId: number, actualTokens: number): Promise<void> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usage = await storage.getUserTokenUsage(userId, currentMonth);
      
      if (!usage) {
        await storage.createUserTokenUsage(userId, currentMonth, actualTokens);
      } else {
        const newTotal = usage.tokenCount + actualTokens;
        await storage.updateUserTokenUsage(userId, currentMonth, {
          tokenCount: newTotal
        });
      }
    } catch (error) {
      console.error("Token usage update failed:", error);
    }
  }

  async getUserTokenStats(userId: number): Promise<{
    currentUsage: number;
    remainingTokens: number;
    isBlocked: boolean;
    monthlyLimit: number;
    currentMonth: string;
  }> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usage = await storage.getUserTokenUsage(userId, currentMonth);
      
      if (!usage) {
        return {
          currentUsage: 0,
          remainingTokens: MAX_TOKENS_PER_MONTH,
          isBlocked: false,
          monthlyLimit: MAX_TOKENS_PER_MONTH,
          currentMonth
        };
      }

      return {
        currentUsage: usage.tokenCount,
        remainingTokens: Math.max(0, MAX_TOKENS_PER_MONTH - usage.tokenCount),
        isBlocked: usage.isBlocked,
        monthlyLimit: MAX_TOKENS_PER_MONTH,
        currentMonth
      };
    } catch (error) {
      console.error("Failed to get token stats:", error);
      return {
        currentUsage: 0,
        remainingTokens: MAX_TOKENS_PER_MONTH,
        isBlocked: false,
        monthlyLimit: MAX_TOKENS_PER_MONTH,
        currentMonth: this.getCurrentMonth()
      };
    }
  }

  async resetMonthlyLimits(): Promise<void> {
    // This would typically be called by a cron job on the 1st of each month
    try {
      const currentMonth = this.getCurrentMonth();
      await storage.resetAllUserTokenUsage(currentMonth);
      console.log(`Reset token limits for month: ${currentMonth}`);
    } catch (error) {
      console.error("Failed to reset monthly limits:", error);
    }
  }
}

export const tokenLimiter = new TokenLimiter();