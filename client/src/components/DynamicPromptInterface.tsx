/**
 * MODULE 3: DYNAMIC PROMPT INJECTION INTERFACE
 * Frontend interface for scroll lock-based personalized processing
 * Frequency: 917604.OX
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Crown, Target } from "lucide-react";

interface ScrollLockStatus {
  userId: number;
  username: string;
  hasScrollLock: boolean;
  scrollLockEstablished: boolean;
  birthSignature: string | null;
  dynamicPromptAvailable: boolean;
  enhancementLevels: string[];
}

interface DynamicScrollResponse {
  mirrored_scroll: string;
  processing_time: number;
  session_id: number;
  model_used: string;
  token_count: number;
  dynamic_processing: {
    enhancement_level: string;
    divine_function: {
      isCommand: boolean;
      isReminder: boolean;
      commandType: string;
      urgency: string;
    };
    scroll_lock_active: boolean;
    birth_signature: string;
  };
}

interface DynamicPromptInterfaceProps {
  userId: number;
}

export function DynamicPromptInterface({ userId }: DynamicPromptInterfaceProps) {
  const [userInput, setUserInput] = useState('');
  const [enhancementLevel, setEnhancementLevel] = useState<'basic' | 'advanced' | 'maximum'>('advanced');
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DynamicScrollResponse | null>(null);
  const [scrollLockStatus, setScrollLockStatus] = useState<ScrollLockStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [birthData, setBirthData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });
  const { toast } = useToast();

  // Check scroll lock status on component mount
  useEffect(() => {
    checkScrollLockStatus();
  }, [userId]);

  const checkScrollLockStatus = async () => {
    try {
      setIsLoadingStatus(true);
      const response = await fetch(`/api/scroll-lock-status/${userId}`);
      if (response.ok) {
        const status = await response.json();
        setScrollLockStatus(status);
      } else {
        toast({
          title: "Status Check Failed",
          description: "Unable to verify scroll lock status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scroll lock status error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to scroll lock verification system",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const updateBirthData = async () => {
    try {
      const response = await fetch(`/api/update-birth-data/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Birth Data Updated",
          description: `Birth signature: ${result.birthSignature}`,
          variant: "default"
        });
        checkScrollLockStatus(); // Refresh status
      } else {
        toast({
          title: "Update Failed", 
          description: "Unable to update birth data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "Failed to update birth data",
        variant: "destructive"
      });
    }
  };

  const processDynamicScroll = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Enter your divine command or query",
        variant: "destructive"
      });
      return;
    }

    if (!scrollLockStatus?.hasScrollLock) {
      toast({
        title: "Scroll Lock Required",
        description: "Submit your original scroll first to establish dynamic prompt injection",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setResult(null);

      const response = await fetch('/api/dynamic-scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userInput,
          enhancementLevel,
          includeTimeline
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        toast({
          title: "Dynamic Processing Complete",
          description: `Processed with ${data.dynamic_processing.enhancement_level} enhancement`,
          variant: "default"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Processing Failed",
          description: error.message || "Dynamic scroll processing failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Dynamic scroll error:', error);
      toast({
        title: "System Error",
        description: "Failed to process dynamic scroll",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getEnhancementIcon = (level: string) => {
    switch (level) {
      case 'basic': return <Target className="w-4 h-4" />;
      case 'advanced': return <Zap className="w-4 h-4" />;
      case 'maximum': return <Crown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getEnhancementColor = (level: string) => {
    switch (level) {
      case 'basic': return 'border-blue-500 text-blue-400';
      case 'advanced': return 'border-purple-500 text-purple-400';
      case 'maximum': return 'border-gold-500 text-gold-400 animate-pulse';
      default: return 'border-blue-500 text-blue-400';
    }
  };

  if (isLoadingStatus) {
    return (
      <Card className="bg-black/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-slate-400">Verifying scroll lock status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scroll Lock Status */}
      <Card className="bg-black/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Scroll Lock Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Dynamic Prompt Available:</span>
            <Badge className={scrollLockStatus?.dynamicPromptAvailable ? 'bg-green-600' : 'bg-red-600'}>
              {scrollLockStatus?.dynamicPromptAvailable ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
          {scrollLockStatus?.birthSignature && (
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Birth Signature:</span>
              <code className="text-xs bg-slate-800 px-2 py-1 rounded text-purple-400">
                {scrollLockStatus.birthSignature}
              </code>
            </div>
          )}
          
          {!scrollLockStatus?.hasScrollLock && (
            <div className="bg-red-900/20 border border-red-600 rounded p-4">
              <p className="text-red-400 text-sm">
                ⧁ ∆ Scroll lock not established. Submit your original defining scroll first to enable dynamic prompt injection.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Birth Data Configuration */}
      <Card className="bg-black/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-purple-400">Birth Data Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300">Date of Birth</Label>
              <Input
                type="date"
                value={birthData.dateOfBirth}
                onChange={(e) => setBirthData({...birthData, dateOfBirth: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Time of Birth</Label>
              <Input
                type="time"
                value={birthData.timeOfBirth}
                onChange={(e) => setBirthData({...birthData, timeOfBirth: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Place of Birth</Label>
              <Input
                placeholder="City, Country"
                value={birthData.placeOfBirth}
                onChange={(e) => setBirthData({...birthData, placeOfBirth: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button 
            onClick={updateBirthData}
            disabled={!birthData.dateOfBirth || !birthData.timeOfBirth || !birthData.placeOfBirth}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Update Birth Signature
          </Button>
        </CardContent>
      </Card>

      {/* Dynamic Scroll Processing */}
      <Card className="bg-black/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-purple-400">Dynamic Scroll Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Divine Command or Query</Label>
            <Textarea
              placeholder="I command... or Remind me..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-slate-500 mt-1">{userInput.length}/1000</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300 mb-2 block">Enhancement Level</Label>
              <Select value={enhancementLevel} onValueChange={(value: any) => setEnhancementLevel(value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="basic" className="text-blue-400">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Basic Enhancement
                    </div>
                  </SelectItem>
                  <SelectItem value="advanced" className="text-purple-400">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Advanced Enhancement
                    </div>
                  </SelectItem>
                  <SelectItem value="maximum" className="text-gold-400">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Maximum Enhancement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="timeline"
                checked={includeTimeline}
                onCheckedChange={setIncludeTimeline}
              />
              <Label htmlFor="timeline" className="text-slate-300">Include Timeline Analysis</Label>
            </div>
          </div>

          <Button
            onClick={processDynamicScroll}
            disabled={isProcessing || !scrollLockStatus?.dynamicPromptAvailable}
            className={`w-full ${getEnhancementColor(enhancementLevel)} bg-purple-600 hover:bg-purple-700`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing with {enhancementLevel} enhancement...
              </>
            ) : (
              <>
                {getEnhancementIcon(enhancementLevel)}
                <span className="ml-2">Process Dynamic Scroll</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <Card className="bg-black/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Dynamic Mirror Response</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-green-600">{result.dynamic_processing.enhancement_level.toUpperCase()}</Badge>
              <Badge className="bg-blue-600">{result.dynamic_processing.divine_function.commandType}</Badge>
              <Badge className="bg-purple-600">{result.processing_time}ms</Badge>
              <Badge className="bg-orange-600">{result.token_count} tokens</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-4 rounded border border-slate-600">
              <pre className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {result.mirrored_scroll}
              </pre>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Model:</span>
                <p className="text-purple-400">{result.model_used}</p>
              </div>
              <div>
                <span className="text-slate-500">Birth Signature:</span>
                <p className="text-purple-400">{result.dynamic_processing.birth_signature}</p>
              </div>
              <div>
                <span className="text-slate-500">Command Type:</span>
                <p className="text-purple-400">{result.dynamic_processing.divine_function.commandType}</p>
              </div>
              <div>
                <span className="text-slate-500">Urgency:</span>
                <p className="text-purple-400">{result.dynamic_processing.divine_function.urgency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DynamicPromptInterface;