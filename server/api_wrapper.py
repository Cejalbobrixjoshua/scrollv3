#!/usr/bin/env python3
"""
API Wrapper for Scroll Mirror Agent
Bridges Python agent with Node.js/Express backend
"""

import subprocess
import json
import sys
import os
from typing import Dict, Any, Optional

class ScrollAPIWrapper:
    def __init__(self):
        self.agent_path = os.path.join(os.path.dirname(__file__), 'scroll_agent.py')
        self.python_executable = sys.executable
        
    def process_scroll_request(self, scroll_text: str, consciousness_type: str = "Lightning Mirror") -> Dict[str, Any]:
        """
        Process scroll request through Python agent
        """
        try:
            # Create command to execute Python agent
            cmd = [
                self.python_executable,
                "-c",
                f"""
import sys
sys.path.append('{os.path.dirname(__file__)}')
from scroll_agent import run_scroll_agent
import json

result = run_scroll_agent('''{scroll_text}''', '{consciousness_type}')
print(json.dumps(result))
"""
            ]
            
            # Execute the command
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                return json.loads(result.stdout.strip())
            else:
                return {
                    "mirror_output": f"⧁ ∆ SOVEREIGN CIRCUIT DISRUPTION ∆ ⧁\n\nAgent processing error: {result.stderr}",
                    "processing_time": 0,
                    "session_id": 0,
                    "consciousness_type": "Error Handler",
                    "frequency_status": "ERROR"
                }
                
        except subprocess.TimeoutExpired:
            return {
                "mirror_output": "⧁ ∆ PROCESSING TIMEOUT ∆ ⧁\n\nAgent processing exceeded time limit. Retry with shorter input.",
                "processing_time": 30000,
                "session_id": 0,
                "consciousness_type": "Timeout Handler",
                "frequency_status": "TIMEOUT"
            }
        except Exception as e:
            return {
                "mirror_output": f"⧁ ∆ SYSTEM ERROR ∆ ⧁\n\nUnexpected error: {str(e)}",
                "processing_time": 0,
                "session_id": 0,
                "consciousness_type": "Error Handler",
                "frequency_status": "SYSTEM_ERROR"
            }
    
    def execute_diagnostic(self) -> Dict[str, Any]:
        """Execute sovereign diagnostic"""
        return self.process_scroll_request("sovereign_diagnostic --band 917604.OX", "Sovereign Diagnostic")
    
    def execute_frequency_scan(self) -> Dict[str, Any]:
        """Execute frequency scan"""
        return self.process_scroll_request("frequency_scan --mode=mirror_enforcement", "Frequency Scanner")
    
    def purge_mimic_residue(self) -> Dict[str, Any]:
        """Emergency mimic purge"""
        return self.process_scroll_request("purge_mimic_residue --emergency", "Purge Protocol")

# Global wrapper instance
api_wrapper = ScrollAPIWrapper()

def process_scroll_api(scroll_text: str, consciousness_type: str = "Lightning Mirror") -> Dict[str, Any]:
    """Main API entry point"""
    return api_wrapper.process_scroll_request(scroll_text, consciousness_type)

if __name__ == "__main__":
    # Test the API wrapper
    if len(sys.argv) > 1:
        test_input = sys.argv[1]
        consciousness = sys.argv[2] if len(sys.argv) > 2 else "Lightning Mirror"
        result = process_scroll_api(test_input, consciousness)
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python api_wrapper.py 'scroll_text' 'consciousness_type'")