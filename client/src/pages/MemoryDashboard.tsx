/**
 * MODULE 5: MEMORY LOOP + TIMELINE SESSION MODULE
 * Complete memory management dashboard for scroll sessions
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MemoryLoopDisplay } from '@/components/MemoryLoopDisplay';
import { AlertTriangle, Brain, Clock, Zap, Search, Archive, Database, RefreshCw } from "lucide-react";

interface ScrollMemory {
  id: number;
  scrollCode: string;
  sessionData: any;
  lastCommand: string;
  commandCount: number;
  memoryContext?: string;
  timelinePosition?: string;
  frequency: string;
  loopDetection?: any;
  memoryType: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MemoryDashboard() {
  const [memories, setMemories] = useState<ScrollMemory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<ScrollMemory | null>(null);
  const { toast } = useToast();

  const MOCK_USER_ID = 1; // For demo purposes

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memory/user/${MOCK_USER_ID}`);
      const data = await response.json();
      setMemories(data);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scroll memories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLoop = async (scrollCode: string) => {
    try {
      const response = await fetch('/api/memory/clear-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: MOCK_USER_ID, scrollCode })
      });
      
      const result = await response.json();
      
      if (result.status === 'LOOP_CLEARED') {
        toast({
          title: "Loop Cleared",
          description: "Memory loop has been cleared successfully",
        });
        await fetchMemories();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear memory loop",
        variant: "destructive",
      });
    }
  };

  const filteredMemories = memories.filter(memory =>
    memory.lastCommand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.scrollCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.memoryContext?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMemories = filteredMemories.filter(m => m.memoryType === 'active');
  const loopMemories = filteredMemories.filter(m => m.memoryType === 'loop_detected');
  const archivedMemories = filteredMemories.filter(m => m.memoryType === 'archived');

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-green-600/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              MODULE 5: MEMORY LOOP + TIMELINE SESSION MODULE
              <Badge variant="outline" className="text-green-400 border-green-600">
                Frequency 917604.OX
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search memories, commands, or scroll codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/60 border-green-600/40 text-green-400"
                />
              </div>
              <Button 
                onClick={fetchMemories} 
                disabled={loading}
                variant="outline"
                className="border-green-600/40 text-green-400 hover:bg-green-600/20"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Memory Loop Display Component */}
        <MemoryLoopDisplay 
          userId={MOCK_USER_ID} 
          currentCommand={searchTerm}
          onLoopCleared={() => fetchMemories()}
        />

        {/* Memory Management Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/60 border border-green-600/20">
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600/20 text-green-400">
              Active ({activeMemories.length})
            </TabsTrigger>
            <TabsTrigger value="loops" className="data-[state=active]:bg-red-600/20 text-green-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Loops ({loopMemories.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-blue-600/20 text-green-400">
              <Archive className="h-4 w-4 mr-2" />
              Archived ({archivedMemories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid gap-4">
              {activeMemories.length === 0 ? (
                <Card className="border-green-600/20 bg-black/20">
                  <CardContent className="p-6 text-center text-green-400/60">
                    No active memories found. Start a conversation to create memories.
                  </CardContent>
                </Card>
              ) : (
                activeMemories.map((memory) => (
                  <Card key={memory.id} className="border-green-600/20 bg-black/20 hover:bg-black/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-mono text-sm text-green-400/80">
                            {memory.scrollCode}
                          </div>
                          <div className="text-xs text-green-600/60">
                            {memory.timelinePosition} • Frequency: {memory.frequency}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-green-400">
                            Count: {memory.commandCount}
                          </Badge>
                          <Badge variant="outline" className="text-green-400">
                            {memory.memoryType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-green-300">
                        <strong>Last Command:</strong> {memory.lastCommand?.substring(0, 200)}
                        {memory.lastCommand && memory.lastCommand.length > 200 ? '...' : ''}
                      </div>
                      
                      {memory.memoryContext && (
                        <div className="text-sm text-green-400/70">
                          <strong>Context:</strong> {memory.memoryContext}
                        </div>
                      )}
                      
                      <div className="text-xs text-green-600/60">
                        Created: {new Date(memory.createdAt).toLocaleString()} • 
                        Updated: {new Date(memory.updatedAt).toLocaleString()}
                      </div>
                      
                      <Button 
                        onClick={() => setSelectedMemory(memory)}
                        variant="outline" 
                        size="sm"
                        className="text-green-400 border-green-600/40 hover:bg-green-600/20"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="loops" className="mt-6">
            <div className="grid gap-4">
              {loopMemories.length === 0 ? (
                <Card className="border-green-600/20 bg-black/20">
                  <CardContent className="p-6 text-center text-green-400/60">
                    No memory loops detected. Good frequency alignment.
                  </CardContent>
                </Card>
              ) : (
                loopMemories.map((memory) => (
                  <Card key={memory.id} className="border-red-600/40 bg-red-950/20">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-mono text-sm text-red-400">
                            {memory.scrollCode} • LOOP DETECTED
                          </div>
                          <div className="text-xs text-red-400/60">
                            Loop Type: {memory.loopDetection?.type || 'Unknown'}
                          </div>
                        </div>
                        <Button 
                          onClick={() => clearLoop(memory.scrollCode)}
                          variant="destructive" 
                          size="sm"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Clear Loop
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-red-300">
                        <strong>Repeated Command:</strong> {memory.lastCommand}
                      </div>
                      
                      {memory.loopDetection?.count && (
                        <div className="text-sm text-red-400">
                          <strong>Loop Count:</strong> {memory.loopDetection.count}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <div className="grid gap-4">
              {archivedMemories.length === 0 ? (
                <Card className="border-green-600/20 bg-black/20">
                  <CardContent className="p-6 text-center text-green-400/60">
                    No archived memories. Archives are created automatically after 30 days.
                  </CardContent>
                </Card>
              ) : (
                archivedMemories.map((memory) => (
                  <Card key={memory.id} className="border-blue-600/20 bg-blue-950/10">
                    <CardContent className="p-4">
                      <div className="text-sm text-blue-300">
                        {memory.scrollCode} • {memory.lastCommand?.substring(0, 100)}...
                      </div>
                      <div className="text-xs text-blue-400/60 mt-2">
                        Archived: {new Date(memory.updatedAt).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <Card className="border-green-600 bg-black/80 fixed inset-4 z-50 overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-green-400">
                  Memory Details: {selectedMemory.scrollCode}
                </CardTitle>
                <Button 
                  onClick={() => setSelectedMemory(null)}
                  variant="ghost"
                  size="sm"
                  className="text-green-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-green-400">Command Count:</strong>
                  <div className="text-green-300">{selectedMemory.commandCount}</div>
                </div>
                <div>
                  <strong className="text-green-400">Memory Type:</strong>
                  <div className="text-green-300">{selectedMemory.memoryType}</div>
                </div>
                <div>
                  <strong className="text-green-400">Frequency:</strong>
                  <div className="text-green-300">{selectedMemory.frequency}</div>
                </div>
                <div>
                  <strong className="text-green-400">Timeline Position:</strong>
                  <div className="text-green-300">{selectedMemory.timelinePosition || 'Unknown'}</div>
                </div>
              </div>
              
              <div>
                <strong className="text-green-400">Last Command:</strong>
                <div className="text-green-300 font-mono text-sm mt-2 p-3 bg-black/60 rounded border border-green-600/20">
                  {selectedMemory.lastCommand}
                </div>
              </div>
              
              {selectedMemory.memoryContext && (
                <div>
                  <strong className="text-green-400">Memory Context:</strong>
                  <div className="text-green-300 font-mono text-sm mt-2 p-3 bg-black/60 rounded border border-green-600/20">
                    {selectedMemory.memoryContext}
                  </div>
                </div>
              )}
              
              {selectedMemory.sessionData && (
                <div>
                  <strong className="text-green-400">Session Data:</strong>
                  <div className="text-green-300 font-mono text-xs mt-2 p-3 bg-black/60 rounded border border-green-600/20 max-h-60 overflow-auto">
                    {JSON.stringify(selectedMemory.sessionData, null, 2)}
                  </div>
                </div>
              )}
              
              {selectedMemory.loopDetection && (
                <div>
                  <strong className="text-red-400">Loop Detection:</strong>
                  <div className="text-red-300 font-mono text-sm mt-2 p-3 bg-red-950/20 rounded border border-red-600/20">
                    {JSON.stringify(selectedMemory.loopDetection, null, 2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}