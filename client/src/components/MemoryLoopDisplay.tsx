/**
 * MODULE 5: MEMORY LOOP + TIMELINE SESSION MODULE
 * Displays memory context and loop detection warnings
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, Brain, Zap } from "lucide-react";

interface MemoryContext {
  memory_context: string;
  timestamp: string;
  frequency: string;
}

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

interface MemoryLoopDisplayProps {
  userId: number;
  currentCommand?: string;
  onLoopCleared?: () => void;
}

export function MemoryLoopDisplay({ userId, currentCommand = '', onLoopCleared }: MemoryLoopDisplayProps) {
  const [memoryContext, setMemoryContext] = useState<MemoryContext | null>(null);
  const [userMemories, setUserMemories] = useState<ScrollMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemoryContext();
    fetchUserMemories();
  }, [userId, currentCommand]);

  const fetchMemoryContext = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memory/context/${userId}?command=${encodeURIComponent(currentCommand)}`);
      const data = await response.json();
      setMemoryContext(data);
    } catch (error) {
      console.error('Failed to fetch memory context:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemories = async () => {
    try {
      const response = await fetch(`/api/memory/user/${userId}`);
      const data = await response.json();
      setUserMemories(data);
    } catch (error) {
      console.error('Failed to fetch user memories:', error);
    }
  };

  const clearMemoryLoop = async (scrollCode: string) => {
    try {
      const response = await fetch('/api/memory/clear-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, scrollCode })
      });
      
      const result = await response.json();
      
      if (result.status === 'LOOP_CLEARED') {
        toast({
          title: "Memory Loop Cleared",
          description: "Loop detection has been reset. You may proceed.",
        });
        await fetchMemoryContext();
        await fetchUserMemories();
        onLoopCleared?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear memory loop",
        variant: "destructive",
      });
    }
  };

  const isLoopDetected = memoryContext?.memory_context?.includes('MEMORY LOOP DETECTED');
  const hasActiveMemories = userMemories.some(m => m.memoryType === 'active');

  return (
    <div className="space-y-4">
      {/* Memory Context Display */}
      <Card className="border-green-600/20 bg-black/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Scroll Memory Context
            <Badge variant="outline" className="text-green-400 border-green-600">
              {memoryContext?.frequency || '917604.OX'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-green-400/60">Loading memory context...</div>
          ) : memoryContext ? (
            <div className="font-mono text-sm text-green-400 whitespace-pre-wrap">
              {memoryContext.memory_context || 'No active memory context'}
            </div>
          ) : (
            <div className="text-green-400/60">No memory context available</div>
          )}
          
          <div className="text-xs text-green-600/60">
            Last Updated: {memoryContext?.timestamp ? new Date(memoryContext.timestamp).toLocaleString() : 'Unknown'}
          </div>
        </CardContent>
      </Card>

      {/* Loop Detection Warning */}
      {isLoopDetected && (
        <Card className="border-red-600 bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Memory Loop Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-red-300 text-sm">
              Scroll pattern repetition detected. Clear the loop to proceed with new commands.
            </div>
            <Button 
              onClick={() => {
                const loopMemory = userMemories.find(m => m.loopDetection);
                if (loopMemory) clearMemoryLoop(loopMemory.scrollCode);
              }}
              variant="destructive" 
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Collapse Mimic Loop
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User Memories Display */}
      {hasActiveMemories && (
        <Card className="border-green-600/20 bg-black/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Session Memories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userMemories.slice(0, 3).map((memory) => (
              <div key={memory.id} className="border border-green-600/20 rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-mono text-xs text-green-400/80">
                    {memory.scrollCode}
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={memory.memoryType === 'loop_detected' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {memory.memoryType}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-green-400">
                      x{memory.commandCount}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-green-300">
                  Last: {memory.lastCommand?.substring(0, 100)}
                  {memory.lastCommand && memory.lastCommand.length > 100 ? '...' : ''}
                </div>
                
                {memory.timelinePosition && (
                  <div className="text-xs text-green-600/60">
                    Timeline: {memory.timelinePosition}
                  </div>
                )}
                
                {memory.loopDetection && (
                  <div className="text-xs text-red-400">
                    Loop Type: {memory.loopDetection.type} (Count: {memory.loopDetection.count})
                  </div>
                )}
              </div>
            ))}
            
            {userMemories.length > 3 && (
              <div className="text-center text-green-600/60 text-sm">
                +{userMemories.length - 3} more memories
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}