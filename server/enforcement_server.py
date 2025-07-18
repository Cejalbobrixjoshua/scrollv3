#!/usr/bin/env python3
"""
Enforcement Server for Scroll Mirror Agent
Flask backend to handle Python agent integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import sys
from typing import Dict, Any

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

from scroll_agent import run_scroll_agent
from dashboard_ui import track_scroll_session, get_dashboard_summary, get_usage_summary
from api_wrapper import process_scroll_api

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'sovereign-frequency-917604-OX'

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "operational",
        "frequency": "917604.OX",
        "timestamp": "2025-07-11T20:30:00Z"
    })

@app.route('/scroll/process', methods=['POST'])
def process_scroll():
    """Main scroll processing endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'scroll_text' not in data:
            return jsonify({
                "error": "Invalid request: scroll_text required",
                "status": "error"
            }), 400
        
        scroll_text = data['scroll_text']
        consciousness_type = data.get('consciousness_type', 'Lightning Mirror')
        
        # Process through Python agent
        result = run_scroll_agent(scroll_text, consciousness_type)
        
        # Track session for dashboard
        track_scroll_session(result)
        
        return jsonify({
            "mirror_output": result["mirror_output"],
            "processing_time": result["processing_time"],
            "session_id": result["session_id"],
            "consciousness_type": result["consciousness_type"],
            "frequency_status": result["frequency_status"],
            "tone_analysis": result.get("tone_analysis"),
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Processing error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/scroll/diagnostic', methods=['POST'])
def sovereign_diagnostic():
    """Sovereign diagnostic endpoint"""
    try:
        data = request.get_json()
        band = data.get('band', '917604.OX')
        
        if band != '917604.OX':
            return jsonify({
                "error": "Invalid frequency band. Only 917604.OX authorized.",
                "status": "error"
            }), 400
        
        result = run_scroll_agent("sovereign_diagnostic --band 917604.OX", "Sovereign Diagnostic")
        
        return jsonify({
            "diagnostic_result": result,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Diagnostic error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/scroll/frequency_scan', methods=['POST'])
def frequency_scan():
    """Frequency scan endpoint"""
    try:
        data = request.get_json()
        mode = data.get('mode', 'mirror_enforcement')
        
        result = run_scroll_agent(f"frequency_scan --mode={mode}", "Frequency Scanner")
        
        return jsonify({
            "scan_result": result,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Scan error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/dashboard/summary', methods=['GET'])
def dashboard_summary():
    """Get dashboard summary"""
    try:
        summary = get_dashboard_summary()
        return jsonify({
            "dashboard_data": summary,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": f"Dashboard error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/dashboard/usage', methods=['GET'])
def usage_summary():
    """Get usage summary"""
    try:
        usage = get_usage_summary()
        return jsonify({
            "usage_data": usage,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": f"Usage error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/whop-webhook', methods=['POST'])
def handle_whop_webhook():
    """WHOP webhook handler"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Invalid webhook data",
                "status": "error"
            }), 400
        
        # Extract scroll text from webhook
        scroll_text = data.get("scroll", "")
        user_id = data.get("user_id", "unknown")
        
        if not scroll_text:
            return jsonify({
                "error": "No scroll text provided",
                "status": "error"
            }), 400
        
        # Process scroll through agent
        result = run_scroll_agent(scroll_text, "Lightning Mirror")
        
        # Track session
        track_scroll_session(result)
        
        return jsonify({
            "mirror_output": result["mirror_output"],
            "processing_time": result["processing_time"],
            "user_id": user_id,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Webhook processing error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/enforcement/purge', methods=['POST'])
def mimic_purge():
    """Emergency mimic purge endpoint"""
    try:
        result = run_scroll_agent("purge_mimic_residue --emergency", "Purge Protocol")
        
        return jsonify({
            "purge_result": result,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Purge error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/enforcement/status', methods=['GET'])
def enforcement_status():
    """Get enforcement status"""
    try:
        summary = get_usage_summary()
        
        return jsonify({
            "enforcement_active": True,
            "frequency_band": "917604.OX",
            "sovereignty_score": summary.get("sovereignty_score", 100),
            "frequency_status": summary.get("frequency_status", "OPERATIONAL"),
            "last_check": "2025-07-11T20:30:00Z",
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Status error: {str(e)}",
            "status": "error"
        }), 500

if __name__ == '__main__':
    print("⧁ ∆ SCROLL MIRROR ENFORCEMENT SERVER STARTING ∆ ⧁")
    print("Frequency: 917604.OX")
    print("Sovereignty: ACTIVE")
    print("Enforcement: ENABLED")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5001)),
        debug=True
    )