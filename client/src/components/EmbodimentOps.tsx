import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Target, 
  Brain, 
  Activity, 
  Zap, 
  Clock, 
  Flame,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TestTube
} from "lucide-react";
import ScrollVerification from "@/components/ScrollVerification";
import { useToast } from "@/hooks/use-toast";

interface EmbodimentEntry {
  id: string;
  type: 'collapse' | 'deconstruction' | 'frequency' | 'talent' | 'closure';
  content: string;
  timestamp: Date;
  status: 'enforced' | 'compromised' | 'interference';
  followUpDue?: Date;
}

interface ScrollMetrics {
  scrollIntegrity: number;
  realityCollapseCount: number;
  flameSignalStrength: number;
  lastUpdate: Date;
}

export default function EmbodimentOps() {
  const [activeTab, setActiveTab] = useState('mirror');
  const [entries, setEntries] = useState<EmbodimentEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [beliefInput, setBeliefInput] = useState('');
  const [reverseCommand, setReverseCommand] = useState('');
  const [oppositeAction, setOppositeAction] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    scrollIntegrity: 88,
    realityCollapseCount: 7,
    flameSignalStrength: 92,
    lastUpdate: new Date()
  });
  const [showNotifications, setShowNotifications] = useState(true);
  const [autoEnforcementMode, setAutoEnforcementMode] = useState(false);
  const [deepScanActive, setDeepScanActive] = useState(false);
  const [mimicDetectionLevel, setMimicDetectionLevel] = useState(8);
  const [enforcementProtocols, setEnforcementProtocols] = useState<string[]>([
    'Divine Voltage Regulation',
    'Timeline Collapse Prevention', 
    'Reality Enforcement Field',
    'Mimic Pattern Neutralization'
  ]);
  const [fieldIntegrityScore, setFieldIntegrityScore] = useState(92);
  const [quantumCoherence, setQuantumCoherence] = useState(87);
  const { toast } = useToast();

  // Daily Enforcement Mirror
  const handleCollapseEntry = (type: 'collapse' | 'mimic' | 'obedience') => {
    if (!currentEntry.trim()) return;

    const entry: EmbodimentEntry = {
      id: Date.now().toString(),
      type: 'collapse',
      content: `${type}: ${currentEntry}`,
      timestamp: new Date(),
      status: 'enforced'
    };

    setEntries(prev => [entry, ...prev]);
    setCurrentEntry('');
    
    // Trigger AI reflection
    toast({
      title: "⧁ ∆ SCROLL ENFORCEMENT LOGGED",
      description: "Divine protocol mirroring activated. Reality enforcement confirmed.",
    });

    // Update metrics
    setScrollMetrics(prev => ({
      ...prev,
      realityCollapseCount: prev.realityCollapseCount + 1,
      scrollIntegrity: Math.min(100, prev.scrollIntegrity + 2),
      lastUpdate: new Date()
    }));
  };

  // Mental Deconstruction Loop
  const handleDeconstructionSubmit = () => {
    if (!beliefInput.trim() || !reverseCommand.trim() || !oppositeAction.trim()) return;

    const entry: EmbodimentEntry = {
      id: Date.now().toString(),
      type: 'deconstruction',
      content: `Belief: ${beliefInput} | Reverse: ${reverseCommand} | Action: ${oppositeAction}`,
      timestamp: new Date(),
      status: 'enforced',
      followUpDue: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
    };

    setEntries(prev => [entry, ...prev]);
    setBeliefInput('');
    setReverseCommand('');
    setOppositeAction('');

    toast({
      title: "⧁ ∆ MIMIC DECONSTRUCTION INITIATED",
      description: "12-hour enforcement loop activated. Reality reversal in progress.",
    });
  };

  // Body Frequency Tracker
  const handleFrequencyCheck = (category: string, status: 'enforced' | 'compromised' | 'interference') => {
    const entry: EmbodimentEntry = {
      id: Date.now().toString(),
      type: 'frequency',
      content: `${category}: ${status}`,
      timestamp: new Date(),
      status
    };

    setEntries(prev => [entry, ...prev]);

    // Update flame signal based on frequency alignment
    setScrollMetrics(prev => ({
      ...prev,
      flameSignalStrength: status === 'enforced' ? 
        Math.min(100, prev.flameSignalStrength + 3) : 
        Math.max(0, prev.flameSignalStrength - 5),
      lastUpdate: new Date()
    }));
  };

  // Timeline Closure Protocol
  const handleClosureSubmit = () => {
    const entry: EmbodimentEntry = {
      id: Date.now().toString(),
      type: 'closure',
      content: currentEntry,
      timestamp: new Date(),
      status: 'enforced'
    };

    setEntries(prev => [entry, ...prev]);
    setCurrentEntry('');

    toast({
      title: "⧁ ∆ TIMELINE SEALED",
      description: "Reality locked. Scroll enforcement confirmed for quantum alignment.",
    });
  };

  // Get flame color based on metrics
  const getFlameColor = () => {
    if (scrollMetrics.flameSignalStrength > 80) return 'text-yellow-400';
    if (scrollMetrics.flameSignalStrength > 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enforced': return 'bg-green-500';
      case 'compromised': return 'bg-red-500';
      case 'interference': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Scroll Metrics Dashboard */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Flame className={`w-6 h-6 ${getFlameColor()}`} />
            PROTOCOL: REMEMBRANCE - Divine Function Enforcement System
            <Badge className="bg-violet-600 text-white">917604.OX</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{scrollMetrics.scrollIntegrity}%</div>
              <div className="text-xs text-gray-400">🔥 Scroll Integrity</div>
              <Progress value={scrollMetrics.scrollIntegrity} className="mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{scrollMetrics.realityCollapseCount}</div>
              <div className="text-xs text-gray-400">⚔️ Collapse Count</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{scrollMetrics.flameSignalStrength}%</div>
              <div className="text-xs text-gray-400">🜂 Flame Strength</div>
              <Progress value={scrollMetrics.flameSignalStrength} className="mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">42%</div>
              <div className="text-xs text-gray-400">🔁 Repetition Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">1.3s</div>
              <div className="text-xs text-gray-400">👁 Decree Velocity</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              Last Update: {formatTime(scrollMetrics.lastUpdate)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Field Status Alerts</span>
              <Switch 
                checked={showNotifications} 
                onCheckedChange={setShowNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embodiment Operations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-gray-800">
          <TabsTrigger value="mirror" className="data-[state=active]:bg-violet-600">
            <Shield className="w-4 h-4 mr-1" />
            🜂 Field
          </TabsTrigger>
          <TabsTrigger value="deconstruct" className="data-[state=active]:bg-red-600">
            <Brain className="w-4 h-4 mr-1" />
            🔥 Flame
          </TabsTrigger>
          <TabsTrigger value="frequency" className="data-[state=active]:bg-blue-600">
            <Activity className="w-4 h-4 mr-1" />
            🜏 Mirror
          </TabsTrigger>
          <TabsTrigger value="talent" className="data-[state=active]:bg-green-600">
            <Zap className="w-4 h-4 mr-1" />
            🧬 DNA
          </TabsTrigger>
          <TabsTrigger value="closure" className="data-[state=active]:bg-orange-600">
            <Clock className="w-4 h-4 mr-1" />
            ⚔️ Collapse
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-cyan-600">
            <TestTube className="w-4 h-4 mr-1" />
            👁 Vision
          </TabsTrigger>
        </TabsList>

        {/* Daily Enforcement Mirror */}
        <TabsContent value="mirror" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🜂 Daily Field Enforcement Chamber</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Today's Directive: Command a reality to obey</label>
                <Textarea
                  placeholder="What reality bent to your presence today?"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  onClick={() => handleCollapseEntry('collapse')} 
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  ✅ Reality Responded
                </Button>
              </div>

              <div>
                <Textarea
                  placeholder="Where did distortion break around your presence?"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  onClick={() => handleCollapseEntry('mimic')} 
                  className="mt-2 bg-red-600 hover:bg-red-700"
                >
                  ⚔️ Field Collapse Logged
                </Button>
              </div>

              <div>
                <Textarea
                  placeholder="What timeline shifted through your decree enforcement?"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  onClick={() => handleCollapseEntry('obedience')} 
                  className="mt-2 bg-violet-600 hover:bg-violet-700"
                >
                  🜂 Timeline Integrity Confirmed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mental Deconstruction Loop */}
        <TabsContent value="deconstruct" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🔥 Flame Operations - Enforcement Streak Monitor</CardTitle>
              <p className="text-gray-400 text-sm">Track field closures, daily decree reports, and enforcement consistency.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">Embedded Belief</label>
                <Textarea
                  placeholder="What belief is limiting your divine function?"
                  value={beliefInput}
                  onChange={(e) => setBeliefInput(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium">Reverse Command</label>
                <Input
                  placeholder="Command to reverse this belief"
                  value={reverseCommand}
                  onChange={(e) => setReverseCommand(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium">Opposite Action</label>
                <Input
                  placeholder="What will you enforce today instead?"
                  value={oppositeAction}
                  onChange={(e) => setOppositeAction(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button 
                onClick={handleDeconstructionSubmit}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Initiate Deconstruction Loop (12hr Follow-up)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Body Frequency Anchor Tracker */}
        <TabsContent value="frequency" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🜏 Scroll Mirror - Embodiment Alignment Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Did you move your vessel before speaking to the world?", key: "movement" },
                { label: "Did you hydrate for scroll clarity or survival?", key: "hydration" },
                { label: "Did you eat in alignment or mimic distraction?", key: "nutrition" },
                { label: "Did you sleep like you're enforcing heaven?", key: "sleep" }
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <p className="text-white text-sm">{item.label}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleFrequencyCheck(item.key, 'enforced')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Enforced
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleFrequencyCheck(item.key, 'compromised')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Compromised
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleFrequencyCheck(item.key, 'interference')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Interference
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Talent Unlock Codex */}
        <TabsContent value="talent" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🧬 DNA Seals - Voice Command & Biological Response Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">What was effortless today that created real impact?</label>
                <Textarea
                  placeholder="Describe divine gifts emerging through repetition..."
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium">What felt heavy and drained the scroll field?</label>
                <Textarea
                  placeholder="Identify energy drains and misalignment patterns..."
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Zap className="w-4 h-4 mr-2" />
                Generate Talent Pattern Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Closure Protocol */}
        <TabsContent value="closure" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">⚔️ Collapse Logs - Distortion Break Documentation</CardTitle>
              <p className="text-gray-400 text-sm">Document when distortion broke around you and what caused the field collapse.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">What was closed today?</label>
                <Textarea
                  placeholder="Seal what was completed and locked..."
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? 'Stop Recording' : 'Voice Record'}
                </Button>
                <Button 
                  onClick={handleClosureSubmit}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Seal Timeline
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scroll Verification Protocol */}
        <TabsContent value="verification" className="space-y-4">
          <ScrollVerification />
        </TabsContent>
      </Tabs>

      {/* Recent Enforcement Log */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Field Operations - Scroll Consistency Score (SCS)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {entries.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No field operations logged. Begin divine function enforcement.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white text-sm">{entry.content}</p>
                    <p className="text-gray-400 text-xs">{formatTime(entry.timestamp)}</p>
                  </div>
                  <Badge className={`${getStatusColor(entry.status)} text-white`}>
                    {entry.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}