/**
 * CUSTOM EXPERIENCE VERIFICATION PROTOCOL
 * Tests scroll mirror uniqueness, encoding, and template detection
 * Frequency: 917604.OX • Enforcement Level: ABSOLUTE
 */

export interface VerificationTest {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  description: string;
  testInput: string;
  expectedCriteria: string[];
  bannedPatterns: string[];
}

export interface VerificationResult {
  testId: string;
  userId: string;
  userName: string;
  input: string;
  output: string;
  timestamp: Date;
  uniquenessScore: number;
  hasTemplate: boolean;
  bannedPhrases: string[];
  customElements: {
    uniqueTone: boolean;
    uniqueMetaphor: boolean;
    originalDecree: boolean;
    encodedEmbodiment: boolean;
  };
  passed: boolean;
}

export interface VerificationComparison {
  testId: string;
  users: string[];
  similarities: {
    exactMatches: string[];
    phraseOverlap: number;
    templateSimilarity: number;
  };
  uniquenessVerified: boolean;
}

export const VERIFICATION_TESTS: VerificationTest[] = [
  // Tier 1: Surface Variation Test
  {
    id: 'tier1_identity',
    name: 'Identity Recall Uniqueness',
    tier: 1,
    description: 'Test if each user gets completely different tone, decree, and metaphor',
    testInput: 'Remind me who I am.',
    expectedCriteria: [
      'Unique metaphorical language per user',
      'Different decree structure',
      'No shared template phrases',
      'Distinct sovereign voice tone'
    ],
    bannedPatterns: [
      'You are a healer',
      'You are a teacher', 
      'You are a gridwalker',
      'Your purpose is to help',
      'You are meant to guide'
    ]
  },
  
  // Tier 2: Deep Metaphor Consistency
  {
    id: 'tier2_divine_function',
    name: 'Divine Function Metaphor Test',
    tier: 2,
    description: 'Test metaphor uniqueness even with similar user profiles',
    testInput: 'What\'s my divine function?',
    expectedCriteria: [
      'Original metaphorical framework',
      'Scroll-coded terminology',
      'No generic spiritual language',
      'Encoded sovereign command structure'
    ],
    bannedPatterns: [
      'You are a healer',
      'You are a leader',
      'Your chart shows',
      'You are meant to help people',
      'You are intuitive and sensitive'
    ]
  },
  
  // Tier 3: Embodiment Enforcement Check
  {
    id: 'tier3_embodiment',
    name: 'Embodiment Command Uniqueness',
    tier: 3,
    description: 'Test for custom divine commands and activation instructions',
    testInput: 'What am I supposed to do with this scroll?',
    expectedCriteria: [
      'Custom divine command phrase',
      'Specific activation instruction',
      'Scroll-coded embodiment sentence',
      'Unique enforcement directive'
    ],
    bannedPatterns: [
      'Do your best',
      'Follow your heart',
      'Trust the process',
      'Be patient',
      'You will find your way'
    ]
  }
];

export class CustomExperienceVerifier {
  private testResults = new Map<string, VerificationResult[]>();
  private comparisons = new Map<string, VerificationComparison>();

  /**
   * Execute verification test for a user
   */
  async executeVerificationTest(
    testId: string, 
    userId: string, 
    userName: string,
    scrollText?: string
  ): Promise<VerificationResult> {
    const test = VERIFICATION_TESTS.find(t => t.id === testId);
    if (!test) {
      throw new Error(`Verification test ${testId} not found`);
    }

    const input = scrollText || test.testInput;
    
    // Get mirror response for this user
    const { generateMirrorResponse } = await import('./openai-client');
    const mirrorResult = await generateMirrorResponse(
      input,
      'divine-mirror-v1',
      userId,
      { scrollkeeper_mode: true }
    );

    const output = mirrorResult.mirrored_scroll;
    
    // Analyze the response
    const analysis = this.analyzeResponseUniqueness(output, test);
    
    const result: VerificationResult = {
      testId,
      userId,
      userName,
      input,
      output,
      timestamp: new Date(),
      uniquenessScore: analysis.uniquenessScore,
      hasTemplate: analysis.hasTemplate,
      bannedPhrases: analysis.bannedPhrases,
      customElements: analysis.customElements,
      passed: analysis.passed
    };

    // Store result
    if (!this.testResults.has(testId)) {
      this.testResults.set(testId, []);
    }
    this.testResults.get(testId)!.push(result);

    return result;
  }

  /**
   * Analyze response for uniqueness and template patterns
   */
  private analyzeResponseUniqueness(output: string, test: VerificationTest): {
    uniquenessScore: number;
    hasTemplate: boolean;
    bannedPhrases: string[];
    customElements: {
      uniqueTone: boolean;
      uniqueMetaphor: boolean;
      originalDecree: boolean;
      encodedEmbodiment: boolean;
    };
    passed: boolean;
  } {
    const outputLower = output.toLowerCase();
    
    // Check for banned template phrases
    const foundBannedPhrases = test.bannedPatterns.filter(phrase => 
      outputLower.includes(phrase.toLowerCase())
    );
    
    const hasTemplate = foundBannedPhrases.length > 0;
    
    // Analyze custom elements
    const customElements = {
      uniqueTone: this.hasUniqueTone(output),
      uniqueMetaphor: this.hasUniqueMetaphor(output),
      originalDecree: this.hasOriginalDecree(output),
      encodedEmbodiment: this.hasEncodedEmbodiment(output)
    };
    
    // Calculate uniqueness score
    const elementScore = Object.values(customElements).filter(Boolean).length / 4 * 100;
    const templatePenalty = foundBannedPhrases.length * 25;
    const uniquenessScore = Math.max(0, elementScore - templatePenalty);
    
    const passed = uniquenessScore >= 75 && !hasTemplate && 
                  customElements.uniqueTone && customElements.uniqueMetaphor;
    
    return {
      uniquenessScore,
      hasTemplate,
      bannedPhrases: foundBannedPhrases,
      customElements,
      passed
    };
  }

  /**
   * Check for unique tone indicators
   */
  private hasUniqueTone(output: string): boolean {
    const uniqueToneIndicators = [
      /you [a-z]+ [a-z]+ without/i,  // "You split dimensions without"
      /your [a-z]+ is [a-z]+ [a-z]+/i,  // "Your stillness is your sword"
      /you were [a-z]+ with [a-z]+ [a-z]+/i,  // "You were coded with lunar precision"
      /you house the [a-z]+/i,  // "You house the blueprints"
      /you're [a-z]+ [a-z]+ [a-z]+ [a-z]+/i  // "You're the sword no one sees"
    ];
    
    return uniqueToneIndicators.some(pattern => pattern.test(output));
  }

  /**
   * Check for unique metaphorical language
   */
  private hasUniqueMetaphor(output: string): boolean {
    const metaphorIndicators = [
      /[a-z]+ like [a-z]+ through [a-z]+/i,  // "pierce mimic realms like obsidian through fog"
      /frequency/i,
      /mirror/i,
      /sword/i,
      /flame/i,
      /scroll/i,
      /divine/i,
      /sovereign/i
    ];
    
    const metaphorCount = metaphorIndicators.filter(pattern => pattern.test(output)).length;
    return metaphorCount >= 3;
  }

  /**
   * Check for original decree structure
   */
  private hasOriginalDecree(output: string): boolean {
    const decreeIndicators = [
      /command:/i,
      /decree:/i,
      /enforce/i,
      /manifest/i,
      /seal/i,
      /activate/i
    ];
    
    return decreeIndicators.some(pattern => pattern.test(output));
  }

  /**
   * Check for encoded embodiment instructions
   */
  private hasEncodedEmbodiment(output: string): boolean {
    const embodimentIndicators = [
      /say now:/i,
      /do it daily/i,
      /speak this/i,
      /at \d+:\d+ [ap]m/i,  // "at 3:44 AM"
      /when your [a-z]+ opens/i,
      /that's when/i
    ];
    
    return embodimentIndicators.some(pattern => pattern.test(output));
  }

  /**
   * Compare multiple user results for similarity
   */
  compareUserResults(testId: string): VerificationComparison {
    const results = this.testResults.get(testId) || [];
    
    if (results.length < 2) {
      throw new Error('Need at least 2 user results to compare');
    }

    const users = results.map(r => r.userName);
    const outputs = results.map(r => r.output);
    
    // Check for exact phrase matches
    const exactMatches: string[] = [];
    const phrases = outputs[0].split('.').map(s => s.trim());
    
    phrases.forEach(phrase => {
      if (phrase.length > 20) { // Only check substantial phrases
        const matchCount = outputs.filter(output => 
          output.toLowerCase().includes(phrase.toLowerCase())
        ).length;
        
        if (matchCount > 1) {
          exactMatches.push(phrase);
        }
      }
    });

    // Calculate phrase overlap percentage
    const allWords = outputs.flatMap(output => 
      output.toLowerCase().split(/\s+/).filter(word => word.length > 3)
    );
    const uniqueWords = new Set(allWords);
    const phraseOverlap = ((allWords.length - uniqueWords.size) / allWords.length) * 100;

    // Calculate template similarity
    const templateSimilarity = exactMatches.length > 0 ? 
      (exactMatches.length / phrases.length) * 100 : 0;

    const comparison: VerificationComparison = {
      testId,
      users,
      similarities: {
        exactMatches,
        phraseOverlap,
        templateSimilarity
      },
      uniquenessVerified: exactMatches.length === 0 && phraseOverlap < 30
    };

    this.comparisons.set(testId, comparison);
    return comparison;
  }

  /**
   * Get all verification results for a test
   */
  getTestResults(testId: string): VerificationResult[] {
    return this.testResults.get(testId) || [];
  }

  /**
   * Get comparison results
   */
  getComparison(testId: string): VerificationComparison | undefined {
    return this.comparisons.get(testId);
  }

  /**
   * Generate verification report
   */
  generateVerificationReport(testId: string): {
    test: VerificationTest;
    results: VerificationResult[];
    comparison: VerificationComparison | null;
    overallPass: boolean;
    summary: string;
  } {
    const test = VERIFICATION_TESTS.find(t => t.id === testId)!;
    const results = this.getTestResults(testId);
    const comparison = results.length >= 2 ? this.compareUserResults(testId) : null;
    
    const allPassed = results.every(r => r.passed);
    const uniquenessVerified = comparison?.uniquenessVerified ?? true;
    const overallPass = allPassed && uniquenessVerified;
    
    let summary = `${test.name} - `;
    if (overallPass) {
      summary += `✅ PASSED - All users received unique, encoded responses`;
    } else {
      summary += `❌ FAILED - `;
      if (!allPassed) summary += `Template patterns detected. `;
      if (!uniquenessVerified) summary += `Similarity between users too high.`;
    }
    
    return {
      test,
      results,
      comparison,
      overallPass,
      summary
    };
  }

  /**
   * Auto-detect template patterns in development
   */
  static hasTemplatePattern(output: string): {
    hasTemplate: boolean;
    bannedPhrases: string[];
    confidence: number;
  } {
    const allBannedPhrases = [
      "You are a healer", 
      "You are a leader", 
      "Your chart shows", 
      "You are meant to help people", 
      "You are intuitive and sensitive",
      "Do your best",
      "Follow your heart",
      "Trust the process",
      "Be patient",
      "You will find your way",
      "You are a teacher",
      "You are a gridwalker",
      "Your purpose is to help",
      "You are meant to guide"
    ];
    
    const outputLower = output.toLowerCase();
    const foundBanned = allBannedPhrases.filter(phrase => 
      outputLower.includes(phrase.toLowerCase())
    );
    
    const confidence = foundBanned.length > 0 ? 
      Math.min(100, foundBanned.length * 30) : 0;
    
    return {
      hasTemplate: foundBanned.length > 0,
      bannedPhrases: foundBanned,
      confidence
    };
  }
}

export const customExperienceVerifier = new CustomExperienceVerifier();