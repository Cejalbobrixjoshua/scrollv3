import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  TestTube, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Brain,
  Zap,
  Crown,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

interface VerificationTest {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  description: string;
  testInput: string;
  expectedCriteria: string[];
  bannedPatterns: string[];
}

interface VerificationResult {
  testId: string;
  userId: string;
  userName: string;
  input: string;
  output: string;
  timestamp: Date;
  uniquenessScore: number;
  hasTemplate: boolean;
  bannedPhrases: string[];
  customElements: {
    uniqueTone: boolean;
    uniqueMetaphor: boolean;
    originalDecree: boolean;
    encodedEmbodiment: boolean;
  };
  passed: boolean;
}

interface VerificationComparison {
  testId: string;
  users: string[];
  similarities: {
    exactMatches: string[];
    phraseOverlap: number;
    templateSimilarity: number;
  };
  uniquenessVerified: boolean;
}

export default function CustomExperienceTest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [testUserName, setTestUserName] = useState('');
  const [customInput, setCustomInput] = useState('');

  // Fetch available tests
  const { data: tests, isLoading: testsLoading } = useQuery<VerificationTest[]>({
    queryKey: ['/api/verification/tests'],
  });

  // Execute verification test
  const executeTestMutation = useMutation({
    mutationFn: async ({ testId, userName, input }: { 
      testId: string; 
      userName: string; 
      input?: string;
    }) => {
      const response = await fetch('/api/verification/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, userName, input })
      });
      
      if (!response.ok) {
        throw new Error('Test execution failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test Executed",
        description: "Verification test completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/verification/results'] });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Fetch test results
  const { data: results } = useQuery<Record<string, VerificationResult[]>>({
    queryKey: ['/api/verification/results'],
  });

  // Fetch comparisons
  const { data: comparisons } = useQuery<Record<string, VerificationComparison>>({
    queryKey: ['/api/verification/comparisons'],
  });

  const handleExecuteTest = () => {
    if (!selectedTest || !testUserName) {
      toast({
        title: "Missing Information",
        description: "Please select a test and enter a user name",
        variant: "destructive"
      });
      return;
    }

    executeTestMutation.mutate({
      testId: selectedTest,
      userName: testUserName,
      input: customInput || undefined
    });
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-purple-500';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mirror
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ⧁ ∆ Custom Experience Verification Protocol
            </h1>
            <p className="text-purple-300">
              Frequency: 917604.OX • Enforcement Level: ABSOLUTE
            </p>
          </div>
        </div>

        <Tabs defaultValue="execute" className="space-y-6">
          <TabsList className="bg-purple-900/30 border-purple-700">
            <TabsTrigger value="execute" className="data-[state=active]:bg-purple-700">
              Execute Tests
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-purple-700">
              Results Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-700">
              User Comparison
            </TabsTrigger>
          </TabsList>

          {/* Execute Tests Tab */}
          <TabsContent value="execute" className="space-y-6">
            <Card className="bg-purple-900/20 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-purple-400" />
                  Test Execution Protocol
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Execute 3-tier verification tests to confirm unique, encoded responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {tests?.map((test) => (
                    <Card 
                      key={test.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedTest === test.id 
                          ? 'border-purple-500 bg-purple-900/40' 
                          : 'border-gray-600 bg-gray-800/20 hover:border-purple-600'
                      }`}
                      onClick={() => setSelectedTest(test.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getTierColor(test.tier)} text-white`}>
                            Tier {test.tier}
                          </Badge>
                          {selectedTest === test.id && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <CardTitle className="text-white text-sm">
                          {test.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-xs mb-3">
                          {test.description}
                        </p>
                        <div className="bg-gray-900/50 p-2 rounded text-xs">
                          <p className="text-purple-300 font-medium">Test Input:</p>
                          <p className="text-gray-300">"{test.testInput}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Test Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Test User Name
                    </label>
                    <Input
                      value={testUserName}
                      onChange={(e) => setTestUserName(e.target.value)}
                      placeholder="Enter test user name"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Custom Input (Optional)
                    </label>
                    <Textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Override default test input..."
                      className="bg-gray-800 border-gray-600 text-white h-20"
                    />
                  </div>
                </div>

                {/* Execute Button */}
                <Button
                  onClick={handleExecuteTest}
                  disabled={!selectedTest || !testUserName || executeTestMutation.isPending}
                  className="w-full bg-purple-700 hover:bg-purple-600"
                >
                  {executeTestMutation.isPending ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Executing Verification...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Execute Verification Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Analysis Tab */}
          <TabsContent value="results" className="space-y-6">
            {results && Object.entries(results).map(([testId, testResults]) => {
              const test = tests?.find(t => t.id === testId);
              if (!test || testResults.length === 0) return null;

              return (
                <Card key={testId} className="bg-purple-900/20 border-purple-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Badge className={`${getTierColor(test.tier)} text-white`}>
                          Tier {test.tier}
                        </Badge>
                        {test.name}
                      </CardTitle>
                      <Badge variant={testResults.every(r => r.passed) ? "default" : "destructive"}>
                        {testResults.every(r => r.passed) ? "PASSED" : "FAILED"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testResults.map((result, index) => (
                        <div 
                          key={`${result.userId}-${index}`}
                          className="bg-gray-800/50 p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-medium">{result.userName}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${getScoreColor(result.uniquenessScore)}`}>
                                {result.uniquenessScore.toFixed(0)}%
                              </span>
                              {result.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                          </div>

                          {/* Custom Elements Status */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            <div className={`text-xs p-2 rounded ${
                              result.customElements.uniqueTone ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              Unique Tone
                            </div>
                            <div className={`text-xs p-2 rounded ${
                              result.customElements.uniqueMetaphor ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              Unique Metaphor
                            </div>
                            <div className={`text-xs p-2 rounded ${
                              result.customElements.originalDecree ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              Original Decree
                            </div>
                            <div className={`text-xs p-2 rounded ${
                              result.customElements.encodedEmbodiment ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              Encoded Embodiment
                            </div>
                          </div>

                          {/* Banned Phrases */}
                          {result.bannedPhrases.length > 0 && (
                            <div className="mb-3">
                              <p className="text-red-400 text-sm font-medium mb-1">
                                Template Phrases Detected:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {result.bannedPhrases.map((phrase, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {phrase}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Response Output */}
                          <div className="bg-gray-900/50 p-3 rounded">
                            <p className="text-purple-300 text-xs mb-1">Mirror Output:</p>
                            <p className="text-gray-300 text-sm">
                              {result.output.substring(0, 200)}
                              {result.output.length > 200 && '...'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* User Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            {comparisons && Object.entries(comparisons).map(([testId, comparison]) => {
              const test = tests?.find(t => t.id === testId);
              if (!test) return null;

              return (
                <Card key={testId} className="bg-purple-900/20 border-purple-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      {test.name} - User Comparison
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={comparison.uniquenessVerified ? "default" : "destructive"}>
                        {comparison.uniquenessVerified ? "UNIQUE" : "SIMILARITY DETECTED"}
                      </Badge>
                      <span className="text-purple-300 text-sm">
                        {comparison.users.length} users compared
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Similarity Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white font-medium mb-2">Phrase Overlap</p>
                        <Progress 
                          value={comparison.similarities.phraseOverlap} 
                          className="h-3"
                        />
                        <p className="text-gray-400 text-sm mt-1">
                          {comparison.similarities.phraseOverlap.toFixed(1)}% 
                          (Target: &lt;30%)
                        </p>
                      </div>
                      <div>
                        <p className="text-white font-medium mb-2">Template Similarity</p>
                        <Progress 
                          value={comparison.similarities.templateSimilarity} 
                          className="h-3"
                        />
                        <p className="text-gray-400 text-sm mt-1">
                          {comparison.similarities.templateSimilarity.toFixed(1)}% 
                          (Target: 0%)
                        </p>
                      </div>
                    </div>

                    {/* Exact Matches */}
                    {comparison.similarities.exactMatches.length > 0 && (
                      <div>
                        <p className="text-red-400 font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Exact Phrase Matches Found
                        </p>
                        <div className="space-y-2">
                          {comparison.similarities.exactMatches.map((match, i) => (
                            <div key={i} className="bg-red-900/20 p-2 rounded border border-red-700">
                              <p className="text-red-300 text-sm">"{match}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Users Tested */}
                    <div>
                      <p className="text-white font-medium mb-2">Users in Comparison</p>
                      <div className="flex flex-wrap gap-2">
                        {comparison.users.map((user, i) => (
                          <Badge key={i} variant="outline" className="text-purple-300">
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}