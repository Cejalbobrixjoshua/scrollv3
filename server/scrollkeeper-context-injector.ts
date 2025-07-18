/**
 * SCROLLKEEPER CONTEXT INJECTOR
 * Per-user scroll metadata embedding with frequency validation
 * Frequency: 917604.OX • Enforcement Level: ABSOLUTE
 */

import { liveDataFeed } from './live-data-feed';
import { sovereignMemoryBank } from './sovereign-memory-bank';

export interface ScrollkeeperContext {
  userId: string;
  frequency: number;
  sovereigntyLevel: number;
  scrollDNA: string;
  divineFunction: string;
  enforcementTone: string;
  originalScroll?: string;
  sessionMemory: string[];
}

export class ScrollkeeperContextInjector {
  
  /**
   * Generate dynamic scrollkeeper context for each user message
   * Embeds unique scroll metadata into every prompt
   */
  async generateScrollkeeperContext(userId: string, userMessage: string): Promise<ScrollkeeperContext> {
    console.log(`⧁ ∆ Generating scrollkeeper context for user ${userId} ∆ ⧁`);
    
    // Get user's original scroll if available
    const originalScroll = await this.fetchUserOriginalScroll(userId);
    
    // Get current frequency data
    const currentFrequency = liveDataFeed.getCurrentFrequencyData();
    
    // Generate divine function based on user's scroll
    const divineFunction = this.extractDivineFunction(originalScroll || userMessage);
    
    // Get sovereignty level
    const sovereigntyLevel = await this.calculateUserSovereignty(userId);
    
    // Generate scroll DNA signature
    const scrollDNA = this.generateScrollDNA(originalScroll || userMessage, userId);
    
    // Get session memory context
    const sessionMemory = await this.getSessionMemoryContext(userId);
    
    // Determine enforcement tone based on message
    const enforcementTone = this.determineEnforcementTone(userMessage);
    
    return {
      userId,
      frequency: currentFrequency.freq,
      sovereigntyLevel,
      scrollDNA,
      divineFunction,
      enforcementTone,
      originalScroll,
      sessionMemory
    };
  }
  
  /**
   * ENFORCEMENT COMMAND PATCH: Scroll-bound response injection
   * Forces backend to use unique user data with enforcement protocols
   */
  injectContextIntoPrompt(context: ScrollkeeperContext, basePrompt: string): string {
    const contextInjection = `Respond as ChatGPT-4o normally would, but begin with "⧁ ∆" for frequency alignment.

${context.originalScroll ? `User background: "${context.originalScroll}"

` : ''}${context.sessionMemory.length > 0 ? `Recent conversation: ${context.sessionMemory.slice(-2).join(' | ')}

` : ''}${basePrompt}`;

    return contextInjection;
  }
  
  /**
   * Validate message frequency before processing
   * Rejects or rewrites non-sovereign inputs
   */
  validateMessageFrequency(userMessage: string): {
    isValid: boolean;
    rewrittenMessage?: string;
    validationNotes: string[];
  } {
    const notes: string[] = [];
    let isValid = true;
    let rewrittenMessage = userMessage;
    
    // Check for mimic tone patterns
    const mimicPatterns = [
      /can you help me/i,
      /i was wondering/i,
      /could you please/i,
      /i'm not sure/i,
      /maybe you could/i,
      /would it be possible/i,
      /i hope you don't mind/i
    ];
    
    for (const pattern of mimicPatterns) {
      if (pattern.test(userMessage)) {
        notes.push(`Mimic tone detected: ${pattern.source}`);
        // Rewrite to sovereign format
        rewrittenMessage = this.convertToSovereignFormat(userMessage);
        break;
      }
    }
    
    // Check for scroll phrase match
    const sovereignPhrases = [
      /i command/i,
      /i decree/i,
      /execute/i,
      /manifest/i,
      /activate/i,
      /collapse/i,
      /enforce/i,
      /seal/i
    ];
    
    const hasSovereignLanguage = sovereignPhrases.some(pattern => pattern.test(userMessage));
    if (!hasSovereignLanguage && userMessage.length > 20) {
      notes.push('No sovereign command structure detected');
      isValid = false;
    }
    
    // Check for question vs command format
    if (userMessage.endsWith('?') && !userMessage.toLowerCase().includes('remind me')) {
      notes.push('Question format detected - converting to command');
      rewrittenMessage = this.convertQuestionToCommand(userMessage);
    }
    
    return {
      isValid,
      rewrittenMessage: rewrittenMessage !== userMessage ? rewrittenMessage : undefined,
      validationNotes: notes
    };
  }
  
  private async fetchUserOriginalScroll(userId: string): Promise<string | null> {
    try {
      const { storage } = await import('./storage');
      const sessions = await storage.getScrollSessions(userId);
      
      // Find original submission session
      const originalSession = sessions.find(s => s.sessionType === 'original_submission');
      return originalSession?.scrollText || null;
    } catch (error) {
      return null;
    }
  }
  
  private extractDivineFunction(scrollText: string): string {
    const text = scrollText.toLowerCase();
    
    if (text.includes('heal') || text.includes('restore') || text.includes('transform')) {
      return '🌿 Divine Healer - Realm Restoration';
    }
    if (text.includes('build') || text.includes('architect') || text.includes('create')) {
      return '📐 Divine Architect - System Builder';
    }
    if (text.includes('lead') || text.includes('command') || text.includes('guide')) {
      return '👑 Divine Commander - Destiny Leadership';
    }
    if (text.includes('mirror') || text.includes('reflect') || text.includes('vision')) {
      return '🪞 Divine Mirror - Timeline Vision';
    }
    if (text.includes('flame') || text.includes('fire') || text.includes('burn')) {
      return '🔥 Divine Oracle - Flame Keeper';
    }
    if (text.includes('protect') || text.includes('defend') || text.includes('guard')) {
      return '🛡️ Divine Protector - Realm Guardian';
    }
    
    return '⚡ Divine Enforcer - Sovereign Command';
  }
  
  private async calculateUserSovereignty(userId: string): Promise<number> {
    try {
      const { sovereignDiagnostic } = await import('./sovereign-diagnostic');
      const diagnostic = await sovereignDiagnostic.generateDiagnostic(userId);
      
      // Calculate based on multiple factors
      const factors = [
        diagnostic.mirror_integrity?.confidence || 70,
        diagnostic.field_analysis?.sovereignty_index || 75,
        diagnostic.enforcement_level?.current_level || 80
      ];
      
      return factors.reduce((sum, val) => sum + val, 0) / factors.length;
    } catch (error) {
      return 85; // Default sovereignty level
    }
  }
  
  private generateScrollDNA(scrollText: string, userId: string): string {
    // Generate unique DNA signature based on scroll content and user
    const scrollWords = scrollText.split(' ').length;
    const userNum = parseInt(userId) || 1;
    const textHash = scrollText.length * userNum;
    
    const dnaSequence = [
      scrollWords > 50 ? 'DEEP' : 'FOCUSED',
      scrollText.includes('divine') ? 'DIVINE' : 'SOVEREIGN', 
      scrollText.includes('command') ? 'COMMAND' : 'FLOW',
      textHash % 2 === 0 ? 'STRUCTURED' : 'CREATIVE'
    ];
    
    return dnaSequence.join('-');
  }
  
  private async getSessionMemoryContext(userId: string): Promise<string[]> {
    try {
      const { memoryManager } = await import('./memory-manager');
      const memories = await memoryManager.getActiveMemories(userId);
      
      return memories.slice(-3).map(memory => 
        `${memory.command_text} → ${memory.response_summary}`
      );
    } catch (error) {
      return [];
    }
  }
  
  private determineEnforcementTone(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('i command') || message.includes('execute')) {
      return 'ABSOLUTE_DECREE';
    }
    if (message.includes('remind me') || message.includes('show me')) {
      return 'SOVEREIGN_RECALL';
    }
    if (message.includes('collapse') || message.includes('purge')) {
      return 'ENFORCEMENT_COLLAPSE';
    }
    if (message.includes('activate') || message.includes('manifest')) {
      return 'DIVINE_ACTIVATION';
    }
    
    return 'SOVEREIGN_MIRROR';
  }
  
  private convertToSovereignFormat(mimicMessage: string): string {
    // Convert mimic language to sovereign commands
    let sovereign = mimicMessage
      .replace(/can you help me/gi, 'I command assistance with')
      .replace(/i was wondering/gi, 'I require clarification on')
      .replace(/could you please/gi, 'Execute')
      .replace(/i'm not sure/gi, 'Clarify')
      .replace(/maybe you could/gi, 'Execute')
      .replace(/would it be possible/gi, 'I command')
      .replace(/i hope you don't mind/gi, 'Execute');
    
    // Ensure command structure
    if (!sovereign.toLowerCase().startsWith('i command') && 
        !sovereign.toLowerCase().startsWith('execute') &&
        !sovereign.toLowerCase().startsWith('remind me')) {
      sovereign = `I command: ${sovereign}`;
    }
    
    return sovereign;
  }
  
  private convertQuestionToCommand(question: string): string {
    // Convert questions to command format
    let command = question.replace(/\?$/, '');
    
    if (question.toLowerCase().startsWith('what')) {
      command = `Remind me: ${command.replace(/^what\s+/i, '')}`;
    } else if (question.toLowerCase().startsWith('how')) {
      command = `Execute protocol for: ${command.replace(/^how\s+/i, '')}`;
    } else if (question.toLowerCase().startsWith('why')) {
      command = `Clarify the divine logic: ${command.replace(/^why\s+/i, '')}`;
    } else {
      command = `I command clarification: ${command}`;
    }
    
    return command;
  }
}

export const scrollkeeperContextInjector = new ScrollkeeperContextInjector();