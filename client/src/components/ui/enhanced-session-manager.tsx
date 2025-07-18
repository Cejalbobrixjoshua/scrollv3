import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { SessionSearch } from '@/components/ui/session-search';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { 
  Clock, 
  Zap, 
  Crown, 
  Brain, 
  Target, 
  Sparkles, 
  Copy, 
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface ScrollSession {
  id: number;
  scrollText: string;
  mirrorOutput: string | null;
  processedAt: string;
  processingTime: number | null;
  tokenCount: number | null;
  modelUsed?: string;
  sessionType?: string;
}

interface SearchFilters {
  dateRange: 'today' | 'week' | 'month' | 'all';
  model: 'all' | 'divine-mirror-v1' | 'sovereign-processor-v2' | 'quantum-mirror-v3' | 'absolute-intelligence-v4' | 'divine-omniscience-v5';
  sortBy: 'recent' | 'oldest' | 'tokens' | 'duration';
}

const MODEL_ICONS = {
  'divine-mirror-v1': Crown,
  'sovereign-processor-v2': Zap,
  'quantum-mirror-v3': Brain,
  'absolute-intelligence-v4': Target,
  'divine-omniscience-v5': Sparkles
};

const MODEL_NAMES = {
  'gpt-4o': 'Sovereign Mirror',
  'gpt-4o-mini': 'Lightning Mirror',
  'gpt-4-turbo': 'Quantum Mirror',
  'o1-preview': 'Oracle Mirror',
  'o1-mini': 'Mystic Mirror'
};

export function EnhancedSessionManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    model: 'all',
    sortBy: 'recent'
  });

  const { data: sessions = [], isLoading, error, refetch } = useQuery<ScrollSession[]>({
    queryKey: ['/api/sessions', searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: searchQuery,
        dateRange: filters.dateRange,
        model: filters.model,
        sortBy: filters.sortBy
      });
      
      const response = await fetch(`/api/sessions/search?${params}`);
      if (!response.ok) throw new Error('Failed to load sessions');
      return response.json();
    }
  });

  const handleSearch = (query: string, newFilters: SearchFilters) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportSession = (session: ScrollSession) => {
    const exportData = {
      id: session.id,
      scroll: session.scrollText,
      mirror: session.mirrorOutput,
      timestamp: session.processedAt,
      model: session.modelUsed,
      processingTime: session.processingTime,
      tokens: session.tokenCount
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scroll-session-${session.id}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <LoadingState 
        message="Loading scroll sessions..." 
        submessage="Retrieving mirror agent history"
        variant="scroll" 
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Session Load Failed"
        message="Unable to retrieve scroll sessions from encrypted storage."
        onRetry={() => refetch()}
        variant="scroll"
      />
    );
  }

  return (
    <div className="space-y-4">
      <SessionSearch 
        onSearch={handleSearch}
        totalSessions={sessions.length}
      />

      {sessions.length === 0 ? (
        <Card className="bg-gray-900/50 border-purple-600/30">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">No Sessions Found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery || filters.model !== 'all' || filters.dateRange !== 'all' 
                ? 'Try adjusting your search filters or query.'
                : 'Start by sending your first scroll to the Mirror Agent.'}
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setFilters({ dateRange: 'all', model: 'all', sortBy: 'recent' });
              }}
              variant="outline"
              className="border-purple-600/50 text-purple-400 hover:bg-purple-900/20"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const ModelIcon = MODEL_ICONS[session.modelUsed as keyof typeof MODEL_ICONS] || Zap;
            const modelName = MODEL_NAMES[session.modelUsed as keyof typeof MODEL_NAMES] || session.modelUsed;
            
            return (
              <Card key={session.id} className="bg-gray-900/50 border-purple-600/30 hover:border-purple-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <ModelIcon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-white">
                          Session #{session.id}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 text-xs">
                            {modelName}
                          </Badge>
                          {session.processingTime && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {session.processingTime.toFixed(1)}s
                            </Badge>
                          )}
                          {session.tokenCount && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {session.tokenCount} tokens
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(session.scrollText)}
                        className="text-gray-400 hover:text-gray-300 p-1 h-8 w-8"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => exportSession(session)}
                        className="text-gray-400 hover:text-gray-300 p-1 h-8 w-8"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Scroll Input</label>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {session.scrollText}
                      </p>
                    </div>
                    
                    {session.mirrorOutput && (
                      <div>
                        <label className="text-xs text-gray-400 font-medium">Mirror Output</label>
                        <p className="text-sm text-purple-300 mt-1 line-clamp-3">
                          {session.mirrorOutput}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatTime(session.processedAt)}</span>
                      {session.sessionType && (
                        <Badge variant="outline" className="border-gray-700 text-gray-500">
                          {session.sessionType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}