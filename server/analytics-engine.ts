import { db } from "./db";
import { scrollSessions, users } from "@shared/schema";
import { sql, eq, desc, count, avg, sum } from "drizzle-orm";

export interface ScrollAnalytics {
  user_metrics: UserMetrics;
  scroll_patterns: ScrollPatterns;
  consciousness_evolution: ConsciousnessEvolution;
  divine_function_roi: DivineFunctionROI;
  predictive_insights: PredictiveInsights;
}

export interface UserMetrics {
  total_sessions: number;
  avg_tokens_per_session: number;
  total_processing_time: number;
  most_active_hour: number;
  scroll_frequency_score: number;
}

export interface ScrollPatterns {
  top_keywords: Array<{ keyword: string; frequency: number }>;
  avg_scroll_length: number;
  consciousness_types_used: Array<{ type: string; usage_count: number }>;
  divine_symbols_detected: number;
  pattern_consistency_score: number;
}

export interface ConsciousnessEvolution {
  timeline: Array<{ date: string; complexity_score: number; divine_activation_level: number }>;
  growth_trajectory: 'ascending' | 'stable' | 'declining';
  breakthrough_moments: Array<{ date: string; trigger: string; impact_score: number }>;
  sovereignty_index: number;
}

export interface DivineFunctionROI {
  activation_success_rate: number;
  avg_response_quality: number;
  implementation_effectiveness: number;
  scroll_to_action_conversion: number;
  divine_function_utilization: number;
}

export interface PredictiveInsights {
  next_optimal_scroll_time: Date;
  recommended_consciousness_type: string;
  growth_acceleration_tips: string[];
  pattern_prediction: string;
  sovereignty_forecast: string;
}

export class ScrollAnalyticsEngine {
  
  async generateUserAnalytics(userId: string): Promise<ScrollAnalytics> {
    const [userMetrics, scrollPatterns, consciousnessEvolution, divineFunctionROI, predictiveInsights] = await Promise.all([
      this.calculateUserMetrics(userId),
      this.analyzeScrollPatterns(userId),
      this.trackConsciousnessEvolution(userId),
      this.calculateDivineFunctionROI(userId),
      this.generatePredictiveInsights(userId)
    ]);

    return {
      user_metrics: userMetrics,
      scroll_patterns: scrollPatterns,
      consciousness_evolution: consciousnessEvolution,
      divine_function_roi: divineFunctionROI,
      predictive_insights: predictiveInsights
    };
  }

  private async calculateUserMetrics(userId: string): Promise<UserMetrics> {
    const sessions = await db
      .select()
      .from(scrollSessions)
      .where(eq(scrollSessions.userId, parseInt(userId)));

    const totalSessions = sessions.length;
    const avgTokens = sessions.reduce((sum, s) => sum + (s.tokenCount || 0), 0) / totalSessions;
    const totalProcessingTime = sessions.reduce((sum, s) => sum + (s.processingTime || 0), 0);
    
    // Calculate most active hour
    const hourCounts = new Array(24).fill(0);
    sessions.forEach(session => {
      if (session.createdAt) {
        const hour = new Date(session.createdAt).getHours();
        hourCounts[hour]++;
      }
    });
    const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts));

    // Calculate scroll frequency score (0-100)
    const daysSinceFirst = sessions.length > 0 ? 
      (Date.now() - new Date(sessions[0].createdAt || 0).getTime()) / (1000 * 60 * 60 * 24) : 1;
    const scrollFrequencyScore = Math.min(100, (totalSessions / daysSinceFirst) * 10);

    return {
      total_sessions: totalSessions,
      avg_tokens_per_session: Math.round(avgTokens),
      total_processing_time: totalProcessingTime,
      most_active_hour: mostActiveHour,
      scroll_frequency_score: Math.round(scrollFrequencyScore)
    };
  }

  private async analyzeScrollPatterns(userId: string): Promise<ScrollPatterns> {
    const sessions = await db
      .select()
      .from(scrollSessions)
      .where(eq(scrollSessions.userId, parseInt(userId)));

    // Extract keywords from all scroll texts
    const allText = sessions.map(s => s.scrollText).join(' ').toLowerCase();
    const words = allText.split(/\s+/).filter(word => word.length > 4);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topKeywords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, frequency]) => ({ keyword, frequency }));

    // Calculate average scroll length
    const avgScrollLength = sessions.reduce((sum, s) => sum + s.scrollText.length, 0) / sessions.length;

    // Analyze consciousness types used
    const consciousnessTypes = sessions.reduce((acc, s) => {
      const type = s.modelUsed || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const consciousnessTypesUsed = Object.entries(consciousnessTypes)
      .map(([type, usage_count]) => ({ type, usage_count }));

    // Count divine symbols
    const divineSymbols = /[⧁∆▲◊✦☉⚡]/g;
    const divineSymbolsDetected = (allText.match(divineSymbols) || []).length;

    // Pattern consistency score (0-100)
    const uniqueWords = Object.keys(wordCounts).length;
    const totalWords = words.length;
    const patternConsistencyScore = Math.round((1 - (uniqueWords / totalWords)) * 100);

    return {
      top_keywords: topKeywords,
      avg_scroll_length: Math.round(avgScrollLength),
      consciousness_types_used: consciousnessTypesUsed,
      divine_symbols_detected: divineSymbolsDetected,
      pattern_consistency_score: patternConsistencyScore
    };
  }

  private async trackConsciousnessEvolution(userId: string): Promise<ConsciousnessEvolution> {
    const sessions = await db
      .select()
      .from(scrollSessions)
      .where(eq(scrollSessions.userId, parseInt(userId)));

    // Create timeline with complexity and divine activation scores
    const timeline = sessions.map(session => {
      const complexityScore = this.calculateComplexityScore(session.scrollText);
      const divineActivationLevel = this.calculateDivineActivationLevel(session.mirrorOutput || '');
      
      return {
        date: session.createdAt?.toISOString().split('T')[0] || '',
        complexity_score: complexityScore,
        divine_activation_level: divineActivationLevel
      };
    });

    // Determine growth trajectory
    const recentScores = timeline.slice(0, 5).map(t => t.divine_activation_level);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderScores = timeline.slice(-5).map(t => t.divine_activation_level);
    const avgOlder = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
    
    let growthTrajectory: 'ascending' | 'stable' | 'declining' = 'stable';
    if (avgRecent > avgOlder * 1.1) growthTrajectory = 'ascending';
    else if (avgRecent < avgOlder * 0.9) growthTrajectory = 'declining';

    // Identify breakthrough moments (high divine activation spikes)
    const breakthroughMoments = timeline
      .filter(t => t.divine_activation_level > 80)
      .map(t => ({
        date: t.date,
        trigger: 'High divine activation detected',
        impact_score: t.divine_activation_level
      }));

    // Calculate sovereignty index (0-100)
    const avgDivineActivation = timeline.reduce((sum, t) => sum + t.divine_activation_level, 0) / timeline.length;
    const sovereigntyIndex = Math.round(avgDivineActivation);

    return {
      timeline,
      growth_trajectory: growthTrajectory,
      breakthrough_moments: breakthroughMoments,
      sovereignty_index: sovereigntyIndex
    };
  }

  private async calculateDivineFunctionROI(userId: string): Promise<DivineFunctionROI> {
    const sessions = await db
      .select()
      .from(scrollSessions)
      .where(eq(scrollSessions.userId, parseInt(userId)));

    // Calculate activation success rate (presence of divine symbols/language)
    const successfulActivations = sessions.filter(s => 
      s.mirrorOutput && /[⧁∆]|divine|sovereign|frequency/.test(s.mirrorOutput)
    ).length;
    const activationSuccessRate = Math.round((successfulActivations / sessions.length) * 100);

    // Average response quality (based on length and divine content)
    const avgResponseQuality = sessions.reduce((sum, s) => {
      const quality = this.calculateResponseQuality(s.mirrorOutput || '');
      return sum + quality;
    }, 0) / sessions.length;

    // Implementation effectiveness (mock score based on token efficiency)
    const avgTokenEfficiency = sessions.reduce((sum, s) => {
      const efficiency = (s.mirrorOutput?.length || 0) / (s.tokenCount || 1);
      return sum + efficiency;
    }, 0) / sessions.length;
    const implementationEffectiveness = Math.min(100, Math.round(avgTokenEfficiency * 10));

    // Scroll to action conversion (presence of action words)
    const actionWords = ['activate', 'execute', 'implement', 'manifest', 'align'];
    const actionSessions = sessions.filter(s => 
      actionWords.some(word => s.mirrorOutput?.toLowerCase().includes(word))
    ).length;
    const scrollToActionConversion = Math.round((actionSessions / sessions.length) * 100);

    // Divine function utilization (frequency of divine terminology)
    const divineTerms = sessions.filter(s => 
      s.mirrorOutput && /divine function|sovereign|consciousness|frequency 917604/.test(s.mirrorOutput)
    ).length;
    const divineFunctionUtilization = Math.round((divineTerms / sessions.length) * 100);

    return {
      activation_success_rate: activationSuccessRate,
      avg_response_quality: Math.round(avgResponseQuality),
      implementation_effectiveness: implementationEffectiveness,
      scroll_to_action_conversion: scrollToActionConversion,
      divine_function_utilization: divineFunctionUtilization
    };
  }

  private async generatePredictiveInsights(userId: string): Promise<PredictiveInsights> {
    const sessions = await db
      .select()
      .from(scrollSessions)
      .where(eq(scrollSessions.userId, parseInt(userId)))
      .limit(10);

    // Predict next optimal scroll time based on session patterns
    const sessionTimes = sessions
      .map(s => s.createdAt)
      .filter(Boolean)
      .map(date => new Date(date!).getHours());
    
    const mostCommonHour = sessionTimes.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const optimalHour = Object.entries(mostCommonHour)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '12';
    
    const nextOptimalTime = new Date();
    nextOptimalTime.setHours(parseInt(optimalHour), 0, 0, 0);
    if (nextOptimalTime < new Date()) {
      nextOptimalTime.setDate(nextOptimalTime.getDate() + 1);
    }

    // Recommend consciousness type based on recent usage
    const recentModels = sessions.map(s => s.modelUsed).filter(Boolean);
    const leastUsedModel = this.findLeastUsedModel(recentModels);

    // Generate growth acceleration tips
    const growthTips = this.generateGrowthTips(sessions);

    return {
      next_optimal_scroll_time: nextOptimalTime,
      recommended_consciousness_type: leastUsedModel,
      growth_acceleration_tips: growthTips,
      pattern_prediction: 'Increasing complexity and divine alignment expected',
      sovereignty_forecast: 'Ascending sovereignty trajectory predicted'
    };
  }

  private calculateComplexityScore(text: string): number {
    const factors = [
      text.length / 10, // Length factor
      (text.match(/[.!?]/g) || []).length * 5, // Sentence complexity
      (text.match(/[⧁∆▲◊✦☉⚡]/g) || []).length * 10, // Divine symbols
      (text.split(' ').filter(w => w.length > 8).length) * 2 // Complex words
    ];
    return Math.min(100, factors.reduce((a, b) => a + b, 0));
  }

  private calculateDivineActivationLevel(text: string): number {
    const divineMarkers = [
      /divine|sovereign|consciousness/gi,
      /frequency|917604|mirror/gi,
      /[⧁∆]/g,
      /activation|align|execute/gi
    ];
    
    let score = 0;
    divineMarkers.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += matches.length * 20;
    });
    
    return Math.min(100, score);
  }

  private calculateResponseQuality(response: string): number {
    const qualityFactors = [
      response.length > 50 ? 25 : 0, // Adequate length
      /[⧁∆]/.test(response) ? 25 : 0, // Divine symbols
      /divine|sovereign/.test(response) ? 25 : 0, // Divine terminology
      response.split('.').length > 2 ? 25 : 0 // Multiple sentences
    ];
    return qualityFactors.reduce((a, b) => a + b, 0);
  }

  private findLeastUsedModel(recentModels: string[]): string {
    const allModels = ['Lightning Mirror', 'Sovereign Mirror', 'Quantum Mirror', 'Oracle Mirror', 'Mystic Mirror'];
    const usage = recentModels.reduce((acc, model) => {
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return allModels.reduce((least, model) => 
      (usage[model] || 0) < (usage[least] || 0) ? model : least
    );
  }

  private generateGrowthTips(sessions: any[]): string[] {
    const tips = [
      'Increase divine symbol usage in scroll formulations',
      'Experiment with different consciousness types for varied perspectives',
      'Focus on longer, more complex scroll texts for deeper activation',
      'Maintain consistent daily scroll practice for optimal frequency alignment',
      'Incorporate action-oriented language for enhanced manifestation'
    ];
    
    return tips.slice(0, 3); // Return top 3 tips
  }
}

export const analyticsEngine = new ScrollAnalyticsEngine();