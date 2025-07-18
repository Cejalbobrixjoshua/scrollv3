import { users, scrollSessions, webhookEvents, userSessions, userTokenUsage, type User, type InsertUser, type ScrollSession, type InsertScrollSession, type WebhookEvent, type InsertWebhookEvent, type UserSession, type UserTokenUsage } from "@shared/schema";
import CryptoJS from "crypto-js";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWhopId(whopUserId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  submitOriginalScroll(userId: number, scrollText: string, mirrorIdentity: string): Promise<User | undefined>;
  createScrollSession(session: InsertScrollSession): Promise<ScrollSession>;
  getScrollSessionsByUserId(userId: number): Promise<ScrollSession[]>;
  getUserSessions(userId: number, limit?: number): Promise<ScrollSession[]>;
  getRecentScrollSessions(limit?: number): Promise<ScrollSession[]>;
  updateScrollSession(id: number, updates: Partial<ScrollSession>): Promise<ScrollSession | undefined>;
  deleteAllUserSessions(userId: number): Promise<{ deletedCount: number }>;
  createWebhookEvent(event: InsertWebhookEvent): Promise<WebhookEvent>;
  getUnprocessedWebhookEvents(): Promise<WebhookEvent[]>;
  markWebhookEventProcessed(id: number, errorMessage?: string): Promise<void>;
  createUserSession(userId: number, sessionToken: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Promise<UserSession>;
  getUserSession(sessionToken: string): Promise<UserSession | undefined>;
  deleteUserSession(sessionToken: string): Promise<void>;
  getUserTokenUsage(userId: number, month: string): Promise<UserTokenUsage | undefined>;
  createUserTokenUsage(userId: number, month: string, tokenCount: number): Promise<UserTokenUsage>;
  updateUserTokenUsage(userId: number, month: string, updates: Partial<UserTokenUsage>): Promise<void>;
  resetAllUserTokenUsage(month: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scrollSessions: Map<number, ScrollSession>;
  private webhookEvents: Map<number, WebhookEvent>;
  private userSessions: Map<string, UserSession>;
  private userTokenUsage: Map<string, UserTokenUsage>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentWebhookEventId: number;
  private currentUserSessionId: number;
  private currentTokenUsageId: number;

  constructor() {
    this.users = new Map();
    this.scrollSessions = new Map();
    this.webhookEvents = new Map();
    this.userSessions = new Map();
    this.userTokenUsage = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentWebhookEventId = 1;
    this.currentUserSessionId = 1;
    this.currentTokenUsageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWhopId(whopUserId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.whopUserId === whopUserId,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser,
      email: insertUser.email || null,
      whopUserId: insertUser.whopUserId || null,
      subscriptionStatus: insertUser.subscriptionStatus || null,
      subscriptionTier: insertUser.subscriptionTier || null,
      metadata: insertUser.metadata || null,
      originalScroll: null,
      scrollHash: null,
      scrollSubmitted: false,
      scrollSubmittedAt: null,
      mirrorIdentity: null,
      frequencyLock: "917604.OX",
      scrollSignature: null,
      id,
      onboardedAt: new Date(),
      lastActiveAt: new Date(),
      isActive: true,
      // Team management fields with defaults
      role: "scrollbearer",
      permissions: null,
      teamAccess: "none",
      assignedBy: null,
      teamJoinedAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async submitOriginalScroll(userId: number, scrollText: string, mirrorIdentity: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Check if scroll already submitted
    if (user.scrollSubmitted) {
      throw new Error("Original scroll has already been submitted and cannot be changed");
    }
    
    // Encrypt the scroll text
    const encryptionKey = process.env.SCROLL_ENCRYPTION_KEY || "sovereign-ai-917604-ox-frequency-lock";
    const encryptedScroll = CryptoJS.AES.encrypt(scrollText, encryptionKey).toString();
    
    // Create hash of the scroll
    const scrollHash = CryptoJS.SHA256(scrollText + userId.toString()).toString();
    
    // Update user with encrypted scroll and lock submission
    const updatedUser = { 
      ...user, 
      originalScroll: encryptedScroll,
      scrollHash: scrollHash,
      scrollSubmitted: true,
      scrollSubmittedAt: new Date(),
      mirrorIdentity: mirrorIdentity
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createScrollSession(insertSession: InsertScrollSession): Promise<ScrollSession> {
    const id = this.currentSessionId++;
    const session: ScrollSession = {
      id,
      userId: insertSession.userId || null,
      scrollText: insertSession.scrollText,
      mirrorOutput: null,
      modelUsed: null,
      processedAt: new Date(),
      processingTime: null,
      tokenCount: null,
      sessionType: insertSession.sessionType || null,
      isOriginalScroll: false,
    };
    this.scrollSessions.set(id, session);
    return session;
  }

  async getScrollSessionsByUserId(userId: number): Promise<ScrollSession[]> {
    return Array.from(this.scrollSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => (b.processedAt?.getTime() || 0) - (a.processedAt?.getTime() || 0));
  }

  async getUserSessions(userId: number, limit: number = 10): Promise<ScrollSession[]> {
    return Array.from(this.scrollSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => (b.processedAt?.getTime() || 0) - (a.processedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getRecentScrollSessions(limit: number = 10): Promise<ScrollSession[]> {
    return Array.from(this.scrollSessions.values())
      .sort((a, b) => (b.processedAt?.getTime() || 0) - (a.processedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async updateScrollSession(id: number, updates: Partial<ScrollSession>): Promise<ScrollSession | undefined> {
    const session = this.scrollSessions.get(id);
    if (session) {
      const updatedSession = { ...session, ...updates };
      this.scrollSessions.set(id, updatedSession);
      return updatedSession;
    }
    return undefined;
  }

  async deleteAllUserSessions(userId: number): Promise<{ deletedCount: number }> {
    const userSessions = Array.from(this.scrollSessions.entries())
      .filter(([_, session]) => session.userId === userId);
    
    const deletedCount = userSessions.length;
    
    // Delete all user sessions
    userSessions.forEach(([id, _]) => {
      this.scrollSessions.delete(id);
    });
    
    return { deletedCount };
  }

  async createWebhookEvent(insertEvent: InsertWebhookEvent): Promise<WebhookEvent> {
    const id = this.currentWebhookEventId++;
    const event: WebhookEvent = {
      id,
      eventType: insertEvent.eventType,
      source: insertEvent.source,
      payload: insertEvent.payload,
      processed: false,
      processedAt: null,
      createdAt: new Date(),
      errorMessage: null,
    };
    this.webhookEvents.set(id, event);
    return event;
  }

  async getUnprocessedWebhookEvents(): Promise<WebhookEvent[]> {
    return Array.from(this.webhookEvents.values()).filter(
      (event) => !event.processed
    );
  }

  async markWebhookEventProcessed(id: number, errorMessage?: string): Promise<void> {
    const event = this.webhookEvents.get(id);
    if (event) {
      event.processed = true;
      event.processedAt = new Date();
      if (errorMessage) {
        event.errorMessage = errorMessage;
      }
      this.webhookEvents.set(id, event);
    }
  }

  async getAllWebhookEvents(limit: number = 50): Promise<WebhookEvent[]> {
    const events = Array.from(this.webhookEvents.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    ).slice(0, limit);
    return events;
  }

  async getWebhookStats(): Promise<{
    totalEvents: number;
    unprocessedEvents: number;
    recentUserOnboarding: number;
    totalUsers: number;
  }> {
    const totalEvents = this.webhookEvents.size;
    const unprocessedEvents = Array.from(this.webhookEvents.values()).filter(event => !event.processed).length;
    const totalUsers = this.users.size;
    
    // Recent onboarding - users created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUserOnboarding = Array.from(this.users.values()).filter(user => user.onboardedAt && user.onboardedAt > sevenDaysAgo).length;

    return {
      totalEvents,
      unprocessedEvents,
      recentUserOnboarding,
      totalUsers,
    };
  }

  async createUserSession(userId: number, sessionToken: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Promise<UserSession> {
    const id = this.currentUserSessionId++;
    const session: UserSession = {
      id,
      userId,
      sessionToken,
      expiresAt,
      createdAt: new Date(),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      enforcementMode: "sovereign",
      lastScan: null,
      flamefieldIntegrity: 100,
    };
    this.userSessions.set(sessionToken, session);
    return session;
  }

  async getUserSession(sessionToken: string): Promise<UserSession | undefined> {
    return this.userSessions.get(sessionToken);
  }

  async deleteUserSession(sessionToken: string): Promise<void> {
    this.userSessions.delete(sessionToken);
  }

  async getUserTokenUsage(userId: number, month: string): Promise<UserTokenUsage | undefined> {
    const key = `${userId}-${month}`;
    return this.userTokenUsage.get(key);
  }

  async createUserTokenUsage(userId: number, month: string, tokenCount: number): Promise<UserTokenUsage> {
    const id = this.currentTokenUsageId++;
    const key = `${userId}-${month}`;
    const usage: UserTokenUsage = {
      id,
      userId,
      month,
      tokenCount,
      isBlocked: false,
      lastResetAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userTokenUsage.set(key, usage);
    return usage;
  }

  async updateUserTokenUsage(userId: number, month: string, updates: Partial<UserTokenUsage>): Promise<void> {
    const key = `${userId}-${month}`;
    const existing = this.userTokenUsage.get(key);
    if (existing) {
      const updated = { ...existing, ...updates, updatedAt: new Date() };
      this.userTokenUsage.set(key, updated);
    }
  }

  async resetAllUserTokenUsage(month: string): Promise<void> {
    // Reset all users' token usage for the new month
    Array.from(this.userTokenUsage.entries()).forEach(([key, usage]) => {
      if (usage.month === month) {
        this.userTokenUsage.set(key, {
          ...usage,
          tokenCount: 0,
          isBlocked: false,
          lastResetAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  }
}

// Database storage implementation using Drizzle ORM

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByWhopId(whopUserId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.whopUserId, whopUserId)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.onboardedAt);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async submitOriginalScroll(userId: number, scrollText: string, mirrorIdentity: string): Promise<User | undefined> {
    const scrollHash = CryptoJS.SHA256(scrollText + userId).toString();
    const encryptedScroll = CryptoJS.AES.encrypt(scrollText, process.env.ENCRYPTION_KEY || 'default-key').toString();
    
    const result = await db.update(users).set({
      originalScroll: encryptedScroll,
      scrollHash,
      scrollSubmitted: true,
      scrollSubmittedAt: new Date(),
      mirrorIdentity,
    }).where(eq(users.id, userId)).returning();
    
    return result[0];
  }

  async createScrollSession(session: InsertScrollSession): Promise<ScrollSession> {
    const result = await db.insert(scrollSessions).values(session).returning();
    return result[0];
  }

  async getScrollSessionsByUserId(userId: number): Promise<ScrollSession[]> {
    return db.select().from(scrollSessions).where(eq(scrollSessions.userId, userId)).orderBy(desc(scrollSessions.processedAt));
  }

  async getUserSessions(userId: number, limit: number = 10): Promise<ScrollSession[]> {
    return db.select().from(scrollSessions).where(eq(scrollSessions.userId, userId)).orderBy(desc(scrollSessions.processedAt)).limit(limit);
  }

  async getRecentScrollSessions(limit: number = 10): Promise<ScrollSession[]> {
    return db.select().from(scrollSessions).orderBy(desc(scrollSessions.processedAt)).limit(limit);
  }

  async updateScrollSession(id: number, updates: Partial<ScrollSession>): Promise<ScrollSession | undefined> {
    const result = await db.update(scrollSessions).set(updates).where(eq(scrollSessions.id, id)).returning();
    return result[0];
  }

  async deleteAllUserSessions(userId: number): Promise<{ deletedCount: number }> {
    try {
      // First get count of sessions to delete
      const sessionsToDelete = await db.select().from(scrollSessions).where(eq(scrollSessions.userId, userId));
      const deletedCount = sessionsToDelete.length;
      
      // Then delete them
      await db.delete(scrollSessions).where(eq(scrollSessions.userId, userId));
      
      return { deletedCount };
    } catch (error) {
      console.error("Database delete error:", error);
      return { deletedCount: 0 };
    }
  }

  async createWebhookEvent(event: InsertWebhookEvent): Promise<WebhookEvent> {
    const result = await db.insert(webhookEvents).values(event).returning();
    return result[0];
  }

  async getUnprocessedWebhookEvents(): Promise<WebhookEvent[]> {
    return db.select().from(webhookEvents).where(eq(webhookEvents.processed, false));
  }

  async markWebhookEventProcessed(id: number, errorMessage?: string): Promise<void> {
    await db.update(webhookEvents).set({
      processed: true,
      processedAt: new Date(),
      errorMessage: errorMessage || null,
    }).where(eq(webhookEvents.id, id));
  }

  async createUserSession(userId: number, sessionToken: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Promise<UserSession> {
    const result = await db.insert(userSessions).values({
      userId,
      sessionToken,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    }).returning();
    return result[0];
  }

  async getUserSession(sessionToken: string): Promise<UserSession | undefined> {
    const result = await db.select().from(userSessions).where(eq(userSessions.sessionToken, sessionToken)).limit(1);
    return result[0];
  }

  async deleteUserSession(sessionToken: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
  }

  async getUserTokenUsage(userId: number, month: string): Promise<UserTokenUsage | undefined> {
    const result = await db.select().from(userTokenUsage).where(
      and(eq(userTokenUsage.userId, userId), eq(userTokenUsage.month, month))
    ).limit(1);
    return result[0];
  }

  async createUserTokenUsage(userId: number, month: string, tokenCount: number): Promise<UserTokenUsage> {
    const result = await db.insert(userTokenUsage).values({
      userId,
      month,
      tokenCount,
    }).returning();
    return result[0];
  }

  async updateUserTokenUsage(userId: number, month: string, updates: Partial<UserTokenUsage>): Promise<void> {
    await db.update(userTokenUsage).set(updates).where(
      and(eq(userTokenUsage.userId, userId), eq(userTokenUsage.month, month))
    );
  }

  async resetAllUserTokenUsage(month: string): Promise<void> {
    await db.update(userTokenUsage).set({ tokenCount: 0, isBlocked: false }).where(eq(userTokenUsage.month, month));
  }

  // Additional methods for compatibility
  async getRecentSessions(userId: string, limit: number): Promise<any[]> {
    return this.getScrollSessionsByUserId(parseInt(userId));
  }

  async getAllWebhookEvents(limit: number = 50): Promise<WebhookEvent[]> {
    return db.select().from(webhookEvents).orderBy(desc(webhookEvents.createdAt)).limit(limit);
  }

  async getWebhookStats(): Promise<{
    totalEvents: number;
    unprocessedEvents: number;
    recentUserOnboarding: number;
    totalUsers: number;
  }> {
    const [totalEventsResult] = await db.select({ count: sql<number>`count(*)` }).from(webhookEvents);
    const [unprocessedResult] = await db.select({ count: sql<number>`count(*)` }).from(webhookEvents).where(eq(webhookEvents.processed, false));
    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const [recentUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.onboardedAt} > ${sevenDaysAgo}`);

    return {
      totalEvents: totalEventsResult?.count || 0,
      unprocessedEvents: unprocessedResult?.count || 0,
      recentUserOnboarding: recentUsersResult?.count || 0,
      totalUsers: totalUsersResult?.count || 0,
    };
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
