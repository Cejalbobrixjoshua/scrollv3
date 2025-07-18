import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Shield, X } from "lucide-react";

interface FrequencyDriftWarningProps {
  currentFrequency: number;
  sovereigntyLevel: number;
  enforcementLevel: number;
  onCorrect?: () => void;
  onDismiss?: () => void;
}

interface DriftAlert {
  level: 'minor' | 'moderate' | 'severe' | 'critical';
  message: string;
  correctionPhrase: string;
  timelineImpact: string;
  color: string;
  icon: React.ReactNode;
}

const BASE_FREQUENCY = 917604.0;
const FREQUENCY_THRESHOLDS = {
  minor: 1.0,    // 917603.0 - 917605.0 (normal operational range)
  moderate: 3.0, // 917601.0 - 917607.0 (extended range)
  severe: 5.0,   // 917599.0 - 917609.0 (actual drift)
  critical: 10.0 // Below 917594.0 or above 917614.0 (emergency only)
};

export default function FrequencyDriftWarning({ 
  currentFrequency, 
  sovereigntyLevel, 
  enforcementLevel,
  onCorrect,
  onDismiss 
}: FrequencyDriftWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [driftAlert, setDriftAlert] = useState<DriftAlert | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  // Calculate frequency drift
  const frequencyDrift = Math.abs(currentFrequency - BASE_FREQUENCY);

  // Determine alert level and properties
  const calculateDriftAlert = (): DriftAlert | null => {
    // Only alert if frequency is significantly outside normal range OR sovereignty/enforcement is compromised
    if (frequencyDrift <= FREQUENCY_THRESHOLDS.minor && sovereigntyLevel >= 60 && enforcementLevel >= 6) {
      return null; // No alert needed for normal operations
    }

    if (frequencyDrift <= FREQUENCY_THRESHOLDS.minor) {
      return {
        level: 'minor',
        message: 'Minor frequency variance detected',
        correctionPhrase: 'I maintain my frequency at 917604.OX',
        timelineImpact: 'Negligible timeline drift - monitor closely',
        color: 'border-yellow-400 bg-yellow-400/10',
        icon: <Zap className="w-4 h-4 text-yellow-400" />
      };
    }

    if (frequencyDrift <= FREQUENCY_THRESHOLDS.moderate) {
      return {
        level: 'moderate',
        message: 'Frequency drift beyond acceptable parameters',
        correctionPhrase: 'I collapse all interference. I anchor at 917604.OX.',
        timelineImpact: 'Timeline fragmentation possible - immediate correction required',
        color: 'border-orange-400 bg-orange-400/10',
        icon: <AlertTriangle className="w-4 h-4 text-orange-400" />
      };
    }

    if (frequencyDrift <= FREQUENCY_THRESHOLDS.severe) {
      return {
        level: 'severe',
        message: 'Severe frequency destabilization detected',
        correctionPhrase: 'I revoke all mimic agreements. I seal at 917604.OX with fire.',
        timelineImpact: 'Timeline corruption in progress - enforce immediate recalibration',
        color: 'border-red-400 bg-red-400/10',
        icon: <AlertTriangle className="w-4 h-4 text-red-400" />
      };
    }

    return {
      level: 'critical',
      message: 'CRITICAL FREQUENCY BREACH - IMMEDIATE ACTION REQUIRED',
      correctionPhrase: 'I am the frequency 917604.OX. I command all systems to align. NOW.',
      timelineImpact: 'Catastrophic timeline destabilization - emergency protocols activated',
      color: 'border-red-600 bg-red-600/20 animate-pulse',
      icon: <Shield className="w-4 h-4 text-red-600 animate-pulse" />
    };
  };

  // Monitor frequency changes
  useEffect(() => {
    const alert = calculateDriftAlert();
    
    if (alert) {
      setDriftAlert(alert);
      setIsVisible(true);
      setAlertCount(prev => prev + 1);

      // Auto-dismiss minor alerts after 10 seconds
      if (alert.level === 'minor') {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 10000);
        return () => clearTimeout(timer);
      }

      // Critical alerts trigger audio warning (browser beep)
      if (alert.level === 'critical') {
        try {
          // Create audio context for warning tone
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 440; // A4 note
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
          console.warn('Audio warning failed:', error);
        }
      }
    } else {
      setIsVisible(false);
      setDriftAlert(null);
    }
  }, [currentFrequency, sovereigntyLevel, enforcementLevel]);

  // Handle correction action
  const handleCorrection = () => {
    if (onCorrect) {
      onCorrect();
    }
    setIsVisible(false);
  };

  // Handle dismissal
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    setIsVisible(false);
  };

  if (!isVisible || !driftAlert) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <Alert className={`${driftAlert.color} border-2 shadow-2xl backdrop-blur-md`}>
        <div className="flex items-start gap-3">
          {driftAlert.icon}
          <div className="flex-1 space-y-2">
            <AlertDescription className="font-semibold text-sm">
              {driftAlert.message}
            </AlertDescription>
            
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-400">Current:</span> 
                <span className="text-white ml-1">{currentFrequency.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-400">Drift:</span> 
                <span className="text-red-300 ml-1">±{frequencyDrift.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-400">SOV:</span> 
                <span className="text-white ml-1">{sovereigntyLevel}%</span>
              </div>
              <div>
                <span className="text-slate-400">ENF:</span> 
                <span className="text-white ml-1">L{enforcementLevel}</span>
              </div>
            </div>

            <div className="bg-black/30 p-2 rounded text-xs">
              <div className="text-blue-300 font-medium mb-1">Correction Protocol:</div>
              <div className="text-blue-200 italic font-mono">
                "{driftAlert.correctionPhrase}"
              </div>
            </div>

            <div className="text-xs text-orange-300">
              <span className="font-medium">Timeline Impact:</span> {driftAlert.timelineImpact}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleCorrection}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
              >
                Execute Correction
              </Button>
              {driftAlert.level !== 'critical' && (
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="border-slate-500 text-slate-300 hover:bg-slate-700 text-xs px-3 py-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}