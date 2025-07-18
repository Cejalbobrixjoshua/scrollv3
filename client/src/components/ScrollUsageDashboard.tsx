import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Zap, Shield } from 'lucide-react';

interface TokenStats {
  currentUsage: number;
  remainingTokens: number;
  monthlyLimit: number;
  isBlocked: boolean;
}

interface ScrollUsageDashboardProps {
  tokenStats: TokenStats;
  scrollSessions: any[];
}

export default function ScrollUsageDashboard({ tokenStats, scrollSessions }: ScrollUsageDashboardProps) {
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState<'aligned' | 'warning' | 'locked'>('aligned');

  useEffect(() => {
    if (!tokenStats) return;

    const used = tokenStats.currentUsage;
    const limit = tokenStats.monthlyLimit;
    const percentUsed = (used / limit) * 100;
    setPercentage(percentUsed);

    if (percentUsed >= 100) setStatus('locked');
    else if (percentUsed >= 80) setStatus('warning');
    else setStatus('aligned');
  }, [tokenStats]);

  const originalScrollSessions = scrollSessions.filter(s => s.isOriginalScroll);
  const standardSessions = scrollSessions.filter(s => !s.isOriginalScroll);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 mb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-slate-300">Mirror Access</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{status === 'aligned' ? 'Active' : status === 'warning' ? 'High Usage' : 'Limit Reached'}</span>
          <div className={`w-2 h-2 rounded-full ${status === 'aligned' ? 'bg-emerald-400' : status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`}></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <Progress 
          value={percentage} 
          className="h-1.5 bg-slate-700/50"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{status === 'aligned' ? 'Optimal Usage' : status === 'warning' ? 'Monitor Usage' : 'Upgrade Required'}</span>
          <span>917604.OX</span>
        </div>
      </div>

      {/* Status Alerts */}
      {status === 'warning' && (
        <Alert className="mb-3 border-amber-500/30 bg-amber-500/5 py-2">
          <Zap className="w-3 h-3 text-amber-500" />
          <AlertDescription className="text-xs text-amber-300">
            Heavy mirror usage detected - consider upgrading plan
          </AlertDescription>
        </Alert>
      )}

      {status === 'locked' && (
        <Alert className="mb-3 border-red-500/30 bg-red-500/5 py-2">
          <Shield className="w-3 h-3 text-red-500" />
          <AlertDescription className="text-xs text-red-300">
            Mirror access paused - upgrade to continue quantum sessions
          </AlertDescription>
        </Alert>
      )}

      {/* Compact Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-700/30 p-2 rounded-lg">
          <div className="text-sm font-bold text-slate-200">{scrollSessions.length}</div>
          <div className="text-xs text-slate-400">Sessions</div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded-lg">
          <div className="text-sm font-bold text-violet-400">$88</div>
          <div className="text-xs text-slate-400">Plan</div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded-lg">
          <div className="text-sm font-bold text-emerald-400">✓</div>
          <div className="text-xs text-slate-400">Aligned</div>
        </div>
      </div>
    </div>
  );
}