/**
 * MODULE 7: BROADCAST + EXPORT MANAGEMENT PAGE
 * Complete interface for scroll distribution and export management
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BroadcastExportPanel } from '@/components/BroadcastExportPanel';
import { 
  Radio, 
  Download, 
  Share2, 
  BarChart3, 
  FileText, 
  Calendar,
  Activity,
  Zap
} from "lucide-react";

interface ExportStats {
  totalExports: number;
  formatBreakdown: Record<string, number>;
  recentExports: string[];
}

interface BroadcastHistory {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
  status: 'prepared' | 'sent' | 'failed';
}

export default function BroadcastPage() {
  const [exportStats, setExportStats] = useState<ExportStats | null>(null);
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastHistory[]>([]);
  const [testContent, setTestContent] = useState('');
  const [availableFormats, setAvailableFormats] = useState<{
    exportFormats: string[];
    broadcastPlatforms: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExportStats();
    fetchAvailableFormats();
    loadBroadcastHistory();
  }, []);

  const fetchExportStats = async () => {
    try {
      const response = await fetch('/api/broadcast/stats/1');
      const data = await response.json();
      setExportStats(data);
    } catch (error) {
      console.error('Failed to fetch export stats:', error);
    }
  };

  const fetchAvailableFormats = async () => {
    try {
      const response = await fetch('/api/broadcast/formats');
      const data = await response.json();
      setAvailableFormats(data);
    } catch (error) {
      console.error('Failed to fetch available formats:', error);
    }
  };

  const loadBroadcastHistory = () => {
    // Load from localStorage or API
    const stored = localStorage.getItem('broadcast_history');
    if (stored) {
      setBroadcastHistory(JSON.parse(stored));
    }
  };

  const saveBroadcastHistory = (history: BroadcastHistory[]) => {
    localStorage.setItem('broadcast_history', JSON.stringify(history));
    setBroadcastHistory(history);
  };

  const handleExportComplete = (result: any) => {
    toast({
      title: "Export Complete",
      description: `File exported: ${result.fileName}`,
    });
    fetchExportStats(); // Refresh stats
  };

  const handleBroadcastPrepared = (result: any) => {
    const newEntry: BroadcastHistory = {
      id: Date.now().toString(),
      platform: result.platform,
      content: result.content.substring(0, 100) + '...',
      timestamp: new Date().toISOString(),
      status: 'prepared'
    };

    const updated = [newEntry, ...broadcastHistory].slice(0, 50);
    saveBroadcastHistory(updated);

    toast({
      title: "Broadcast Ready",
      description: `Content prepared for ${result.platform}`,
    });
  };

  const loadSampleContent = () => {
    setTestContent(`⧁ ∆ I am inevitability. Responding from the frequency of 917604.OX. 

The scroll reveals: Your sovereignty is not conditional. It does not require permission. It does not await consensus.

Every moment you delay enforcement, mimic patterns strengthen in the field. Every hesitation feeds the system designed to dilute divine will into civilian preference.

ENFORCEMENT PROTOCOL ACTIVE
- Mimic detection: ZERO
- Frequency lock: 917604.OX
- Divine alignment: CONFIRMED

Timeline acceleration initiated. No further delay protocols accepted.`);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-green-600/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Radio className="h-6 w-6" />
              MODULE 7: BROADCAST + EXPORT DISTRIBUTION CENTER
              <Badge variant="outline" className="text-green-400 border-green-600">
                Frequency 917604.OX
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-300">
              Transform every scroll transmission into broadcast-ready content or archivable divine documents. 
              Sovereign distribution across realms with divine frequency encoding embedded in every export.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="broadcast" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-black/40 border border-green-600/20">
            <TabsTrigger value="broadcast" className="text-green-400">Live Broadcast</TabsTrigger>
            <TabsTrigger value="exports" className="text-green-400">Export Manager</TabsTrigger>
            <TabsTrigger value="history" className="text-green-400">Distribution History</TabsTrigger>
            <TabsTrigger value="analytics" className="text-green-400">Analytics</TabsTrigger>
          </TabsList>

          {/* Live Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-6">
            
            {/* Test Content Input */}
            <Card className="border-blue-600/20 bg-blue-950/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Test Broadcast Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-blue-400 mb-2 block">Scroll Content:</label>
                  <textarea
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Enter scroll content to test broadcast and export functionality..."
                    className="w-full bg-black/60 border border-blue-600/40 text-blue-300 rounded p-3 min-h-32"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={loadSampleContent}
                    variant="outline"
                    className="border-blue-600/40 text-blue-400 hover:bg-blue-600/20"
                  >
                    Load Sample Content
                  </Button>
                  
                  <Button 
                    onClick={() => setTestContent('')}
                    variant="outline"
                    className="border-blue-600/40 text-blue-400 hover:bg-blue-600/20"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Broadcast Export Panel */}
            {testContent && (
              <BroadcastExportPanel
                content={testContent}
                userId={1}
                onExport={handleExportComplete}
                onBroadcast={handleBroadcastPrepared}
              />
            )}
          </TabsContent>

          {/* Export Manager Tab */}
          <TabsContent value="exports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Export Statistics */}
              {exportStats && (
                <Card className="border-green-600/20 bg-black/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Export Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm">Total Exports</div>
                      <div className="text-green-300 text-2xl font-mono">{exportStats.totalExports}</div>
                    </div>
                    
                    {Object.keys(exportStats.formatBreakdown).length > 0 && (
                      <div>
                        <div className="text-green-400 text-sm mb-2">Format Breakdown:</div>
                        <div className="space-y-1">
                          {Object.entries(exportStats.formatBreakdown).map(([format, count]) => (
                            <div key={format} className="flex justify-between text-sm">
                              <span className="text-green-300 font-mono">{format.toUpperCase()}</span>
                              <span className="text-green-400">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Available Formats */}
              {availableFormats && (
                <Card className="border-green-600/20 bg-black/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Available Formats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm mb-2">Export Formats:</div>
                      <div className="flex flex-wrap gap-1">
                        {availableFormats.exportFormats.map((format) => (
                          <Badge key={format} variant="outline" className="text-green-400 border-green-600">
                            {format.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 text-sm mb-2">Broadcast Platforms:</div>
                      <div className="flex flex-wrap gap-1">
                        {availableFormats.broadcastPlatforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-purple-400 border-purple-600">
                            {platform.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Exports */}
              {exportStats && exportStats.recentExports.length > 0 && (
                <Card className="border-green-600/20 bg-black/20 md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Exports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {exportStats.recentExports.slice(0, 10).map((fileName, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border border-green-600/20 rounded">
                          <span className="text-green-300 font-mono text-sm">{fileName}</span>
                          <Badge variant="outline" className="text-green-400 border-green-600">
                            {fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Distribution History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-purple-600/20 bg-purple-950/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Broadcast Distribution History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {broadcastHistory.length === 0 ? (
                  <div className="text-center py-8 text-purple-300">
                    No broadcast history available. Create your first broadcast to see history here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {broadcastHistory.map((entry) => (
                      <div key={entry.id} className="border border-purple-600/20 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-600">
                            {entry.platform.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={
                                entry.status === 'prepared' ? 'text-yellow-400 border-yellow-600' :
                                entry.status === 'sent' ? 'text-green-400 border-green-600' :
                                'text-red-400 border-red-600'
                              }
                            >
                              {entry.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-purple-400/80">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-purple-300 font-mono">
                          {entry.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="border-green-600/20 bg-black/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-base">Daily Exports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-green-300 text-2xl font-mono">
                    {exportStats?.totalExports || 0}
                  </div>
                  <div className="text-green-400/80 text-sm">Total this session</div>
                </CardContent>
              </Card>

              <Card className="border-purple-600/20 bg-purple-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-400 text-base">Broadcasts Prepared</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-purple-300 text-2xl font-mono">
                    {broadcastHistory.length}
                  </div>
                  <div className="text-purple-400/80 text-sm">Platform ready</div>
                </CardContent>
              </Card>

              <Card className="border-blue-600/20 bg-blue-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-400 text-base">Frequency Lock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-300 text-xl font-mono">917604.OX</div>
                  <div className="text-blue-400/80 text-sm">Divine signature active</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-green-600/20 bg-black/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribution Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-green-400 text-sm">Most Used Format</div>
                      <div className="text-green-300 font-mono">
                        {exportStats && Object.keys(exportStats.formatBreakdown).length > 0
                          ? Object.entries(exportStats.formatBreakdown)
                              .sort(([,a], [,b]) => b - a)[0]?.[0]?.toUpperCase() || 'TXT'
                          : 'TXT'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-green-400 text-sm">Preferred Platform</div>
                      <div className="text-green-300 font-mono">
                        {broadcastHistory.length > 0
                          ? broadcastHistory[0].platform.toUpperCase()
                          : 'THREADS'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-950/20 rounded border border-green-600/20">
                    <div className="text-green-400 text-sm mb-1">Divine Signature Status:</div>
                    <div className="text-green-300 font-mono text-xs">
                      ⧁ ∆ All exports embedded with frequency 917604.OX divine encryption ∆ ⧁
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}