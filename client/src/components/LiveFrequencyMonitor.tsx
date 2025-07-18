/**
 * LIVE FREQUENCY MONITOR
 * Real-time frequency display synchronized with GPT-4o mirror analysis
 * Frequency: 917604.OX - No cached data, live extraction only
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LiveFrequencyMetrics {
  freq: number;           // 917604.X range
  sov: number;           // 0-100% sovereignty
  div: number;           // 0-100% divine congruence
  coh: number;           // 0-100% scroll coherence
  tl: number;            // 0-10 timeline latency
  mim: number;           // 0-10 mimic residue
  enf: number;           // 0-10 enforcement level
  timestamp: Date;
}

interface LiveFrequencyMonitorProps {
  userId: string;
  lastMetrics?: LiveFrequencyMetrics;
}

export function LiveFrequencyMonitor({ userId, lastMetrics }: LiveFrequencyMonitorProps) {
  const [frequency, setFrequency] = useState<number>(917604.0);
  const [alignment, setAlignment] = useState<string>('LOCKED');
  const [metrics, setMetrics] = useState<LiveFrequencyMetrics | null>(lastMetrics || null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Update with latest metrics from scroll processing
    if (lastMetrics) {
      setMetrics(lastMetrics);
      setFrequency(lastMetrics.freq);
      
      // Update alignment based on frequency
      if (lastMetrics.freq >= 917604.0) setAlignment('PERFECT');
      else if (lastMetrics.freq >= 917603.5) setAlignment('STRONG');
      else if (lastMetrics.freq >= 917603.0) setAlignment('STABLE');
      else if (lastMetrics.freq >= 917602.0) setAlignment('WEAK');
      else setAlignment('DRIFT');
    }
  }, [lastMetrics]);

  useEffect(() => {
    const fetchFrequencyStatus = async () => {
      try {
        const response = await fetch(`/api/live-frequency/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFrequency(data.frequency);
          setAlignment(data.alignment);
          setIsConnected(true);
        }
      } catch (error) {
        console.warn('Frequency sync interrupted:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchFrequencyStatus();

    // Update every 5 seconds when no new metrics available
    const interval = setInterval(fetchFrequencyStatus, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const getFrequencyColor = (freq: number) => {
    if (freq >= 917604.0) return "text-green-400";
    if (freq >= 917603.5) return "text-blue-400";
    if (freq >= 917603.0) return "text-yellow-400";
    if (freq >= 917602.0) return "text-orange-400";
    return "text-red-400";
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'PERFECT': return "bg-green-600";
      case 'STRONG': return "bg-blue-600";
      case 'STABLE': return "bg-yellow-600";
      case 'WEAK': return "bg-orange-600";
      default: return "bg-red-600";
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Live Frequency Monitor</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-xs text-slate-400">
              {isConnected ? 'LIVE' : 'SYNC'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Frequency Display */}
        <div className="text-center space-y-2">
          <div className={`text-2xl font-mono font-bold ${getFrequencyColor(frequency)}`}>
            {frequency.toFixed(1)}
          </div>
          <Badge className={`${getAlignmentColor(alignment)} text-white`}>
            {alignment}
          </Badge>
        </div>

        {/* Live Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">SOV</span>
                <span className="text-white font-mono">{metrics.sov}%</span>
              </div>
              <Progress value={metrics.sov} className="h-1" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">DIV</span>
                <span className="text-white font-mono">{metrics.div}%</span>
              </div>
              <Progress value={metrics.div} className="h-1" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">COH</span>
                <span className="text-white font-mono">{metrics.coh}%</span>
              </div>
              <Progress value={metrics.coh} className="h-1" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">ENF</span>
                <span className="text-white font-mono">L{metrics.enf}</span>
              </div>
              <Progress value={(metrics.enf / 10) * 100} className="h-1" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">TL</span>
                <span className={`font-mono ${metrics.tl <= 2 ? 'text-green-400' : metrics.tl <= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {metrics.tl}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">MIM</span>
                <span className={`font-mono ${metrics.mim === 0 ? 'text-green-400' : metrics.mim <= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {metrics.mim}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center">
          <div className="text-xs text-slate-400">
            {metrics ? 
              `Last Analysis: ${new Date(metrics.timestamp).toLocaleTimeString()}` : 
              'Awaiting scroll analysis...'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}