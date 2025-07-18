import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CommandDriftPattern {
  repeat_count: number;
  voltage_decay: number;
  pattern_type: 'mimic_loop' | 'fatigue' | 'normal';
  recommendation: string;
}

interface LeakMapOverlay {
  breach_location: string;
  psychoenergetic_access_point: string;
  nervous_system_impact: string;
  sealing_protocol: string;
}

interface AutoRecalibrationProtocol {
  speak_line: string;
  breath_seal_window: string;
  frequency_threshold: number;
  purge_action: string;
}

interface ScrollkeeperOverride {
  locked: boolean;
  reason: string;
  reactivation_phrase: string;
  trigger_conditions: string;
}

interface ScrollMirrorDiagnostics {
  freq: number;
  sov: number;
  div: number;
  coh: number;
  tl: number;
  mim: number;
  enf: number;
  leak_source: string;
  voltage: number;
  decree_history: string;
  recalibration_line: string;
  command_drift: CommandDriftPattern;
  leak_map: LeakMapOverlay;
  auto_recalibration: AutoRecalibrationProtocol;
  scrollkeeper_override: ScrollkeeperOverride;
}

export default function ScrollMirrorDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<ScrollMirrorDiagnostics | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const runFieldScan = async () => {
    setIsScanning(true);
    try {
      const data = await apiRequest("/api/mirror/field-scan/1");
      setDiagnostics(data);
      
      toast({
        title: "⧁ ∆ Field Scan Complete ∆ ⧁",
        description: "Mirror diagnostics executed",
      });
    } catch (error) {
      console.error('Field scan failed:', error);
      toast({
        title: "Mirror Diagnostics Offline",
        description: "Field scan could not be completed",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#917604]/20">
        <CardHeader>
          <CardTitle className="text-[#917604] flex items-center gap-2">
            ⧁ ∆ Scrollkeeper Mirror Field Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runFieldScan}
            disabled={isScanning}
            className="w-full bg-[#917604] hover:bg-[#917604]/80 text-white"
          >
            {isScanning ? "Scanning Field..." : "INITIATE FIELD SCAN"}
          </Button>

          {diagnostics && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">FREQ</div>
                  <div className="text-lg font-mono text-white">{diagnostics.freq}</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">SOV</div>
                  <div className="text-lg font-mono text-white">{diagnostics.sov}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">DIV</div>
                  <div className="text-lg font-mono text-white">{diagnostics.div}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">COH</div>
                  <div className="text-lg font-mono text-white">{diagnostics.coh}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">TL</div>
                  <div className="text-lg font-mono text-white">{diagnostics.tl}s</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">MIM</div>
                  <div className="text-lg font-mono text-white">{diagnostics.mim}</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">ENF</div>
                  <div className="text-lg font-mono text-white">L{diagnostics.enf}</div>
                </div>
                <div className="bg-black/20 p-3 rounded border border-[#917604]/30">
                  <div className="text-sm text-[#917604]">VOLTAGE</div>
                  <div className="text-lg font-mono text-white">{diagnostics.voltage}%</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-black/40 p-4 rounded border border-red-500/30">
                  <div className="text-sm font-semibold text-red-400 mb-2">LEAK SOURCE:</div>
                  <div className="text-red-300 font-mono">{diagnostics.leak_source}</div>
                </div>

                <div className="bg-black/40 p-4 rounded border border-orange-500/30">
                  <div className="text-sm font-semibold text-orange-400 mb-2">DECREE ANALYSIS:</div>
                  <div className="text-orange-300 font-mono">{diagnostics.decree_history}</div>
                </div>

                <div className="bg-black/40 p-4 rounded border border-[#917604]/50">
                  <div className="text-sm font-semibold text-[#917604] mb-2">RECALIBRATION SEAL:</div>
                  <div className="text-[#917604] font-mono italic">"{diagnostics.recalibration_line}"</div>
                </div>
              </div>

              {/* Mirror Reinforcement Add-Ons */}
              <div className="space-y-4 mt-6">
                {/* Command Drift Tracker */}
                <div className="bg-black/40 p-4 rounded border border-purple-500/30">
                  <div className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                    🜂 COMMAND DRIFT TRACKER
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-purple-300">Repeats:</span> 
                      <span className="text-white ml-1">{diagnostics.command_drift.repeat_count}</span>
                    </div>
                    <div>
                      <span className="text-purple-300">Voltage Decay:</span> 
                      <span className="text-white ml-1">{diagnostics.command_drift.voltage_decay}%</span>
                    </div>
                    <div>
                      <span className="text-purple-300">Pattern:</span> 
                      <span className={`ml-1 ${
                        diagnostics.command_drift.pattern_type === 'mimic_loop' ? 'text-red-400' :
                        diagnostics.command_drift.pattern_type === 'fatigue' ? 'text-orange-400' : 'text-green-400'
                      }`}>{diagnostics.command_drift.pattern_type}</span>
                    </div>
                  </div>
                  <div className="text-purple-200 text-sm mt-2 italic">
                    {diagnostics.command_drift.recommendation}
                  </div>
                </div>

                {/* Leak Map Overlay */}
                <div className="bg-black/40 p-4 rounded border border-red-500/30">
                  <div className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    🩸 LEAK MAP OVERLAY
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-red-300">Breach Location:</span> 
                      <span className="text-white ml-1">{diagnostics.leak_map.breach_location}</span>
                    </div>
                    <div>
                      <span className="text-red-300">Access Point:</span> 
                      <span className="text-white ml-1">{diagnostics.leak_map.psychoenergetic_access_point}</span>
                    </div>
                    <div>
                      <span className="text-red-300">Impact:</span> 
                      <span className="text-white ml-1">{diagnostics.leak_map.nervous_system_impact}</span>
                    </div>
                    <div>
                      <span className="text-red-300">Seal Protocol:</span> 
                      <span className="text-orange-300 ml-1 italic">{diagnostics.leak_map.sealing_protocol}</span>
                    </div>
                  </div>
                </div>

                {/* Auto-Recalibration Protocols */}
                <div className="bg-black/40 p-4 rounded border border-blue-500/30">
                  <div className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    🛡 AUTO-RECALIBRATION PROTOCOLS
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-blue-300">Speak Line:</span> 
                      <div className="text-blue-200 mt-1 italic font-mono text-sm">
                        "{diagnostics.auto_recalibration.speak_line}"
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-300">Breath Seal:</span> 
                      <span className="text-white ml-1">{diagnostics.auto_recalibration.breath_seal_window}</span>
                    </div>
                    <div>
                      <span className="text-blue-300">Frequency Threshold:</span> 
                      <span className="text-white ml-1">{diagnostics.auto_recalibration.frequency_threshold}</span>
                    </div>
                    <div>
                      <span className="text-blue-300">Purge Action:</span> 
                      <span className="text-orange-300 ml-1 italic">{diagnostics.auto_recalibration.purge_action}</span>
                    </div>
                  </div>
                </div>

                {/* Scrollkeeper Override Mode */}
                <div className={`bg-black/40 p-4 rounded border ${
                  diagnostics.scrollkeeper_override.locked ? 'border-red-600/50' : 'border-green-500/30'
                }`}>
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className={diagnostics.scrollkeeper_override.locked ? 'text-red-400' : 'text-green-400'}>
                      ⚙️ SCROLLKEEPER OVERRIDE MODE
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      diagnostics.scrollkeeper_override.locked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {diagnostics.scrollkeeper_override.locked ? 'LOCKED' : 'ACTIVE'}
                    </span>
                  </div>
                  {diagnostics.scrollkeeper_override.locked && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-red-300">Reason:</span> 
                        <span className="text-white ml-1">{diagnostics.scrollkeeper_override.reason}</span>
                      </div>
                      <div>
                        <span className="text-red-300">Reactivation Required:</span> 
                        <div className="text-red-200 mt-1 italic font-mono text-sm bg-red-900/20 p-2 rounded">
                          "{diagnostics.scrollkeeper_override.reactivation_phrase}"
                        </div>
                      </div>
                      <div>
                        <span className="text-red-300">Trigger:</span> 
                        <span className="text-orange-300 ml-1">{diagnostics.scrollkeeper_override.trigger_conditions}</span>
                      </div>
                    </div>
                  )}
                  {!diagnostics.scrollkeeper_override.locked && (
                    <div className="text-green-300 text-sm">
                      Enforcement levels maintained. No override required.
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-gray-400 mt-6">
                Field scan complete. Mirror reinforcement protocols active.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}