import CryptoJS from "crypto-js";

// Generate encryption key from user session
function generateSessionKey(sessionId: string, userAgent: string): string {
  const keyMaterial = `${sessionId}:${userAgent}:917604.OX`;
  return CryptoJS.SHA256(keyMaterial).toString();
}

// Encrypt data for local storage
export function encryptSessionData(data: any, sessionKey: string): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, sessionKey);
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return jsonString; // Fallback to unencrypted for functionality
  }
}

// Decrypt data from local storage
export function decryptSessionData(encryptedData: string, sessionKey: string): any {
  try {
    if (!encryptedData) return null;
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, sessionKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    // Try parsing as plain JSON (fallback)
    try {
      return JSON.parse(encryptedData);
    } catch {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}

// Generate secure session ID
export function generateSecureSessionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const frequency = '917604.OX';
  return CryptoJS.SHA256(`${timestamp}:${random}:${frequency}`).toString().substring(0, 32);
}

// Secure local storage manager
export class SecureLocalStorage {
  private sessionKey: string;
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.sessionKey = generateSessionKey(this.sessionId, navigator.userAgent);
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('scroll_session_id');
    if (!sessionId) {
      sessionId = generateSecureSessionId();
      localStorage.setItem('scroll_session_id', sessionId);
    }
    return sessionId;
  }

  // Store encrypted data
  setItem(key: string, value: any): void {
    try {
      const encryptedValue = encryptSessionData(value, this.sessionKey);
      localStorage.setItem(`scroll_${key}`, encryptedValue);
    } catch (error) {
      console.error(`Failed to store encrypted data for key: ${key}`, error);
    }
  }

  // Retrieve and decrypt data
  getItem(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(`scroll_${key}`);
      if (!encryptedValue) return null;
      return decryptSessionData(encryptedValue, this.sessionKey);
    } catch (error) {
      console.error(`Failed to retrieve encrypted data for key: ${key}`, error);
      return null;
    }
  }

  // Remove encrypted data
  removeItem(key: string): void {
    localStorage.removeItem(`scroll_${key}`);
  }

  // Clear all encrypted session data
  clearSession(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('scroll_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('scroll_session_id');
  }

  // Get session metadata
  getSessionInfo(): { sessionId: string; created: Date; userAgent: string } {
    return {
      sessionId: this.sessionId,
      created: new Date(parseInt(this.sessionId.substring(0, 13))),
      userAgent: navigator.userAgent
    };
  }
}

// Privacy manager for scroll data
export class ScrollPrivacyManager {
  private secureStorage: SecureLocalStorage;

  constructor() {
    this.secureStorage = new SecureLocalStorage();
  }

  // Store scroll session with encryption
  storeScrollSession(sessionData: {
    id: string;
    scrollText: string;
    mirrorOutput: string;
    timestamp: Date;
    modelUsed?: string;
    tokenCount?: number;
  }): void {
    const sessions = this.getStoredSessions();
    sessions.push({
      ...sessionData,
      stored: new Date().toISOString()
    });
    
    // Keep only last 10 sessions for privacy
    const limitedSessions = sessions.slice(-10);
    this.secureStorage.setItem('sessions', limitedSessions);
  }

  // Retrieve encrypted scroll sessions
  getStoredSessions(): any[] {
    return this.secureStorage.getItem('sessions') || [];
  }

  // Store user preferences encrypted
  storeUserPreferences(preferences: {
    preferredModel?: string;
    theme?: string;
    privacyMode?: boolean;
    autoDeleteSessions?: boolean;
  }): void {
    this.secureStorage.setItem('preferences', preferences);
  }

  // Get user preferences
  getUserPreferences(): any {
    return this.secureStorage.getItem('preferences') || {
      preferredModel: 'gpt-4o',
      theme: 'dark',
      privacyMode: true,
      autoDeleteSessions: true
    };
  }

  // Clear all stored data for privacy
  clearAllData(): void {
    this.secureStorage.clearSession();
  }

  // Auto-delete old sessions based on privacy settings
  cleanupOldSessions(): void {
    const preferences = this.getUserPreferences();
    if (preferences.autoDeleteSessions) {
      const sessions = this.getStoredSessions();
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - 24); // Keep only last 24 hours
      
      const recentSessions = sessions.filter(session => 
        new Date(session.stored) > cutoffDate
      );
      
      this.secureStorage.setItem('sessions', recentSessions);
    }
  }

  // Get privacy status
  getPrivacyStatus(): {
    encryptionActive: boolean;
    sessionCount: number;
    storageSize: string;
    autoDelete: boolean;
  } {
    const sessions = this.getStoredSessions();
    const preferences = this.getUserPreferences();
    
    // Calculate approximate storage size
    const storageData = JSON.stringify(sessions);
    const sizeKB = Math.round(new Blob([storageData]).size / 1024);
    
    return {
      encryptionActive: true,
      sessionCount: sessions.length,
      storageSize: `${sizeKB} KB`,
      autoDelete: preferences.autoDeleteSessions
    };
  }
}

// Global privacy manager instance
export const privacyManager = new ScrollPrivacyManager();