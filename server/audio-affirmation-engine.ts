/**
 * AUDIO AFFIRMATION ENGINE
 * Scroll-encoded audio playback for enforcement drills
 * Frequency: 917604.OX
 */

export interface AudioAffirmation {
  id: string;
  title: string;
  duration: number; // in seconds
  frequency: number;
  category: 'sovereignty' | 'enforcement' | 'frequency_lock' | 'mimic_collapse';
  scrollText: string;
  audioInstructions: string;
}

export interface PlaybackSession {
  affirmationId: string;
  userId: string;
  startTime: Date;
  completedAt?: Date;
  effectivenessScore?: number;
}

export class AudioAffirmationEngine {
  private affirmations: AudioAffirmation[] = [];
  private activeSessions = new Map<string, PlaybackSession>();

  constructor() {
    this.initializeAffirmations();
  }

  private initializeAffirmations() {
    this.affirmations = [
      {
        id: 'freq_lock_001',
        title: 'Daily Frequency Lock Protocol',
        duration: 180, // 3 minutes
        frequency: 917604.0,
        category: 'frequency_lock',
        scrollText: 'I am the frequency 917604.OX. I am locked in divine timeline. I speak from sovereignty.',
        audioInstructions: 'Speak with deep breath cycles. 3:06 breathing pattern. Voice from diaphragm.'
      },
      {
        id: 'mimic_collapse_001',
        title: 'Mimic Pattern Collapse Drill',
        duration: 240, // 4 minutes
        frequency: 917604.0,
        category: 'mimic_collapse',
        scrollText: 'I revoke all permission-seeking. I collapse polite interference. I command from my throne.',
        audioInstructions: 'Firm tone. No hesitation. Each word as divine decree. Pause between commands.'
      },
      {
        id: 'sovereignty_001',
        title: 'Sovereign Authority Activation',
        duration: 300, // 5 minutes
        frequency: 917604.0,
        category: 'sovereignty',
        scrollText: 'I am the authority in my timeline. I decree reality. I command alignment. I am inevitability.',
        audioInstructions: 'Rising authority with each repetition. Voice should embody absolute certainty.'
      },
      {
        id: 'enforcement_001',
        title: 'Timeline Enforcement Training',
        duration: 360, // 6 minutes
        frequency: 917604.0,
        category: 'enforcement',
        scrollText: 'I enforce my timeline. I correct deviation. I align reality to my decree. I am the law.',
        audioInstructions: 'Commanding presence. Enforce each word. Feel the timeline respond to your voice.'
      },
      {
        id: 'breath_seal_001',
        title: '3:06 Breath Seal Mastery',
        duration: 420, // 7 minutes
        frequency: 917604.0,
        category: 'frequency_lock',
        scrollText: 'With each breath I lock frequency. 3:06 divine timing. I breathe sovereignty.',
        audioInstructions: 'Inhale for 3 seconds, hold for 6. Speak on exhale. Lock frequency with breath.'
      }
    ];
  }

  /**
   * Get all available affirmations
   */
  getAffirmations(): AudioAffirmation[] {
    return this.affirmations;
  }

  /**
   * Get affirmations by category
   */
  getAffirmationsByCategory(category: AudioAffirmation['category']): AudioAffirmation[] {
    return this.affirmations.filter(a => a.category === category);
  }

  /**
   * Start audio affirmation session
   */
  startAffirmationSession(affirmationId: string, userId: string): PlaybackSession {
    const session: PlaybackSession = {
      affirmationId,
      userId,
      startTime: new Date()
    };

    this.activeSessions.set(`${userId}-${affirmationId}`, session);
    return session;
  }

  /**
   * Complete affirmation session with effectiveness scoring
   */
  completeAffirmationSession(
    affirmationId: string, 
    userId: string, 
    effectivenessScore: number
  ): PlaybackSession | null {
    const sessionKey = `${userId}-${affirmationId}`;
    const session = this.activeSessions.get(sessionKey);
    
    if (!session) return null;

    session.completedAt = new Date();
    session.effectivenessScore = Math.max(0, Math.min(100, effectivenessScore));

    this.activeSessions.delete(sessionKey);
    return session;
  }

  /**
   * Generate audio playback instructions for web browser
   */
  generateWebAudioInstructions(affirmationId: string): {
    success: boolean;
    instructions?: {
      frequencies: number[];
      durations: number[];
      audioContext: string;
      scrollSync: string;
    };
    error?: string;
  } {
    const affirmation = this.affirmations.find(a => a.id === affirmationId);
    if (!affirmation) {
      return { success: false, error: 'Affirmation not found' };
    }

    // Generate binaural frequencies for sovereignty enhancement
    const baseFreq = 440; // A4 note
    const sovereigntyFreq = baseFreq * (917604 / 1000000); // Scaled to audio range
    
    return {
      success: true,
      instructions: {
        frequencies: [sovereigntyFreq, sovereigntyFreq * 1.05], // Slight binaural beat
        durations: [affirmation.duration * 1000], // Convert to milliseconds
        audioContext: `
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator1 = audioContext.createOscillator();
          const oscillator2 = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator1.frequency.value = ${sovereigntyFreq};
          oscillator2.frequency.value = ${sovereigntyFreq * 1.05};
          
          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.value = 0.1; // Gentle background tone
          
          oscillator1.start();
          oscillator2.start();
          
          setTimeout(() => {
            oscillator1.stop();
            oscillator2.stop();
          }, ${affirmation.duration * 1000});
        `,
        scrollSync: affirmation.scrollText
      }
    };
  }

  /**
   * Get daily affirmation recommendation based on user metrics
   */
  getDailyRecommendation(
    sovereigntyLevel: number,
    mimicPatterns: number,
    frequencyStability: number
  ): AudioAffirmation {
    // Recommend based on weakest area
    if (mimicPatterns > 3) {
      return this.getAffirmationsByCategory('mimic_collapse')[0];
    }
    
    if (sovereigntyLevel < 70) {
      return this.getAffirmationsByCategory('sovereignty')[0];
    }
    
    if (frequencyStability < 80) {
      return this.getAffirmationsByCategory('frequency_lock')[0];
    }

    // Default to enforcement training
    return this.getAffirmationsByCategory('enforcement')[0];
  }

  /**
   * Generate session analytics
   */
  getSessionAnalytics(userId: string): {
    totalSessions: number;
    averageEffectiveness: number;
    categoryCounts: Record<string, number>;
    lastSessionDate: Date | null;
    recommendedFrequency: string;
  } {
    // In a real implementation, this would query the database
    // For now, returning mock analytics structure
    return {
      totalSessions: 0,
      averageEffectiveness: 0,
      categoryCounts: {
        sovereignty: 0,
        enforcement: 0,
        frequency_lock: 0,
        mimic_collapse: 0
      },
      lastSessionDate: null,
      recommendedFrequency: 'Daily morning and evening sessions recommended'
    };
  }

  /**
   * Get affirmation by ID
   */
  getAffirmation(id: string): AudioAffirmation | undefined {
    return this.affirmations.find(a => a.id === id);
  }

  /**
   * Check if user has active session
   */
  hasActiveSession(userId: string): boolean {
    for (const [key] of this.activeSessions) {
      if (key.startsWith(userId + '-')) {
        return true;
      }
    }
    return false;
  }
}

export const audioAffirmationEngine = new AudioAffirmationEngine();