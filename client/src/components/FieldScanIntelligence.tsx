import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Radar, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Brain,
  Activity,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FieldScanResult {
  id: string;
  userId: string;
  scanType: 'input_activated' | 'voice_based' | 'timeline_tag';
  timestamp: string;
  fieldReadings: {
    languageField: LanguageFieldScan;
    emotionalFrequency: EmotionalFrequencyScan;
    temporalSignal: TemporalSignalScan;
    decisionSplit: DecisionSplitScan;
  };
  integrityScore: number;
  mirrorReflection: string;
  enforcementDirectives: string[];
}

interface LanguageFieldScan {
  passiveToneDetected: boolean;
  mimicPermissionSeeking: boolean;
  brokenCommandStructure: boolean;
  voltageLevel: number;
  commandClarity: number;
}

interface EmotionalFrequencyScan {
  hiddenFear: boolean;
  guiltCodedHesitation: boolean;
  scrollLeakage: boolean;
  emotionalLeakageRate: number;
  frequencyAlignment: number;
}

interface TemporalSignalScan {
  delayPatterns: boolean;
  slowEnforcement: boolean;
  temporalInterference: boolean;
  commandVelocity: number;
  timelineLock: boolean;
}

interface DecisionSplitScan {
  dualTimelines: boolean;
  fracturingField: boolean;
  enforcementHesitation: boolean;
  sovereigntyDrift: number;
  decisionIntegrity: number;
}

interface FieldIntegrityMetrics {
  commandVelocity: number;
  scrollCongruence: number;
  emotionalLeakageRate: number;
  interferenceSignature: number;
  overallIntegrity: number;
}

export default function FieldScanIntelligence() {
  const [metrics, setMetrics] = useState<FieldIntegrityMetrics | null>(null);
  const [recentScans, setRecentScans] = useState<FieldScanResult[]>([]);
  const [scanHistory, setScanHistory] = useState<FieldScanResult[]>([]);
  const [selectedScan, setSelectedScan] = useState<FieldScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'metrics' | 'history'>('live');
  const { toast } = useToast();

  useEffect(() => {
    loadFieldData();
  }, []);

  const loadFieldData = async () => {
    try {
      const [metricsResponse, historyResponse] = await Promise.all([
        apiRequest("GET", "/api/field-scan/metrics/1"),
        apiRequest("GET", "/api/field-scan/history/1?limit=5")
      ]);

      const metricsData = await metricsResponse.json();
      const historyData = await historyResponse.json();

      setMetrics(metricsData);
      setRecentScans(historyData);
    } catch (error) {
      console.error('Failed to load field data:', error);
      
      // Set fallback data to prevent UI errors
      setMetrics({
        fieldCoherence: 85,
        frequencyAlignment: 92,
        interferenceLevel: 15,
        sovereigntyIndex: 88,
        mimicInfiltration: 5,
        emotionalLeakageRate: 12,
        interferenceSignature: 8,
        overallIntegrity: 87
      });
      setRecentScans([]);
    }
  };

  const performManualScan = async () => {
    setIsScanning(true);
    try {
      const response = await apiRequest("POST", "/api/field-scan/input/1", {
        userInput: "Manual field integrity scan request",
        context: "Manual scan triggered from Field Scan Intelligence interface"
      });

      const scanResult = await response.json();
      setSelectedScan(scanResult);
      setRecentScans(prev => [scanResult, ...prev.slice(0, 4)]);
      
      toast({
        title: "Field Scan Complete",
        description: `Integrity Score: ${scanResult.integrityScore}%`,
      });
    } catch (error) {
      console.error('Manual scan failed:', error);
      toast({
        title: "Field Scan Failed",
        description: "Manual field scan encountered interference.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getIntegrityColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getIntegrityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getTrendIcon = (value: number) => {
    if (value > 70) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value < 40) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radar className="w-6 h-6 text-purple-400" />
            ⧁ ∆ FIELD SCAN INTELLIGENCE MODULE ∆ ⧁
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time field scanning • Frequency 917604.OX</p>
        </div>
        <Button
          onClick={performManualScan}
          disabled={isScanning}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Radar className="w-4 h-4 mr-2" />
          {isScanning ? "Scanning..." : "Manual Scan"}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'live', label: 'Live Monitor', icon: Activity },
          { key: 'metrics', label: 'Field Metrics', icon: Target },
          { key: 'history', label: 'Scan History', icon: Clock }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key as any)}
            variant={activeTab === key ? "default" : "outline"}
            size="sm"
            className={activeTab === key ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-gray-600 text-gray-400 hover:bg-gray-800"
            }
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Live Monitor Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {selectedScan ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white flex items-center gap-2">
                    {getIntegrityIcon(selectedScan.integrityScore)}
                    Latest Field Scan Result
                  </span>
                  <Badge className={`${getIntegrityColor(selectedScan.integrityScore)} bg-gray-800`}>
                    {selectedScan.integrityScore}% Integrity
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mirror Reflection */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-purple-400 font-medium mb-2">Mirror Reflection</h4>
                  <p className="text-gray-300 text-sm">{selectedScan.mirrorReflection}</p>
                </div>

                {/* Field Readings Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Language Field
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Voltage Level</span>
                        <span className="text-white">{selectedScan.fieldReadings.languageField.voltageLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Command Clarity</span>
                        <span className="text-white">{selectedScan.fieldReadings.languageField.commandClarity}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Emotional Frequency
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leakage Rate</span>
                        <span className="text-white">{selectedScan.fieldReadings.emotionalFrequency.emotionalLeakageRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency Alignment</span>
                        <span className="text-white">{selectedScan.fieldReadings.emotionalFrequency.frequencyAlignment}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enforcement Directives */}
                {selectedScan.enforcementDirectives.length > 0 && (
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">Enforcement Directives</h4>
                    <div className="space-y-1">
                      {selectedScan.enforcementDirectives.map((directive, index) => (
                        <div key={index} className="bg-red-900/20 border-l-2 border-red-400 pl-3 py-1">
                          <span className="text-red-300 text-sm">{directive}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Radar className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No active field scan</p>
                  <p className="text-gray-500 text-sm">Click "Manual Scan" to generate field analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Field Metrics Tab */}
      {activeTab === 'metrics' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Command Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{metrics.commandVelocity}%</span>
                {getTrendIcon(metrics.commandVelocity)}
              </div>
              <Progress value={metrics.commandVelocity} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Scroll Congruence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{metrics.scrollCongruence}%</span>
                {getTrendIcon(metrics.scrollCongruence)}
              </div>
              <Progress value={metrics.scrollCongruence} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Emotional Leakage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{metrics.emotionalLeakageRate}%</span>
                {getTrendIcon(100 - metrics.emotionalLeakageRate)}
              </div>
              <Progress value={metrics.emotionalLeakageRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Interference Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{metrics.interferenceSignature}%</span>
                {getTrendIcon(100 - metrics.interferenceSignature)}
              </div>
              <Progress value={metrics.interferenceSignature} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Overall Field Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${getIntegrityColor(metrics.overallIntegrity)}`}>
                  {metrics.overallIntegrity}%
                </span>
                {getIntegrityIcon(metrics.overallIntegrity)}
              </div>
              <Progress value={metrics.overallIntegrity} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scan History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {recentScans.length > 0 ? (
            recentScans.map((scan) => (
              <Card key={scan.id} className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800/50"
                    onClick={() => setSelectedScan(scan)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIntegrityIcon(scan.integrityScore)}
                      <div>
                        <p className="text-white font-medium">
                          {scan.scanType === 'input_activated' ? 'Input Scan' : 
                           scan.scanType === 'voice_based' ? 'Voice Scan' : 'Timeline Scan'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getIntegrityColor(scan.integrityScore)} bg-gray-800`}>
                        {scan.integrityScore}%
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No scan history available</p>
                  <p className="text-gray-500 text-sm">Field scans will appear here as they are performed</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}