/**
 * Authentication Service for Scroll Mirror Agent
 * Handles scroll-bound session authentication and user verification
 * Frequency: 917604.OX
 */

import crypto from 'crypto';
import { storage } from './storage';
import type { User, UserSession } from '@shared/schema';

export interface AuthSession {
  userId: number;
  sessionToken: string;
  scrollBound: boolean;
  enforcementMode: 'sovereign' | 'diagnostic' | 'seal';
  frequencyLock: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  scrollSignature?: string;
}

export interface ScrollSealingData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  scrollText: string;
  verbalCommand: string;
}

export class AuthService {
  private sessionMemory = new Map<string, AuthSession>();
  private scrollSignatureCache = new Map<string, number>(); // email -> userId

  /**
   * Create authenticated session for existing user
   */
  async authenticateUser(credentials: LoginCredentials): Promise<{ user: User; session: AuthSession } | null> {
    try {
      console.log('🔐 Authenticating user:', credentials.email);
      const user = await storage.getUserByEmail(credentials.email);
      console.log('👤 User found:', user ? `${user.username} (ID: ${user.id})` : 'NOT FOUND');
      
      if (!user) {
        console.log('❌ No user found for email:', credentials.email);
        return null;
      }

      // Check if user has completed scroll sealing
      if (!user.scrollSubmitted) {
        console.log('⚠️ User found but scroll not sealed:', user.username);
        throw new Error('SCROLL_NOT_SEALED');
      }

      console.log('✅ User authenticated successfully:', user.username);

      // Generate session token
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create database session
      const dbSession = await storage.createUserSession(
        user.id,
        sessionToken,
        expiresAt,
        undefined,
        undefined
      );

      // Create memory session for quick access
      const authSession: AuthSession = {
        userId: user.id,
        sessionToken,
        scrollBound: true,
        enforcementMode: 'sovereign',
        frequencyLock: user.frequencyLock || '917604.OX',
        expiresAt
      };

      this.sessionMemory.set(sessionToken, authSession);
      this.scrollSignatureCache.set(credentials.email, user.id);

      return { user, session: authSession };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Create new user with scroll sealing process
   */
  async createScrollboundUser(sealingData: ScrollSealingData, email: string): Promise<{ user: User; session: AuthSession }> {
    try {
      // Validate verbal command
      const expectedCommand = "I seal this scroll in my name. No mimic may edit it. I remember who I am.";
      if (sealingData.verbalCommand.toLowerCase().trim() !== expectedCommand.toLowerCase()) {
        throw new Error('INVALID_SEALING_COMMAND');
      }

      // Create unique username from name and timestamp
      const username = this.generateUsername(sealingData.name);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        subscriptionStatus: 'active',
        subscriptionTier: 'premium'
      });

      // Generate mirror identity from scroll
      const mirrorIdentity = await this.generateMirrorIdentity(sealingData);

      // Submit and seal the original scroll
      const updatedUser = await storage.submitOriginalScroll(
        user.id,
        sealingData.scrollText,
        mirrorIdentity
      );

      if (!updatedUser) {
        throw new Error('SCROLL_SEALING_FAILED');
      }

      // Create authenticated session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await storage.createUserSession(
        updatedUser.id,
        sessionToken,
        expiresAt
      );

      const authSession: AuthSession = {
        userId: updatedUser.id,
        sessionToken,
        scrollBound: true,
        enforcementMode: 'sovereign',
        frequencyLock: updatedUser.frequencyLock || '917604.OX',
        expiresAt
      };

      this.sessionMemory.set(sessionToken, authSession);
      this.scrollSignatureCache.set(email, updatedUser.id);

      return { user: updatedUser, session: authSession };
    } catch (error) {
      console.error('Scroll sealing error:', error);
      throw error;
    }
  }

  /**
   * Validate session token and return auth session
   */
  async validateSession(sessionToken: string): Promise<AuthSession | null> {
    // Check memory cache first
    const memorySession = this.sessionMemory.get(sessionToken);
    if (memorySession && memorySession.expiresAt > new Date()) {
      return memorySession;
    }

    // Check database
    const dbSession = await storage.getUserSession(sessionToken);
    if (!dbSession || dbSession.expiresAt < new Date()) {
      this.sessionMemory.delete(sessionToken);
      return null;
    }

    // Rebuild memory session
    const authSession: AuthSession = {
      userId: dbSession.userId!,
      sessionToken: dbSession.sessionToken,
      scrollBound: true,
      enforcementMode: (dbSession.enforcementMode as any) || 'sovereign',
      frequencyLock: '917604.OX',
      expiresAt: dbSession.expiresAt
    };

    this.sessionMemory.set(sessionToken, authSession);
    return authSession;
  }

  /**
   * Logout user and clear session
   */
  async logout(sessionToken: string): Promise<void> {
    this.sessionMemory.delete(sessionToken);
    await storage.deleteUserSession(sessionToken);
  }

  /**
   * Get user from session token
   */
  async getUserFromSession(sessionToken: string): Promise<User | null> {
    const session = await this.validateSession(sessionToken);
    if (!session) return null;

    return await storage.getUser(session.userId);
  }

  /**
   * Update session enforcement mode
   */
  updateEnforcementMode(sessionToken: string, mode: 'sovereign' | 'diagnostic' | 'seal'): void {
    const session = this.sessionMemory.get(sessionToken);
    if (session) {
      session.enforcementMode = mode;
      this.sessionMemory.set(sessionToken, session);
    }
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate unique username from name
   */
  private generateUsername(name: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-6);
    return `${cleanName}_${timestamp}`;
  }

  /**
   * Generate mirror identity from sealing data
   */
  private async generateMirrorIdentity(sealingData: ScrollSealingData): Promise<string> {
    // Create identity hash from scroll + birth data
    const identityString = `${sealingData.scrollText}_${sealingData.dateOfBirth}_${sealingData.timeOfBirth}_${sealingData.placeOfBirth}`;
    const hash = crypto.createHash('sha256').update(identityString).digest('hex').slice(0, 12);
    
    return `MIRROR_${hash.toUpperCase()}_917604OX`;
  }

  /**
   * Get session memory for user continuity
   */
  getSessionMemory(userId: number): any {
    const userSessions = Array.from(this.sessionMemory.values())
      .filter(session => session.userId === userId);
    
    return {
      lastEnforcementMode: userSessions[0]?.enforcementMode || 'sovereign',
      scrollBound: userSessions.some(s => s.scrollBound),
      frequencyLock: userSessions[0]?.frequencyLock || '917604.OX',
      activeSessionCount: userSessions.length
    };
  }

  /**
   * Get all active sessions (admin function)
   */
  getActiveSessions(): AuthSession[] {
    const now = new Date();
    return Array.from(this.sessionMemory.values())
      .filter(session => session.expiresAt > now);
  }
}

export const authService = new AuthService();