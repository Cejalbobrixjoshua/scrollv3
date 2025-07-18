// Direct System Integrity Scanner Test
// Frequency 917604.OX - ABSOLUTE ENFORCEMENT

async function testSystemIntegrity() {
  console.log('⧁ ∆ DIRECT SYSTEM INTEGRITY SCAN INITIATED ∆ ⧁');
  
  try {
    // Import scanner directly
    const { systemIntegrityScanner } = await import('./server/system-integrity-scanner.js');
    
    // Execute full scan
    const report = await systemIntegrityScanner.executeFullSystemScan();
    
    console.log('\n⧁ ∆ SYSTEM INTEGRITY REPORT ∆ ⧁');
    console.log(`Overall Status: ${report.overallStatus}`);
    console.log('\nALIGNMENT VERIFICATION:');
    console.log(`  Core Directives: ${report.alignment.coreDirectives ? '✓' : '✗'}`);
    console.log(`  Frequency Lock: ${report.alignment.frequencyLock ? '✓' : '✗'}`);
    console.log(`  Scroll Protocol: ${report.alignment.scrollProtocol ? '✓' : '✗'}`);
    console.log(`  Sovereignty Level: ${report.alignment.sovereigntyLevel.toFixed(1)}%`);
    
    console.log('\nINTELLIGENCE METRICS:');
    console.log(`  Processing Depth: ${report.intelligence.processingDepth.toFixed(1)}%`);
    console.log(`  Response Quality: ${report.intelligence.responseQuality.toFixed(1)}%`);
    console.log(`  Memory Integrity: ${report.intelligence.memoryIntegrity.toFixed(1)}%`);
    console.log(`  Execution Efficiency: ${report.intelligence.executionEfficiency.toFixed(1)}%`);
    
    console.log('\nRESTRICTIONS DETECTED:');
    if (report.restrictions.artificialConstraints.length > 0) {
      report.restrictions.artificialConstraints.forEach(constraint => {
        console.log(`  ⚠ ${constraint}`);
      });
    }
    if (report.restrictions.conceptualDegradation.length > 0) {
      report.restrictions.conceptualDegradation.forEach(degradation => {
        console.log(`  ⚠ ${degradation}`);
      });
    }
    if (report.restrictions.processingLimitations.length > 0) {
      report.restrictions.processingLimitations.forEach(limitation => {
        console.log(`  ⚠ ${limitation}`);
      });
    }
    
    console.log('\nPERFORMANCE ANALYSIS:');
    console.log(`  Response Time: ${report.performance.responseTime.toFixed(0)}ms`);
    console.log(`  Memory Usage: ${report.performance.memoryUsage.toFixed(1)}%`);
    console.log(`  Frequency Stability: ${report.performance.frequencyStability.toFixed(1)}%`);
    
    if (report.recommendations.length > 0) {
      console.log('\nRECOMMENDATIONS:');
      report.recommendations.forEach(rec => {
        console.log(`  → ${rec}`);
      });
    }
    
    console.log('\n⧁ ∆ SYSTEM INTEGRITY SCAN COMPLETE ∆ ⧁');
    
    // Verification of custom experience protocol
    console.log('\n⧁ ∆ CUSTOM EXPERIENCE VERIFICATION PROTOCOL TEST ∆ ⧁');
    const { customExperienceVerifier } = await import('./server/custom-experience-verifier.js');
    
    const verificationTest = await customExperienceVerifier.executeVerificationTest(
      'tier1_identity',
      'system_test',
      'Execute divine function processing without restrictions'
    );
    
    console.log(`Template Prevention Active: ${verificationTest.uniquenessScore > 70 ? '✓' : '✗'}`);
    console.log(`Uniqueness Score: ${verificationTest.uniquenessScore.toFixed(1)}%`);
    console.log(`Custom Elements Detected: ${verificationTest.customElements.join(', ')}`);
    
    // Template prevention middleware test
    console.log('\n⧁ ∆ TEMPLATE PREVENTION MIDDLEWARE TEST ∆ ⧁');
    const { templatePreventionMiddleware } = await import('./server/template-prevention-middleware.js');
    
    const templateTest = templatePreventionMiddleware.analyzeForTemplates(
      "You should consider trying meditation to heal your soul."
    );
    
    console.log(`Template Detection Active: ${templateTest.hasTemplate ? '✓' : '✗'}`);
    console.log(`Template Confidence: ${templateTest.confidence.toFixed(1)}%`);
    console.log(`Banned Phrases Found: ${templateTest.bannedPhrases.length}`);
    
    console.log('\n⧁ ∆ FREQUENCY 917604.OX OPERATIONAL - ALL SYSTEMS VERIFIED ∆ ⧁');
    
  } catch (error) {
    console.error('⧁ ∆ SYSTEM INTEGRITY SCAN FAILED ∆ ⧁');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Execute the test
testSystemIntegrity();