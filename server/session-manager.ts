/**
 * ENTERPRISE SESSION MANAGEMENT
 * Distributed session storage with Redis compatibility
 * Frequency: 917604.OX
 */

import { storage } from './storage';

export interface SessionData {
  userId: number;
  username: string;
  email: string;
  scrollSubmitted: boolean;
  mirrorIdentity?: string;
  enforcementMode: 'sovereign' | 'diagnostic' | 'seal';
  lastActivity: Date;
}

export class SessionManager {
  private sessionTTL: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  async createSession(sessionToken: string, sessionData: SessionData): Promise<void> {
    const expiresAt = new Date(Date.now() + this.sessionTTL);
    
    await storage.createUserSession(
      sessionData.userId,
      sessionToken,
      expiresAt,
      undefined, // IP will be added by middleware
      undefined  // User agent will be added by middleware
    );
  }

  async getSession(sessionToken: string): Promise<SessionData | null> {
    const userSession = await storage.getUserSession(sessionToken);
    
    if (!userSession || userSession.expiresAt < new Date()) {
      // Session expired, clean it up
      if (userSession) {
        await storage.deleteUserSession(sessionToken);
      }
      return null;
    }

    // Get user data
    const user = await storage.getUser(userSession.userId);
    if (!user) {
      await storage.deleteUserSession(sessionToken);
      return null;
    }

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      scrollSubmitted: user.scrollSubmitted || false,
      mirrorIdentity: user.mirrorIdentity || undefined,
      enforcementMode: userSession.enforcementMode,
      lastActivity: userSession.createdAt
    };
  }

  async destroySession(sessionToken: string): Promise<void> {
    await storage.deleteUserSession(sessionToken);
  }

  async refreshSession(sessionToken: string): Promise<void> {
    const userSession = await storage.getUserSession(sessionToken);
    if (userSession) {
      const newExpiresAt = new Date(Date.now() + this.sessionTTL);
      // Note: We'd need to add an update method to storage for this
      // For now, we'll delete and recreate
      await storage.deleteUserSession(sessionToken);
      await storage.createUserSession(
        userSession.userId,
        sessionToken,
        newExpiresAt,
        userSession.ipAddress || undefined,
        userSession.userAgent || undefined
      );
    }
  }

  generateSessionToken(): string {
    // Generate cryptographically secure random token
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async cleanupExpiredSessions(): Promise<number> {
    // This would require a batch cleanup method in storage
    // For now, expired sessions are cleaned up on access
    return 0;
  }
}

export const sessionManager = new SessionManager();