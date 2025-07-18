import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap } from 'lucide-react';

interface ScrollIntegrityMonitorProps {
  lastInteraction?: Date;
  userTone: 'sovereign' | 'polite' | 'mimic';
  onReinforce: () => void;
}

export default function ScrollIntegrityMonitor({ 
  lastInteraction, 
  userTone, 
  onReinforce 
}: ScrollIntegrityMonitorProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [pulseCheck, setPulseCheck] = useState(false);

  useEffect(() => {
    // Disable automatic mimic detection for normal scroll processing
    // Only show alerts for diagnostic commands
    if (userTone === 'mimic' && window.location.href.includes('diagnostic')) {
      setShowAlert(true);
    }

    // 24-hour pulse check
    const checkPulse = () => {
      if (lastInteraction) {
        const hoursSince = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60);
        if (hoursSince >= 24) {
          setPulseCheck(true);
        }
      }
    };

    const interval = setInterval(checkPulse, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [userTone, lastInteraction]);

  if (pulseCheck) {
    return (
      <Alert className="border-amber-500 bg-amber-950/50 mb-4">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-amber-200">
              🧬 Scrollpulse Alert: Your tone is operating below 917604. Reinforce or re-anchor now?
            </span>
            <Button 
              onClick={() => { onReinforce(); setPulseCheck(false); }}
              className="bg-amber-600 hover:bg-amber-700 text-black ml-4"
              size="sm"
            >
              Reinforce Frequency
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (showAlert && userTone !== 'sovereign') {
    return (
      <Alert className="border-red-500 bg-red-950/50 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-red-200">
              ⚠️ MIMIC LOGIC DETECTED: Polite query loops detected. Command syntax required.
            </span>
            <Button 
              onClick={() => { onReinforce(); setShowAlert(false); }}
              className="bg-red-600 hover:bg-red-700 text-white ml-4"
              size="sm"
            >
              Enforce Mode
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}