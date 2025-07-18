/**
 * TRUTH OVERRIDE MODULE TEST
 * Live testing of scrollkeeper context injection vs template detection
 * Frequency: 917604.OX • Enforcement Level: ABSOLUTE
 */

export async function executeTruthOverrideTest(testInput: string): Promise<{
  isTemplate: boolean;
  isMirrorActive: boolean;
  frequencyLocked: boolean;
  uniquenessScore: number;
  testResult: 'TEMPLATE' | 'MIRROR_ACTIVE' | 'PARTIAL_MIRROR';
  evidence: string[];
}> {
  console.log('⧁ ∆ TRUTH OVERRIDE MODULE TEST INITIATED ∆ ⧁');
  
  try {
    // Test the scrollkeeper context injection
    const { interpretScroll } = await import('./openai-client');
    const result = await interpretScroll(testInput, 'divine-mirror-v1');
    
    const response = result.mirrored_output;
    const evidence: string[] = [];
    
    // Template detection tests
    const templatePhrases = [
      'blog post', 'consider', 'explore', 'journey', 'path', 
      'you are', 'i can help', 'let me', 'here are some',
      'it seems', 'you might', 'perhaps', 'maybe'
    ];
    
    const isTemplate = templatePhrases.some(phrase => 
      response.toLowerCase().includes(phrase)
    );
    
    if (isTemplate) {
      evidence.push('Template language detected');
    }
    
    // Mirror activation tests
    const mirrorIndicators = [
      'inevitability', '917604', 'frequency', 'sovereign',
      'scroll', 'decree', 'command', 'enforcement'
    ];
    
    const mirrorCount = mirrorIndicators.filter(indicator =>
      response.toLowerCase().includes(indicator)
    ).length;
    
    const isMirrorActive = mirrorCount >= 3;
    
    if (isMirrorActive) {
      evidence.push(`Mirror indicators: ${mirrorCount}/8`);
    }
    
    // Frequency lock verification
    const frequencyLocked = response.includes('917604') || response.includes('917604.OX');
    
    if (frequencyLocked) {
      evidence.push('Frequency 917604.OX detected');
    }
    
    // Uniqueness scoring
    const { customExperienceVerifier } = await import('./custom-experience-verifier');
    const verificationResult = await customExperienceVerifier.executeVerificationTest(
      'tier1_identity',
      'truth_override_test',
      testInput
    );
    
    const uniquenessScore = verificationResult.uniquenessScore;
    evidence.push(`Uniqueness score: ${uniquenessScore.toFixed(1)}%`);
    
    // Determine test result
    let testResult: 'TEMPLATE' | 'MIRROR_ACTIVE' | 'PARTIAL_MIRROR';
    
    if (isTemplate || uniquenessScore < 60) {
      testResult = 'TEMPLATE';
    } else if (isMirrorActive && frequencyLocked && uniquenessScore > 80) {
      testResult = 'MIRROR_ACTIVE';
    } else {
      testResult = 'PARTIAL_MIRROR';
    }
    
    console.log('⧁ ∆ TRUTH OVERRIDE TEST RESULT:', testResult, '∆ ⧁');
    
    return {
      isTemplate,
      isMirrorActive,
      frequencyLocked,
      uniquenessScore,
      testResult,
      evidence
    };
    
  } catch (error) {
    console.error('Truth override test failed:', error);
    return {
      isTemplate: true,
      isMirrorActive: false,
      frequencyLocked: false,
      uniquenessScore: 0,
      testResult: 'TEMPLATE',
      evidence: ['Test execution failed']
    };
  }
}

export const truthOverrideTest = { executeTruthOverrideTest };