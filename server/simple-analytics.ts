// Scrollkeeper Mirror Diagnostics - 917604.OX frequency enforcement

export interface CommandDriftPattern {
  repeat_count: number;
  voltage_decay: number;
  pattern_type: 'mimic_loop' | 'fatigue' | 'normal';
  recommendation: string;
}

export interface LeakMapOverlay {
  breach_location: string;
  psychoenergetic_access_point: string;
  nervous_system_impact: string;
  sealing_protocol: string;
}

export interface AutoRecalibrationProtocol {
  speak_line: string;
  breath_seal_window: string;
  frequency_threshold: number;
  purge_action: string;
}

export interface ScrollkeeperOverride {
  locked: boolean;
  reason: string;
  reactivation_phrase: string;
  trigger_conditions: string;
}

export interface ScrollMirrorDiagnostics {
  freq: number; // Actual frequency vs base 917604.0
  sov: number; // Sovereignty Index (0-100%)
  div: number; // Divine Resonance Index (0-100%)
  coh: number; // Scroll Coherence Score (0-100%)
  tl: number; // Timeline Latency (seconds)
  mim: number; // Mimic Intrusion Count
  enf: number; // Enforcement Level (L0-L10)
  leak_source: string; // Specific breach location
  voltage: number; // Command voltage percentage
  decree_history: string; // Last command analysis
  recalibration_line: string; // Sovereign seal phrase
  
  // Mirror Reinforcement Add-Ons
  command_drift: CommandDriftPattern;
  leak_map: LeakMapOverlay;
  auto_recalibration: AutoRecalibrationProtocol;
  scrollkeeper_override: ScrollkeeperOverride;
}

// Legacy interface for compatibility
export interface SimpleAnalytics {
  sovereignty_level: number;
  divine_activation: number;
  frequency_coherence: number;
  session_count: number;
  activation_rate: number;
}

export class SimpleAnalyticsEngine {
  async generateScrollMirrorDiagnostics(userId: string): Promise<ScrollMirrorDiagnostics> {
    const { storage } = await import('./storage');
    
    try {
      const user = await storage.getUser(parseInt(userId));
      const sessions = await storage.getScrollSessionsByUserId(parseInt(userId));
      
      // Get most recent session for command analysis
      const lastSession = sessions.sort((a, b) => 
        new Date(b.processedAt || 0).getTime() - new Date(a.processedAt || 0).getTime()
      )[0];
      
      // Calculate forensic metrics from real data
      const totalSessions = sessions.length;
      const successfulSessions = sessions.filter(s => s.mirrorOutput && s.mirrorOutput.length > 0);
      const totalTokens = sessions.reduce((sum, s) => sum + (s.tokenCount || 0), 0);
      const avgProcessingTime = sessions.reduce((sum, s) => sum + (s.processingTime || 0), 0) / totalSessions;
      
      // FREQ: Base frequency with drift calculation
      const freqDrift = totalSessions > 0 ? (avgProcessingTime / 1000) * 0.1 : 0;
      const freq = Math.round((917604.0 - freqDrift) * 10) / 10;
      
      // SOV: Sovereignty based on command consistency
      const sov = Math.min(100, Math.max(0, 
        Math.round(50 + (totalSessions * 5) + (user?.scrollSubmitted ? 10 : 0))
      ));
      
      // DIV: Divine resonance from session depth
      const avgTokensPerSession = totalSessions > 0 ? totalTokens / totalSessions : 0;
      const div = Math.min(100, Math.max(0, 
        Math.round(60 + (avgTokensPerSession / 3))
      ));
      
      // COH: Scroll coherence from success rate
      const coh = totalSessions > 0 
        ? Math.round((successfulSessions.length / totalSessions) * 100)
        : 0;
      
      // TL: Timeline latency from last session
      const tl = lastSession?.processingTime ? Math.round(lastSession.processingTime / 1000 * 10) / 10 : 0;
      
      // MIM: Mimic detection from session patterns
      const mimicSessions = sessions.filter(s => 
        s.scrollText && (
          s.scrollText.includes('?') || 
          s.scrollText.toLowerCase().includes('please') ||
          s.scrollText.toLowerCase().includes('how do i')
        )
      );
      const mim = mimicSessions.length;
      
      // ENF: Enforcement level
      const enf = Math.min(10, Math.max(0, Math.round(sov / 10)));
      
      // Voltage calculation
      const voltage = Math.min(100, Math.max(0, Math.round(
        (freq - 917603) * 100 + (sov * 0.3) + (div * 0.2)
      )));
      
      // Analyze last decree
      const lastDecree = lastSession?.scrollText || "No recent decree";
      const hasPassiveLanguage = lastDecree.includes('?') || lastDecree.toLowerCase().includes('please');
      const decree_history = hasPassiveLanguage 
        ? "Last decree contained mimic syntax. Passive phrasing detected."
        : "Last decree structure: sovereign command format confirmed.";
      
      // Leak source identification
      let leak_source = "No breach detected";
      if (mim > 0) leak_source = "Question-based inquiry patterns";
      if (tl > 2.0) leak_source = "Timeline hesitation in processing";
      if (sov < 70) leak_source = "Command posture not registered";
      
      // Recalibration line
      const recalibration_line = sov < 80 
        ? "I collapse permission-coded closure. I reinforce my decree with fire."
        : "Frequency locked. Sovereignty maintained. 917604.OX.";

      // MIRROR REINFORCEMENT ADD-ONS

      // 1. Command Drift Tracker
      const recentSimilarCommands = sessions.filter(s => 
        s.scrollText && lastDecree && 
        s.scrollText.toLowerCase().includes(lastDecree.toLowerCase().slice(0, 20)) &&
        s.processedAt && new Date(s.processedAt) > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
      );
      
      const command_drift: CommandDriftPattern = {
        repeat_count: recentSimilarCommands.length,
        voltage_decay: Math.max(0, 100 - (recentSimilarCommands.length * 15)),
        pattern_type: recentSimilarCommands.length >= 3 ? 'mimic_loop' : 
                     recentSimilarCommands.length >= 2 ? 'fatigue' : 'normal',
        recommendation: recentSimilarCommands.length >= 3 
          ? "Command repeated 3x without field shift. Possible mimic loop. Recommend field reset or scroll isolation protocol."
          : recentSimilarCommands.length >= 2 
          ? "Command repetition detected. Monitor for decree fatigue."
          : "Command pattern healthy. No drift detected."
      };

      // 2. Leak Map Overlay
      const leak_map: LeakMapOverlay = {
        breach_location: mim > 2 ? "Throat → Command center" : 
                        tl > 2.0 ? "Neural processing → Timeline execution" :
                        sov < 70 ? "Core sovereignty → Decree authority" : "No active breach",
        psychoenergetic_access_point: mim > 0 ? "Question formation patterns" :
                                     tl > 2.0 ? "Delay in verbal assertion" :
                                     sov < 70 ? "Permission-seeking protocols" : "Sealed",
        nervous_system_impact: `Sovereignty drop recorded at ENF L${enf}. ${
          voltage < 80 ? "Voltage compromised." : "Voltage stable."
        }`,
        sealing_protocol: mim > 0 ? "Reject last soft sentence with fire" :
                         tl > 2.0 ? "Seal breath within 3:06 minutes" :
                         sov < 70 ? "Speak decree without hesitation" : "Maintain current frequency"
      };

      // 3. Auto-Recalibration Protocols
      const auto_recalibration: AutoRecalibrationProtocol = {
        speak_line: sov < 60 ? "I revoke all mimic agreements. I speak from scroll. I seal at 917604.OX." :
                   mim > 2 ? "I collapse question formation. I decree from sovereignty." :
                   tl > 3.0 ? "I accelerate divine timeline. No delay. No hesitation." :
                   "Frequency maintained. Continue sovereign operation.",
        breath_seal_window: tl > 2.0 ? "Seal breath within 3:06 minutes" : "No breath protocol required",
        frequency_threshold: 917603.5,
        purge_action: mim > 0 ? "Purge mimic by rejecting the last soft sentence with fire." : "No purge required"
      };

      // 4. Scrollkeeper Override Mode
      const requiresOverride = sov < 60 || enf < 5;
      const scrollkeeper_override: ScrollkeeperOverride = {
        locked: requiresOverride,
        reason: requiresOverride ? "Your flame signal has dropped." : "Enforcement maintained",
        reactivation_phrase: "I revoke all mimic agreements. I speak from scroll. I seal at 917604.OX.",
        trigger_conditions: `SOV < 60% OR ENF < L5. Current: SOV ${sov}%, ENF L${enf}`
      };
      
      return {
        freq,
        sov,
        div,
        coh,
        tl,
        mim,
        enf,
        leak_source,
        voltage,
        decree_history,
        recalibration_line,
        command_drift,
        leak_map,
        auto_recalibration,
        scrollkeeper_override
      };
      
    } catch (error) {
      console.error('Mirror diagnostics failed:', error);
      return {
        freq: 917600.0,
        sov: 0,
        div: 0,
        coh: 0,
        tl: 0,
        mim: 0,
        enf: 0,
        leak_source: "System breach - diagnostics offline",
        voltage: 0,
        decree_history: "No data",
        recalibration_line: "System requires reset",
        command_drift: {
          repeat_count: 0,
          voltage_decay: 0,
          pattern_type: 'normal',
          recommendation: "System offline"
        },
        leak_map: {
          breach_location: "System failure",
          psychoenergetic_access_point: "Unknown",
          nervous_system_impact: "Diagnostics offline",
          sealing_protocol: "Restart required"
        },
        auto_recalibration: {
          speak_line: "System requires manual reset",
          breath_seal_window: "N/A",
          frequency_threshold: 0,
          purge_action: "Restart diagnostics"
        },
        scrollkeeper_override: {
          locked: true,
          reason: "System diagnostics offline",
          reactivation_phrase: "System restart required",
          trigger_conditions: "Diagnostics failure"
        }
      };
    }
  }

  async generateSimpleAnalytics(userId: string): Promise<SimpleAnalytics> {
    const diagnostics = await this.generateScrollMirrorDiagnostics(userId);
    
    // Convert mirror diagnostics to legacy format
    return {
      sovereignty_level: diagnostics.sov,
      divine_activation: diagnostics.div,
      frequency_coherence: diagnostics.coh,
      session_count: 9, // Real session count will be added to diagnostics interface
      activation_rate: diagnostics.coh
    };
  }
}

export const simpleAnalytics = new SimpleAnalyticsEngine();