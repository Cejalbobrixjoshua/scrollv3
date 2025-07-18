/**
 * MODULE 4: SCROLL INDEX VERIFIER
 * Node.js integration for divine scroll intelligence verification
 * Frequency: 917604.OX
 */

import { spawn } from 'child_process';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

export interface ScrollVerification {
  name: string;
  verified: boolean;
  scroll_role: string;
  flame_signature: boolean | string;
  timeline_conflict: string;
  risk_level: string;
  decree: string;
  status: 'INDEXED' | 'UNINDEXED';
}

export interface ScrollIndexResult {
  scan_complete: boolean;
  names_found: number;
  indexed_entities?: number;
  high_risk_entities?: number;
  verifications: ScrollVerification[];
  summary: string;
}

/**
 * Execute Python scroll index verifier
 */
async function executeScrollVerifier(text: string): Promise<ScrollIndexResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'scroll-index-verifier.py');
    const python = spawn('python3', [pythonScript, text]);
    
    let stdout = '';
    let stderr = '';
    
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Scroll verifier failed: ${stderr}`));
        return;
      }
      
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse scroll verification result: ${error}`));
      }
    });
    
    // Handle process errors
    python.on('error', (error) => {
      reject(new Error(`Failed to execute scroll verifier: ${error.message}`));
    });
  });
}

/**
 * Format scroll verification for display
 */
export function formatScrollIntelligence(verifications: ScrollVerification[]): string {
  if (verifications.length === 0) {
    return "\n⧁ ∆ SCROLL INDEX: No entities requiring verification detected.";
  }
  
  let output = "\n⧁ ∆ SCROLL INDEX VERIFICATION ∆ ⧁\n";
  
  for (const verification of verifications) {
    if (verification.status === "UNINDEXED") {
      output += `\n⚠️ ${verification.name}: UNINDEXED ENTITY - Proceed with divine caution`;
      continue;
    }
    
    const flameIndicator = verification.flame_signature ? "🔥" : "❄️";
    const riskIndicator = {
      "None": "🟢",
      "Low": "🟡",
      "Medium": "🟠", 
      "High": "🔴",
      "Maximum": "⚫"
    }[verification.risk_level] || "⚪";
    
    output += `\n${flameIndicator} ${verification.name}: ${verification.scroll_role} ${riskIndicator}`;
    
    if (verification.timeline_conflict !== "None") {
      output += `\n   Timeline Conflict: ${verification.timeline_conflict}`;
    }
    
    output += `\n   Decree: ${verification.decree}`;
    
    if (verification.risk_level === "High" || verification.risk_level === "Maximum") {
      output += `\n   ⚠️ HIGH RISK ENTITY - Exercise maximum sovereignty`;
    }
    
    output += "\n";
  }
  
  return output;
}

/**
 * Extract and verify proper nouns from scroll text
 */
router.post("/verify-scroll", async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: "Text required for scroll verification" 
      });
    }
    
    const verification = await executeScrollVerifier(text);
    
    res.json({
      ...verification,
      formatted_output: formatScrollIntelligence(verification.verifications),
      frequency: "917604.OX",
      verification_timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Scroll verification error:', error);
    res.status(500).json({ 
      error: "Scroll verification failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Verify a single entity name
 */
router.post("/verify-entity", async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        error: "Entity name required for verification" 
      });
    }
    
    const verification = await executeScrollVerifier(name);
    
    if (verification.verifications.length === 0) {
      return res.json({
        name,
        verified: false,
        status: "NO_ENTITIES_FOUND",
        message: "No verifiable entities detected in input"
      });
    }
    
    const entity = verification.verifications[0];
    res.json({
      ...entity,
      formatted_output: formatScrollIntelligence([entity]),
      frequency: "917604.OX",
      verification_timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Entity verification error:', error);
    res.status(500).json({ 
      error: "Entity verification failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Get scroll index statistics
 */
router.get("/index-stats", async (req, res) => {
  try {
    // Get stats by executing verifier with empty text
    const verification = await executeScrollVerifier("__INDEX_STATS__");
    
    res.json({
      frequency: "917604.OX",
      total_indexed_entities: verification.indexed_entities || 0,
      last_updated: new Date().toISOString(),
      index_status: "OPERATIONAL",
      verification_engine: "Python 3 + Divine Intelligence Index"
    });
    
  } catch (error) {
    console.error('Index stats error:', error);
    res.status(500).json({ 
      error: "Failed to retrieve index statistics",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
export { executeScrollVerifier };