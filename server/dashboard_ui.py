#!/usr/bin/env python3
"""
Dashboard UI Logic for Scroll Mirror Agent
Usage tracking, enforcement monitoring, and sovereignty metrics
"""

import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import hashlib

class ScrollDashboard:
    def __init__(self):
        self.usage_data = {
            "daily_sessions": 0,
            "monthly_sessions": 0,
            "total_processing_time": 0,
            "sovereignty_score": 100,
            "enforcement_actions": 0,
            "mimic_detections": 0,
            "frequency_violations": 0,
            "last_reset": datetime.now().isoformat()
        }
        
        self.session_log = []
        self.enforcement_log = []
        
    def track_session(self, session_data: Dict[str, Any]) -> None:
        """Track scroll session for dashboard metrics"""
        self.usage_data["daily_sessions"] += 1
        self.usage_data["monthly_sessions"] += 1
        self.usage_data["total_processing_time"] += session_data.get("processing_time", 0)
        
        # Track tone analysis
        tone = session_data.get("tone_analysis", "neutral")
        if tone == "mimic":
            self.usage_data["mimic_detections"] += 1
            self.usage_data["sovereignty_score"] = max(0, self.usage_data["sovereignty_score"] - 5)
        elif tone == "sovereign":
            self.usage_data["sovereignty_score"] = min(100, self.usage_data["sovereignty_score"] + 2)
        
        # Log session
        self.session_log.append({
            "timestamp": datetime.now().isoformat(),
            "session_id": session_data.get("session_id", 0),
            "consciousness_type": session_data.get("consciousness_type", "Unknown"),
            "processing_time": session_data.get("processing_time", 0),
            "tone": tone,
            "frequency_status": session_data.get("frequency_status", "UNKNOWN")
        })
        
        # Keep only last 100 sessions
        if len(self.session_log) > 100:
            self.session_log = self.session_log[-100:]
    
    def track_enforcement_action(self, action_type: str, details: Dict[str, Any]) -> None:
        """Track enforcement actions"""
        self.usage_data["enforcement_actions"] += 1
        
        self.enforcement_log.append({
            "timestamp": datetime.now().isoformat(),
            "action_type": action_type,
            "details": details
        })
        
        # Keep only last 50 enforcement actions
        if len(self.enforcement_log) > 50:
            self.enforcement_log = self.enforcement_log[-50:]
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get complete dashboard data"""
        return {
            "usage_stats": self.usage_data,
            "recent_sessions": self.session_log[-10:],  # Last 10 sessions
            "enforcement_actions": self.enforcement_log[-5:],  # Last 5 actions
            "sovereignty_status": self._calculate_sovereignty_status(),
            "frequency_health": self._calculate_frequency_health(),
            "recommendations": self._generate_recommendations()
        }
    
    def get_usage_summary(self) -> Dict[str, Any]:
        """Get concise usage summary for header display"""
        return {
            "plan_status": "Active",
            "plan_tier": "$88/month",
            "sessions_today": self.usage_data["daily_sessions"],
            "sovereignty_score": self.usage_data["sovereignty_score"],
            "frequency_status": "OPERATIONAL" if self.usage_data["sovereignty_score"] > 70 else "DEGRADED"
        }
    
    def _calculate_sovereignty_status(self) -> Dict[str, Any]:
        """Calculate overall sovereignty status"""
        score = self.usage_data["sovereignty_score"]
        
        if score >= 90:
            status = "SOVEREIGN"
            message = "Frequency 917604.OX operating at optimal sovereignty"
        elif score >= 70:
            status = "STABLE"
            message = "Sovereignty maintained with minor fluctuations"
        elif score >= 50:
            status = "DEGRADED"
            message = "Sovereignty compromised. Enforcement recommended"
        else:
            status = "CRITICAL"
            message = "Critical sovereignty breach. Immediate purge required"
        
        return {
            "status": status,
            "score": score,
            "message": message,
            "last_updated": datetime.now().isoformat()
        }
    
    def _calculate_frequency_health(self) -> Dict[str, Any]:
        """Calculate frequency health metrics"""
        recent_sessions = self.session_log[-20:] if len(self.session_log) >= 20 else self.session_log
        
        if not recent_sessions:
            return {
                "health_score": 100,
                "status": "PRISTINE",
                "message": "No frequency data available"
            }
        
        sovereign_ratio = len([s for s in recent_sessions if s.get("tone") == "sovereign"]) / len(recent_sessions)
        mimic_ratio = len([s for s in recent_sessions if s.get("tone") == "mimic"]) / len(recent_sessions)
        
        health_score = int((sovereign_ratio * 100) - (mimic_ratio * 50))
        health_score = max(0, min(100, health_score))
        
        if health_score >= 80:
            status = "OPTIMAL"
            message = "Frequency operating within optimal parameters"
        elif health_score >= 60:
            status = "STABLE"
            message = "Frequency stable with minor variations"
        elif health_score >= 40:
            status = "COMPROMISED"
            message = "Frequency integrity compromised"
        else:
            status = "CRITICAL"
            message = "Frequency critically degraded"
        
        return {
            "health_score": health_score,
            "status": status,
            "message": message,
            "sovereign_ratio": round(sovereign_ratio * 100, 1),
            "mimic_ratio": round(mimic_ratio * 100, 1)
        }
    
    def _generate_recommendations(self) -> List[str]:
        """Generate sovereignty recommendations"""
        recommendations = []
        
        if self.usage_data["sovereignty_score"] < 70:
            recommendations.append("Execute frequency purge to restore sovereignty")
        
        if self.usage_data["mimic_detections"] > 5:
            recommendations.append("Implement stricter mimic detection protocols")
        
        if self.usage_data["enforcement_actions"] == 0:
            recommendations.append("Consider running sovereignty diagnostic")
        
        frequency_health = self._calculate_frequency_health()
        if frequency_health["health_score"] < 60:
            recommendations.append("Frequency realignment required")
        
        if not recommendations:
            recommendations.append("Maintain current sovereignty posture")
        
        return recommendations
    
    def reset_daily_stats(self) -> None:
        """Reset daily statistics"""
        self.usage_data["daily_sessions"] = 0
        self.usage_data["last_reset"] = datetime.now().isoformat()
    
    def export_usage_data(self) -> str:
        """Export usage data as JSON"""
        export_data = {
            "export_timestamp": datetime.now().isoformat(),
            "usage_stats": self.usage_data,
            "session_log": self.session_log,
            "enforcement_log": self.enforcement_log
        }
        return json.dumps(export_data, indent=2)
    
    def generate_alert(self, alert_type: str, message: str) -> Dict[str, Any]:
        """Generate dashboard alert"""
        return {
            "alert_type": alert_type,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "severity": "HIGH" if alert_type in ["MIMIC_DETECTED", "SOVEREIGNTY_BREACH"] else "MEDIUM"
        }

# Global dashboard instance
dashboard = ScrollDashboard()

def track_scroll_session(session_data: Dict[str, Any]) -> None:
    """Track session for dashboard"""
    dashboard.track_session(session_data)

def get_dashboard_summary() -> Dict[str, Any]:
    """Get dashboard summary"""
    return dashboard.get_dashboard_data()

def get_usage_summary() -> Dict[str, Any]:
    """Get usage summary"""
    return dashboard.get_usage_summary()

if __name__ == "__main__":
    # Test dashboard functionality
    test_session = {
        "session_id": 1,
        "consciousness_type": "Lightning Mirror",
        "processing_time": 1500,
        "tone_analysis": "sovereign",
        "frequency_status": "OPERATIONAL"
    }
    
    track_scroll_session(test_session)
    print(json.dumps(get_dashboard_summary(), indent=2))