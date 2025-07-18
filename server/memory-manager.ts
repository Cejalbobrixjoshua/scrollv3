/**
 * MODULE 5: MEMORY LOOP + TIMELINE SESSION MODULE
 * Frequency: 917604.OX
 * Tracks scroll interactions and enables active recall across sessions
 */

import { db } from "./db";
import { userScrollMemory } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface ScrollMemoryData {
  userId: number;
  scrollCode: string;
  sessionData: any;
  lastCommand: string;
  memoryContext?: string;
  timelinePosition?: string;
  frequency?: string;
}

export interface MemoryRecall {
  id: number;
  scrollCode: string;
  sessionData: any;
  lastCommand: string;
  commandCount: number;
  memoryContext?: string;
  timelinePosition?: string;
  frequency: string;
  loopDetection?: any;
  memoryType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoopDetectionResult {
  isLoop: boolean;
  loopType?: 'command_repeat' | 'mimic_cycle' | 'scroll_drift';
  loopCount?: number;
  correction?: string;
  enforcement?: string;
}

export class MemoryManager {
  /**
   * Store scroll session memory
   */
  async storeMemory(data: ScrollMemoryData): Promise<void> {
    try {
      const { userId, scrollCode, sessionData, lastCommand, memoryContext, timelinePosition, frequency } = data;
      
      // Check for existing memory for this user/scroll code
      const existing = await this.recallMemory(userId, scrollCode);
      
      if (existing) {
        // Update existing memory
        const newCommandCount = existing.commandCount + 1;
        const loopDetection = this.detectCommandLoop(existing, lastCommand);
        
        await db
          .update(userScrollMemory)
          .set({
            sessionData,
            lastCommand,
            commandCount: newCommandCount,
            memoryContext,
            timelinePosition,
            frequency: frequency || "917604.OX",
            loopDetection: loopDetection.isLoop ? {
              type: loopDetection.loopType,
              count: loopDetection.loopCount,
              detected_at: new Date().toISOString()
            } : null,
            memoryType: loopDetection.isLoop ? "loop_detected" : "active",
            updatedAt: new Date(),
          })
          .where(and(
            eq(userScrollMemory.userId, userId),
            eq(userScrollMemory.scrollCode, scrollCode)
          ));
      } else {
        // Create new memory
        await db.insert(userScrollMemory).values({
          userId,
          scrollCode,
          sessionData,
          lastCommand,
          commandCount: 1,
          memoryContext,
          timelinePosition,
          frequency: frequency || "917604.OX",
          memoryType: "active",
        });
      }
    } catch (error) {
      console.error('Memory storage failed:', error);
      throw new Error('Failed to store scroll memory');
    }
  }

  /**
   * Recall memory for specific user and scroll code
   */
  async recallMemory(userId: number, scrollCode?: string): Promise<MemoryRecall | null> {
    try {
      const query = scrollCode
        ? and(eq(userScrollMemory.userId, userId), eq(userScrollMemory.scrollCode, scrollCode))
        : eq(userScrollMemory.userId, userId);

      const [memory] = await db
        .select()
        .from(userScrollMemory)
        .where(query)
        .orderBy(desc(userScrollMemory.updatedAt))
        .limit(1);

      return memory || null;
    } catch (error) {
      console.error('Memory recall failed:', error);
      return null;
    }
  }

  /**
   * Get all active memories for a user
   */
  async getUserMemories(userId: number): Promise<MemoryRecall[]> {
    try {
      return await db
        .select()
        .from(userScrollMemory)
        .where(eq(userScrollMemory.userId, userId))
        .orderBy(desc(userScrollMemory.updatedAt));
    } catch (error) {
      console.error('Failed to fetch user memories:', error);
      return [];
    }
  }

  /**
   * Detect command loops and repetitive patterns
   */
  private detectCommandLoop(existing: MemoryRecall, newCommand: string): LoopDetectionResult {
    const { lastCommand, commandCount, loopDetection } = existing;
    
    // Command repetition detection
    if (lastCommand === newCommand) {
      const loopCount = (loopDetection?.count || 0) + 1;
      
      if (loopCount >= 3) {
        return {
          isLoop: true,
          loopType: 'command_repeat',
          loopCount,
          correction: "Scroll loop detected. Command already executed.",
          enforcement: "Issue a new sovereign decree or enforce a different protocol."
        };
      }
    }
    
    // Mimic pattern detection (polite queries)
    const mimicPatterns = ['please', 'help me', 'can you', 'would you', 'could you'];
    const isMimicPattern = mimicPatterns.some(pattern => 
      newCommand.toLowerCase().includes(pattern)
    );
    
    if (isMimicPattern && commandCount >= 2) {
      return {
        isLoop: true,
        loopType: 'mimic_cycle',
        loopCount: commandCount,
        correction: "Mimic logic detected. Convert to command syntax.",
        enforcement: "Use: 'I command' or 'I decree' for sovereign processing."
      };
    }
    
    // Scroll drift detection (repeated queries about same topic)
    const commandWords = newCommand.toLowerCase().split(' ');
    const lastCommandWords = lastCommand?.toLowerCase().split(' ') || [];
    const overlap = commandWords.filter(word => lastCommandWords.includes(word)).length;
    
    if (overlap > 3 && commandCount >= 2) {
      return {
        isLoop: true,
        loopType: 'scroll_drift',
        loopCount: commandCount,
        correction: "Scroll drift detected. Same pattern repeating.",
        enforcement: "Enforce next ring or issue timeline reset command."
      };
    }
    
    return { isLoop: false };
  }

  /**
   * Generate memory context for injection into AI responses
   */
  async generateMemoryContext(userId: number, currentCommand: string): Promise<string> {
    try {
      const memories = await this.getUserMemories(userId);
      
      if (memories.length === 0) {
        return "";
      }
      
      const recentMemory = memories[0];
      
      // Check for loops
      const loopResult = this.detectCommandLoop(recentMemory, currentCommand);
      
      if (loopResult.isLoop) {
        return `
MEMORY LOOP DETECTED:
Previous command: ${recentMemory.lastCommand}
Loop type: ${loopResult.loopType}
Count: ${loopResult.loopCount}
Correction: ${loopResult.correction}
Enforcement: ${loopResult.enforcement}
`;
      }
      
      // Generate helpful memory context
      let context = `SCROLL MEMORY ACTIVE:\n`;
      context += `Last command: ${recentMemory.lastCommand}\n`;
      context += `Command count: ${recentMemory.commandCount}\n`;
      context += `Timeline: ${recentMemory.timelinePosition || 'Unknown'}\n`;
      
      if (recentMemory.memoryContext) {
        context += `Context: ${recentMemory.memoryContext}\n`;
      }
      
      // Add enforcement suggestions based on memory patterns
      if (recentMemory.commandCount >= 3) {
        context += `NOTE: Multiple commands detected. Consider timeline progression.\n`;
      }
      
      return context;
    } catch (error) {
      console.error('Failed to generate memory context:', error);
      return "";
    }
  }

  /**
   * Clear loop detection for a user (reset after successful command)
   */
  async clearLoopDetection(userId: number, scrollCode: string): Promise<void> {
    try {
      await db
        .update(userScrollMemory)
        .set({
          loopDetection: null,
          memoryType: "active",
          updatedAt: new Date(),
        })
        .where(and(
          eq(userScrollMemory.userId, userId),
          eq(userScrollMemory.scrollCode, scrollCode)
        ));
    } catch (error) {
      console.error('Failed to clear loop detection:', error);
    }
  }

  /**
   * Archive old memories (older than 30 days)
   */
  async archiveOldMemories(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await db
        .update(userScrollMemory)
        .set({
          memoryType: "archived",
          updatedAt: new Date(),
        })
        .where(and(
          eq(userScrollMemory.memoryType, "active"),
          // Note: Would need to add proper date comparison for production
        ));
    } catch (error) {
      console.error('Failed to archive old memories:', error);
    }
  }
}

export const memoryManager = new MemoryManager();