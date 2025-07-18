/**
 * MODULE 6: MIMIC DEVIATION WARNING SYSTEM
 * Real-time detection and warning display for mimic contamination
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Shield, Zap, Eye, RefreshCw, AlertCircle } from "lucide-react";

interface MimicDetection {
  hasViolation: boolean;
  violationType: string;
  detectedPatterns: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

interface MimicWarning {
  warningLevel: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  correctionSuggestion: string;
}

interface EnforcementLog {
  timestamp: string;
  originalText: string;
  detectedViolations: string[];
  correctedText: string;
  enforcementLevel: string;
}

interface MimicDeviationWarningProps {
  userId: number;
  currentText?: string;
  enforcementLevel?: 'passive' | 'active' | 'maximum';
  onEnforcementChange?: (level: 'passive' | 'active' | 'maximum') => void;
}

export function MimicDeviationWarning({ 
  userId, 
  currentText = '', 
  enforcementLevel = 'active',
  onEnforcementChange 
}: MimicDeviationWarningProps) {
  const [mimicDetection, setMimicDetection] = useState<MimicDetection | null>(null);
  const [recentLogs, setRecentLogs] = useState<EnforcementLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testText, setTestText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (currentText.length > 10) {
      analyzeText(currentText);
    }
  }, [currentText]);

  useEffect(() => {
    fetchEnforcementStats();
  }, [userId]);

  const analyzeText = async (text: string) => {
    try {
      const response = await fetch('/api/enforcement/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId, enforcementLevel })
      });
      
      const data = await response.json();
      setMimicDetection(data.detectionResult);
    } catch (error) {
      console.error('Failed to analyze text:', error);
    }
  };

  const fetchEnforcementStats = async () => {
    try {
      const response = await fetch(`/api/enforcement/stats/${userId}`);
      const data = await response.json();
      setStats(data);
      setRecentLogs(data.recentEnforcements || []);
    } catch (error) {
      console.error('Failed to fetch enforcement stats:', error);
    }
  };

  const testEnforcementFilter = async () => {
    if (!testText.trim()) {
      toast({
        title: "No Test Text",
        description: "Enter text to test the enforcement filter",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/enforcement/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText })
      });
      
      const data = await response.json();
      
      toast({
        title: "Filter Test Complete",
        description: `Detection: ${data.detection.hasViolation ? 'VIOLATION' : 'CLEAN'} | Confidence: ${data.detection.confidence}%`,
        variant: data.detection.hasViolation ? "destructive" : "default",
      });

      setMimicDetection(data.detection);
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test enforcement filter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const purgeAllMimic = async () => {
    try {
      const response = await fetch(`/api/enforcement/purge/${userId}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      toast({
        title: "Mimic Purge Complete",
        description: `${result.clearedLogs} enforcement logs cleared`,
      });

      await fetchEnforcementStats();
      setMimicDetection(null);
    } catch (error) {
      toast({
        title: "Purge Failed",
        description: "Failed to purge mimic contamination",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-950/20';
      case 'high': return 'border-orange-600 bg-orange-950/20';
      case 'medium': return 'border-yellow-600 bg-yellow-950/20';
      default: return 'border-green-600/20 bg-green-950/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'high': return <AlertCircle className="h-5 w-5 text-orange-400" />;
      case 'medium': return <Eye className="h-5 w-5 text-yellow-400" />;
      default: return <Shield className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card className="border-green-600/20 bg-black/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            MODULE 6: MIMIC DEVIATION WARNING SYSTEM
            <Badge variant="outline" className="text-green-400 border-green-600">
              917604.OX
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-green-400 mb-2 block">Enforcement Level:</label>
              <select 
                value={enforcementLevel}
                onChange={(e) => onEnforcementChange?.(e.target.value as any)}
                className="bg-black/60 border border-green-600/40 text-green-400 rounded px-3 py-2"
              >
                <option value="passive">Passive (Monitor Only)</option>
                <option value="active">Active (Auto-Correct)</option>
                <option value="maximum">Maximum (Zero Tolerance)</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={fetchEnforcementStats}
                variant="outline"
                className="border-green-600/40 text-green-400 hover:bg-green-600/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button 
                onClick={purgeAllMimic}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Purge Mimic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Detection Display */}
      {mimicDetection && mimicDetection.hasViolation && (
        <Alert className={getSeverityColor(mimicDetection.severity)}>
          <div className="flex items-start gap-3">
            {getSeverityIcon(mimicDetection.severity)}
            <div className="flex-1">
              <AlertTitle className="text-red-400">
                MIMIC CONTAMINATION DETECTED - {mimicDetection.violationType.toUpperCase()}
              </AlertTitle>
              <AlertDescription className="text-red-300 mt-2">
                Confidence: {mimicDetection.confidence}% | 
                Patterns: {mimicDetection.detectedPatterns.length} detected
                <div className="mt-2 text-xs font-mono">
                  {mimicDetection.detectedPatterns.slice(0, 3).join(', ')}
                  {mimicDetection.detectedPatterns.length > 3 && '...'}
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Enforcement Statistics */}
      {stats && (
        <Card className="border-green-600/20 bg-black/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Enforcement Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-green-400 text-sm">Total Enforcements</div>
                <div className="text-green-300 text-2xl font-mono">{stats.totalEnforcements}</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Average Confidence</div>
                <div className="text-green-300 text-2xl font-mono">{stats.averageConfidence.toFixed(1)}%</div>
              </div>
            </div>
            
            {Object.keys(stats.violationsByType).length > 0 && (
              <div>
                <div className="text-green-400 text-sm mb-2">Top Violations:</div>
                <div className="space-y-1">
                  {Object.entries(stats.violationsByType).slice(0, 5).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-green-300 font-mono">{type}</span>
                      <span className="text-green-400">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Enforcement Logs */}
      {recentLogs.length > 0 && (
        <Card className="border-green-600/20 bg-black/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Enforcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLogs.slice(0, 3).map((log, index) => (
              <div key={index} className="border border-green-600/20 rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-green-400/80">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <Badge variant="outline" className="text-green-400">
                    {log.enforcementLevel}
                  </Badge>
                </div>
                
                <div className="text-sm text-red-300">
                  <strong>Detected:</strong> {log.detectedViolations.join(', ')}
                </div>
                
                <div className="text-sm text-green-300">
                  <strong>Original:</strong> {log.originalText.substring(0, 100)}...
                </div>
                
                <div className="text-sm text-green-400">
                  <strong>Corrected:</strong> {log.correctedText.substring(0, 100)}...
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filter Testing Interface */}
      <Card className="border-blue-600/20 bg-blue-950/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Enforcement Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test for mimic contamination..."
              className="w-full bg-black/60 border border-blue-600/40 text-blue-300 rounded p-3 min-h-20"
            />
          </div>
          
          <Button 
            onClick={testEnforcementFilter}
            disabled={loading || !testText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            Test Filter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}