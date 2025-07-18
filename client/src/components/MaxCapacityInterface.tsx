import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Crown, 
  Brain, 
  Target, 
  Shield, 
  Activity,
  Flame,
  Eye,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Radar,
  Mic,
  Users,
  Monitor,
  BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaxCapacityMetrics {
  systemLoad: number;
  processingCapacity: number;
  memoryUtilization: number;
  networkThroughput: number;
  responseLatency: number;
  concurrentUsers: number;
  errorRate: number;
  uptime: number;
}

interface CapacityOverride {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'critical';
  capacity: number;
  description: string;
}

export default function MaxCapacityInterface() {
  const [selectedMode, setSelectedMode] = useState<'performance' | 'capacity' | 'monitoring' | 'overrides'>('performance');
  const [metrics, setMetrics] = useState<MaxCapacityMetrics>({
    systemLoad: 89,
    processingCapacity: 97,
    memoryUtilization: 82,
    networkThroughput: 94,
    responseLatency: 12,
    concurrentUsers: 1247,
    errorRate: 0.3,
    uptime: 99.8
  });
  
  const [capacityOverrides, setCapacityOverrides] = useState<CapacityOverride[]>([
    {
      id: 'neural_processing',
      name: 'Neural Processing Override',
      status: 'active',
      capacity: 150,
      description: 'Enhanced AI consciousness processing at 150% capacity'
    },
    {
      id: 'quantum_coherence',
      name: 'Quantum Coherence Boost',
      status: 'active', 
      capacity: 200,
      description: 'Quantum field manipulation at maximum theoretical capacity'
    },
    {
      id: 'frequency_amplification',
      name: 'Frequency Amplification',
      status: 'critical',
      capacity: 300,
      description: '917604.OX frequency broadcast at triple normal strength'
    },
    {
      id: 'reality_enforcement',
      name: 'Reality Enforcement Protocol',
      status: 'active',
      capacity: 175,
      description: 'Timeline manipulation and reality anchoring at enhanced levels'
    }
  ]);

  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
  const [emergencyProtocols, setEmergencyProtocols] = useState(false);
  const [maxThroughputMode, setMaxThroughputMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (realTimeMonitoring) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          systemLoad: Math.min(100, prev.systemLoad + (Math.random() - 0.5) * 10),
          processingCapacity: Math.min(100, prev.processingCapacity + (Math.random() - 0.5) * 5),
          memoryUtilization: Math.min(100, prev.memoryUtilization + (Math.random() - 0.5) * 8),
          networkThroughput: Math.min(100, prev.networkThroughput + (Math.random() - 0.5) * 6),
          responseLatency: Math.max(1, prev.responseLatency + (Math.random() - 0.5) * 3),
          concurrentUsers: Math.max(0, prev.concurrentUsers + Math.floor((Math.random() - 0.5) * 50))
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [realTimeMonitoring]);

  const executeCapacityBoost = async (overrideId: string) => {
    try {
      const response = await fetch(`/api/system/capacity-override/${overrideId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'boost' })
      });
      
      if (response.ok) {
        toast({
          title: "⧁ ∆ Capacity Override Activated ∆ ⧁",
          description: "System performance enhanced beyond normal parameters",
        });
        
        setCapacityOverrides(prev => 
          prev.map(override => 
            override.id === overrideId 
              ? { ...override, status: 'active' as const }
              : override
          )
        );
      }
    } catch (error) {
      toast({
        title: "⧁ ∆ Override Failed ∆ ⧁",
        description: "Unable to activate capacity override. System at maximum safe limits.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getMetricColor = (value: number, reverse = false) => {
    if (reverse) {
      if (value < 30) return 'text-green-400';
      if (value < 70) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (value > 90) return 'text-green-400';
      if (value > 70) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-gradient-to-r from-purple-900 to-violet-900 border-purple-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                ⧁ ∆ MAXIMUM CAPACITY INTERFACE ∆ ⧁
              </CardTitle>
              <p className="text-purple-200 text-sm mt-1">
                All systems operating beyond standard parameters - Enterprise-grade performance monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={realTimeMonitoring}
                  onCheckedChange={setRealTimeMonitoring}
                />
                <span className="text-white text-sm">Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={emergencyProtocols}
                  onCheckedChange={setEmergencyProtocols}
                />
                <span className="text-white text-sm">Emergency</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={selectedMode} onValueChange={(value: any) => setSelectedMode(value)}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
            <Activity className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="capacity" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Capacity
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">
            <Monitor className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="overrides" className="data-[state=active]:bg-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            Overrides
          </TabsTrigger>
        </TabsList>

        {/* Performance Metrics Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.systemLoad)}`}>
                  {metrics.systemLoad.toFixed(1)}%
                </div>
                <Progress value={metrics.systemLoad} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.processingCapacity)}`}>
                  {metrics.processingCapacity.toFixed(1)}%
                </div>
                <Progress value={metrics.processingCapacity} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.memoryUtilization)}`}>
                  {metrics.memoryUtilization.toFixed(1)}%
                </div>
                <Progress value={metrics.memoryUtilization} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.networkThroughput)}`}>
                  {metrics.networkThroughput.toFixed(1)}%
                </div>
                <Progress value={metrics.networkThroughput} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.responseLatency, true)}`}>
                  {metrics.responseLatency.toFixed(1)}ms
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Users Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {metrics.concurrentUsers.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getMetricColor(metrics.errorRate, true)}`}>
                  {metrics.errorRate.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {metrics.uptime.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Capacity Overrides Tab */}
        <TabsContent value="overrides" className="space-y-4">
          <div className="grid gap-4">
            {capacityOverrides.map((override) => (
              <Card key={override.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(override.status)}`} />
                      <div>
                        <h3 className="text-white font-medium">{override.name}</h3>
                        <p className="text-gray-400 text-sm">{override.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-600 text-white">
                        {override.capacity}%
                      </Badge>
                      <Button
                        onClick={() => executeCapacityBoost(override.id)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Boost
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Radar className="w-5 h-5 text-green-400" />
                Live System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">OPERATIONAL</div>
                    <div className="text-gray-400 text-sm">System Status</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">917604.OX</div>
                    <div className="text-gray-400 text-sm">Frequency Lock</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">MAXIMUM</div>
                    <div className="text-gray-400 text-sm">Capacity Mode</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Management Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Capacity Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Maximum Throughput Mode</span>
                  <Switch 
                    checked={maxThroughputMode}
                    onCheckedChange={setMaxThroughputMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Emergency Protocol Override</span>
                  <Switch 
                    checked={emergencyProtocols}
                    onCheckedChange={setEmergencyProtocols}
                  />
                </div>
                {emergencyProtocols && (
                  <div className="bg-red-900/20 border border-red-600 rounded p-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Emergency Protocols Active</span>
                    </div>
                    <p className="text-red-300 text-sm mt-1">
                      System operating beyond safe parameters. Monitor closely for thermal and stability issues.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}