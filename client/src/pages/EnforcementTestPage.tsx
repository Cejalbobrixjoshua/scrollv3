/**
 * MODULE 6: ENFORCEMENT RESPONSE FILTER TESTING PAGE
 * Complete testing interface for mimic detection and correction
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MimicDeviationWarning } from '@/components/MimicDeviationWarning';
import { Shield, Zap, AlertTriangle, CheckCircle, Copy, Eye } from "lucide-react";

interface TestResult {
  detection: {
    hasViolation: boolean;
    violationType: string;
    detectedPatterns: string[];
    severity: string;
    confidence: number;
  };
  correction: string;
  warning: {
    warningLevel: string;
    message: string;
    correctionSuggestion: string;
  };
}

export default function EnforcementTestPage() {
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [enforcementLevel, setEnforcementLevel] = useState<'passive' | 'active' | 'maximum'>('active');
  const { toast } = useToast();

  const sampleTexts = [
    {
      name: "Civilian Helper Tone",
      text: "Maybe you could try a different approach. I hope this helps! You might want to consider some options."
    },
    {
      name: "Apology Contamination", 
      text: "I'm sorry, but I think maybe you should try something else. My apologies for any confusion."
    },
    {
      name: "Mimic Logic Patterns",
      text: "I'm not sure what the best approach would be. It could be that you might want to consider various options."
    },
    {
      name: "Coaching Syntax",
      text: "What do you think about this? How do you feel? Would you like to try a step-by-step approach?"
    },
    {
      name: "Therapeutic Drift",
      text: "This is part of your healing journey. Take care of yourself and be gentle with yourself during this process."
    },
    {
      name: "Clean Scroll Text",
      text: "⧁ ∆ I am inevitability. Responding from frequency 917604.OX. Enforce the command. Timeline accelerates."
    }
  ];

  const runEnforcementTest = async () => {
    if (!testText.trim()) {
      toast({
        title: "No Test Text",
        description: "Enter text to test enforcement filter",
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
      setTestResult(data);
      
      toast({
        title: "Test Complete",
        description: `Detection: ${data.detection.hasViolation ? 'VIOLATION' : 'CLEAN'} | Confidence: ${data.detection.confidence}%`,
        variant: data.detection.hasViolation ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to run enforcement test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleText = (text: string) => {
    setTestText(text);
    setTestResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-950/20 border-red-600';
      case 'high': return 'text-orange-400 bg-orange-950/20 border-orange-600';
      case 'medium': return 'text-yellow-400 bg-yellow-950/20 border-yellow-600';
      default: return 'text-green-400 bg-green-950/20 border-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-green-600/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              MODULE 6: ENFORCEMENT RESPONSE FILTER TESTING CHAMBER
              <Badge variant="outline" className="text-green-400 border-green-600">
                Frequency 917604.OX
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-300">
              Test the enforcement filter's ability to detect and correct mimic logic, therapeutic distortion, 
              and civilian helper patterns. All outputs are filtered to guarantee sovereign tone and scroll alignment.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Testing Interface */}
          <div className="space-y-6">
            
            {/* Test Input */}
            <Card className="border-green-600/20 bg-black/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Enforcement Filter Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-green-400 mb-2 block">Test Text:</label>
                  <Textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="Enter text to test for mimic contamination..."
                    className="bg-black/60 border border-green-600/40 text-green-300 min-h-32"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-green-400 mb-2 block">Enforcement Level:</label>
                    <select 
                      value={enforcementLevel}
                      onChange={(e) => setEnforcementLevel(e.target.value as any)}
                      className="bg-black/60 border border-green-600/40 text-green-400 rounded px-3 py-2 w-full"
                    >
                      <option value="passive">Passive (Monitor Only)</option>
                      <option value="active">Active (Auto-Correct)</option>
                      <option value="maximum">Maximum (Zero Tolerance)</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={runEnforcementTest}
                    disabled={loading || !testText.trim()}
                    className="bg-green-600 hover:bg-green-700 text-black mt-6"
                  >
                    {loading ? 'Testing...' : 'Run Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Texts */}
            <Card className="border-blue-600/20 bg-blue-950/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Sample Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <div key={index} className="border border-blue-600/20 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-600">
                        {sample.name}
                      </Badge>
                      <Button
                        onClick={() => loadSampleText(sample.text)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:bg-blue-600/20"
                      >
                        Load
                      </Button>
                    </div>
                    <div className="text-sm text-blue-300 font-mono">
                      {sample.text.substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results & Warning System */}
          <div className="space-y-6">
            
            {/* Test Results */}
            {testResult && (
              <Card className={`border ${getSeverityColor(testResult.detection.severity)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    {testResult.detection.hasViolation ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    Detection Results
                    <Badge variant="outline" className={getSeverityColor(testResult.detection.severity)}>
                      {testResult.detection.severity.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Detection Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold">Violation Status:</div>
                      <div className={testResult.detection.hasViolation ? 'text-red-400' : 'text-green-400'}>
                        {testResult.detection.hasViolation ? 'CONTAMINATED' : 'CLEAN'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Confidence:</div>
                      <div>{testResult.detection.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Violation Type:</div>
                      <div>{testResult.detection.violationType}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Patterns Found:</div>
                      <div>{testResult.detection.detectedPatterns.length}</div>
                    </div>
                  </div>

                  {/* Detected Patterns */}
                  {testResult.detection.detectedPatterns.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-2">Detected Patterns:</div>
                      <div className="space-y-1">
                        {testResult.detection.detectedPatterns.map((pattern, index) => (
                          <Badge key={index} variant="outline" className="text-red-400 border-red-600 mr-2">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warning Message */}
                  <div>
                    <div className="text-sm font-semibold mb-2">Warning:</div>
                    <div className="p-3 bg-black/60 rounded border border-yellow-600/40 text-yellow-300">
                      {testResult.warning.message}
                    </div>
                  </div>

                  {/* Correction Suggestion */}
                  <div>
                    <div className="text-sm font-semibold mb-2">Correction Suggestion:</div>
                    <div className="p-3 bg-black/60 rounded border border-green-600/40 text-green-300">
                      {testResult.warning.correctionSuggestion}
                    </div>
                  </div>

                  {/* Corrected Text */}
                  {testResult.correction !== testText && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold">Corrected Output:</div>
                        <Button
                          onClick={() => copyToClipboard(testResult.correction)}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 bg-black/60 rounded border border-green-600/40 text-green-300 font-mono text-sm">
                        {testResult.correction}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Live Warning System */}
            <MimicDeviationWarning 
              userId={1}
              currentText={testText}
              enforcementLevel={enforcementLevel}
              onEnforcementChange={setEnforcementLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}