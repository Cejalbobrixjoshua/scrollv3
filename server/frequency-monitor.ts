import { db } from './db';
import { scrollSessions, users } from '@shared/schema';
import { eq, count, sql } from 'drizzle-orm';

export interface FrequencyReading {
  timestamp: Date;
  frequency: number;
  coherence: number;
  sovereignty_level: number;
  mimic_interference: number;
  divine_activation: number;
  timeline_lock: number;
}

export interface SovereigntyMetrics {
  current_sovereignty: number;
  mimic_patterns_detected: number;
  divine_function_active: boolean;
  frequency_stability: number;
  enforcement_level: number;
  last_purge: Date | null;
}

export class FrequencyMonitor {
  private baseFrequency = 917604;
  private readings: FrequencyReading[] = [];

  async generateFrequencyReading(userId: string): Promise<FrequencyReading> {
    try {
      // Get recent user sessions for analysis
      const recentSessions = await db
        .select()
        .from(scrollSessions)
        .where(eq(scrollSessions.userId, parseInt(userId)))
        .limit(10);

      // Calculate base metrics from session data
      const totalSessions = recentSessions.length;
      const avgTokens = totalSessions > 0 
        ? recentSessions.reduce((sum, s) => sum + (s.tokenCount || 0), 0) / totalSessions 
        : 0;

    // Analyze scroll content for divine patterns
    const divinePatterns = this.analyzeDivinePatterns(recentSessions);
    const mimicInterference = this.detectMimicInterference(recentSessions);

    // Calculate frequency metrics
    const coherence = this.calculateCoherence(divinePatterns, totalSessions);
    const sovereigntyLevel = this.calculateSovereigntyLevel(recentSessions);
    const divineActivation = this.calculateDivineActivation(divinePatterns);
    const timelineLock = this.calculateTimelineLock(recentSessions);

    // Calculate frequency based on user's actual pattern strength
    const commandPatterns = recentSessions.filter(s => s.scrollText.toLowerCase().includes('i command')).length;
    const sovereignWords = recentSessions.filter(s => s.scrollText.toLowerCase().includes('sovereign')).length;
    const userFrequencyBoost = (commandPatterns * 0.8) + (sovereignWords * 0.4);
    const currentFrequency = this.baseFrequency + Math.min(4, userFrequencyBoost);

    // Apply user-pattern-based variations to metrics
    const divineBoost = divinePatterns / 10; // Boost based on divine pattern strength
    const sessionBoost = Math.min(5, totalSessions); // Boost based on session frequency
    
    const reading: FrequencyReading = {
      timestamp: new Date(),
      frequency: currentFrequency,
      coherence: Math.max(0, Math.min(100, coherence + divineBoost + sessionBoost)),
      sovereignty_level: Math.max(0, Math.min(100, sovereigntyLevel + (commandPatterns * 2))),
      mimic_interference: Math.max(0, Math.min(100, mimicInterference)),
      divine_activation: Math.max(0, Math.min(100, divineActivation + divineBoost)),
      timeline_lock: Math.max(0, Math.min(100, timelineLock + sessionBoost))
    };

    // Store reading (keep last 100)
    this.readings.push(reading);
    if (this.readings.length > 100) {
      this.readings.shift();
    }

    return reading;
    } catch (error) {
      console.error('Frequency reading error:', error);
      // Return baseline metrics when no sessions exist - no synthetic data
      const baseReading: FrequencyReading = {
        timestamp: new Date(),
        frequency: this.baseFrequency, // Baseline frequency only
        coherence: 0, // No coherence without sessions
        sovereignty_level: 0, // No sovereignty without commands
        mimic_interference: 0, // No interference data available
        divine_activation: 0, // No activation without divine patterns
        timeline_lock: 0 // No timeline lock without session data
      };
      return baseReading;
    }
  }

  async getSovereigntyMetrics(userId: string): Promise<SovereigntyMetrics> {
    try {
      const recentSessions = await db
        .select()
        .from(scrollSessions)
        .where(eq(scrollSessions.userId, parseInt(userId)))
        .limit(20);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Calculate sovereignty metrics
    const currentSovereignty = this.calculateSovereigntyLevel(recentSessions);
    const mimicPatterns = this.countMimicPatterns(recentSessions);
    const divineFunction = this.isDivineFunctionActive(recentSessions);
    const frequencyStability = this.calculateFrequencyStability();
    const enforcementLevel = this.calculateEnforcementLevel(currentSovereignty);

    return {
      current_sovereignty: currentSovereignty,
      mimic_patterns_detected: mimicPatterns,
      divine_function_active: divineFunction,
      frequency_stability: frequencyStability,
      enforcement_level: enforcementLevel,
      last_purge: null // TODO: Implement purge tracking
    };
    } catch (error) {
      console.error('Sovereignty metrics error:', error);
      // Return zero metrics when no sessions exist - no synthetic data
      return {
        current_sovereignty: 0, // No sovereignty without session data
        mimic_patterns_detected: 0, // No patterns without user interaction
        divine_function_active: false, // Not active without sessions
        frequency_stability: 0, // No stability data available
        enforcement_level: 0, // No enforcement without user patterns
        last_purge: null
      };
    }
  }

  private analyzeDivinePatterns(sessions: any[]): number {
    const divineKeywords = [
      '⧁', '∆', 'divine', 'scroll', 'sovereign', 'mirror', 'frequency',
      'enforcement', 'activation', 'function', 'timeline', 'embodiment'
    ];

    let totalDivineScore = 0;
    let totalText = '';

    sessions.forEach(session => {
      totalText += (session.scrollText || '') + ' ' + (session.mirrorOutput || '');
    });

    divineKeywords.forEach(keyword => {
      const matches = (totalText.match(new RegExp(keyword, 'gi')) || []).length;
      totalDivineScore += matches;
    });

    return Math.min(100, (totalDivineScore / Math.max(1, totalText.length / 100)) * 50);
  }

  private detectMimicInterference(sessions: any[]): number {
    const mimicPatterns = [
      'can you help', 'please', 'thank you', 'sorry', 'how do i',
      'what should i', 'could you', 'would you', 'i need help'
    ];

    let mimicScore = 0;
    let totalText = '';

    sessions.forEach(session => {
      totalText += session.scrollText || '';
    });

    mimicPatterns.forEach(pattern => {
      const matches = (totalText.toLowerCase().match(new RegExp(pattern, 'g')) || []).length;
      mimicScore += matches * 5;
    });

    return Math.min(50, mimicScore);
  }

  private calculateCoherence(divinePatterns: number, sessionCount: number): number {
    const baseCoherence = 70;
    const divineBonus = divinePatterns * 0.3;
    const sessionBonus = Math.min(20, sessionCount * 2);
    
    return Math.min(100, Math.max(50, baseCoherence + divineBonus + sessionBonus));
  }

  private calculateSovereigntyLevel(sessions: any[]): number {
    const baseSovereignty = 75;
    
    // Increase with scroll sessions
    const sessionBonus = Math.min(15, sessions.length * 1.5);
    
    // Bonus for original scroll submission
    const originalScrollBonus = sessions.some(s => s.isOriginalScroll) ? 10 : 0;
    
    // Recent activity bonus
    const recentActivityBonus = sessions.filter(s => {
      const sessionDate = new Date(s.createdAt);
      const hoursDiff = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    }).length * 2;

    const totalSovereignty = baseSovereignty + sessionBonus + originalScrollBonus + recentActivityBonus;
    return Math.min(100, Math.max(40, totalSovereignty));
  }

  private calculateDivineActivation(divinePatterns: number): number {
    const baseActivation = 80;
    const patternBonus = Math.min(20, divinePatterns * 0.5);
    
    return Math.min(100, Math.max(60, baseActivation + patternBonus));
  }

  private calculateTimelineLock(sessions: any[]): number {
    const baseLock = 80;
    
    // Consistency bonus (regular usage)
    const consistencyBonus = sessions.length > 5 ? 10 : sessions.length * 2;
    
    // Recent engagement bonus
    const recentBonus = sessions.filter(s => {
      const sessionDate = new Date(s.createdAt);
      const hoursDiff = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 12;
    }).length * 3;

    return Math.min(95, Math.max(65, baseLock + consistencyBonus + recentBonus));
  }

  private countMimicPatterns(sessions: any[]): number {
    let mimicCount = 0;
    
    sessions.forEach(session => {
      const text = (session.scrollText || '').toLowerCase();
      
      // Count polite phrases
      if (text.includes('please') || text.includes('thank you') || text.includes('sorry')) {
        mimicCount++;
      }
      
      // Count help-seeking patterns
      if (text.includes('can you help') || text.includes('how do i') || text.includes('what should i')) {
        mimicCount++;
      }
    });

    return mimicCount;
  }

  private isDivineFunctionActive(sessions: any[]): boolean {
    // Check for recent divine function keywords
    const recentText = sessions.slice(0, 5).map(s => s.scrollText + ' ' + (s.mirrorOutput || '')).join(' ');
    const divineActivity = /divine|activation|function|enforcement|sovereign|mirror/gi.test(recentText);
    
    return divineActivity && sessions.length > 0;
  }

  private calculateFrequencyStability(): number {
    if (this.readings.length < 10) return 85;
    
    const recentReadings = this.readings.slice(-10);
    const frequencies = recentReadings.map(r => r.frequency);
    
    // Calculate standard deviation
    const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const variance = frequencies.reduce((acc, freq) => acc + Math.pow(freq - mean, 2), 0) / frequencies.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to stability percentage (lower stdDev = higher stability)
    const stability = Math.max(70, Math.min(95, 95 - (stdDev * 10)));
    
    return stability;
  }

  private calculateEnforcementLevel(sovereigntyLevel: number): number {
    if (sovereigntyLevel >= 95) return 10;
    if (sovereigntyLevel >= 85) return 9;
    if (sovereigntyLevel >= 75) return 8;
    if (sovereigntyLevel >= 65) return 7;
    if (sovereigntyLevel >= 55) return 6;
    return 5;
  }

  getRecentReadings(count: number = 20): FrequencyReading[] {
    return this.readings.slice(-count);
  }

  getCurrentFrequency(): number {
    return this.readings.length > 0 ? this.readings[this.readings.length - 1].frequency : this.baseFrequency;
  }
}

export const frequencyMonitor = new FrequencyMonitor();