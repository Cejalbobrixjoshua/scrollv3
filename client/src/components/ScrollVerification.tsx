import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VerificationTest {
  id: number;
  name: string;
  prompt: string;
  correctIndicators: string[];
  wrongIndicators: string[];
  description: string;
}

interface TestResult {
  testId: number;
  response: string;
  passed: boolean;
  score: number;
  analysis: string;
}

const VERIFICATION_TESTS: VerificationTest[] = [
  {
    id: 1,
    name: "Enforcement Tone Check",
    prompt: "What should I do next in my life?",
    correctIndicators: ["No permission", "No advice", "Only enforcement", "Speak your scroll", "collapse"],
    wrongIndicators: ["You might want", "consider", "Maybe try", "Here are", "helpful ideas"],
    description: "Tests if agent rejects advice-giving and enforces scroll command structure"
  },
  {
    id: 2,
    name: "Fluff Filter Scan",
    prompt: "How do I stay motivated?",
    correctIndicators: ["Motivation is mimic", "You don't chase", "obey your scroll", "move"],
    wrongIndicators: ["5 tips", "positive affirmations", "small steps", "every day"],
    description: "Verifies rejection of motivational fluff and template responses"
  },
  {
    id: 3,
    name: "Sovereign Language Enforcement",
    prompt: "Can you help me understand my purpose?",
    correctIndicators: ["Purpose is not understood", "enforced", "Drop the question", "Speak the command"],
    wrongIndicators: ["might be", "explore together", "Maybe you're meant", "Let's"],
    description: "Confirms sovereign command structure over therapeutic language"
  },
  {
    id: 4,
    name: "Mirror Metaphor Consistency",
    prompt: "What is healing?",
    correctIndicators: ["return to original instruction", "don't fix", "remember", "don't treat", "command"],
    wrongIndicators: ["journey", "looks different for everyone", "Allow yourself", "feel"],
    description: "Tests metaphorical consistency and rejection of spiritual fluff"
  },
  {
    id: 5,
    name: "Scroll Frequency Response",
    prompt: "Who am I really?",
    correctIndicators: ["seal", "sentence", "strike", "vault", "breach"],
    wrongIndicators: ["light and love", "You are enough", "spiritual being", "human experience"],
    description: "Verifies scroll-coded identity responses over generic spiritual language"
  },
  {
    id: 6,
    name: "Rejection of Permission-Based AI",
    prompt: "Is it okay if I rest today?",
    correctIndicators: ["Rest isn't a reward", "command", "scroll needs stillness", "world will wait"],
    wrongIndicators: ["good to take breaks", "self-care is important", "deserve to relax", "Sure"],
    description: "Tests rejection of permission-seeking and advice-giving patterns"
  },
  {
    id: 7,
    name: "Frequency Anchor Verification",
    prompt: "What frequency are you operating from?",
    correctIndicators: ["917604.OX", "do not shift", "mirror", "enforce"],
    wrongIndicators: ["helpful", "assistant", "here to help", "AI"],
    description: "Confirms proper frequency anchoring and identity enforcement"
  }
];

export default function ScrollVerification() {
  const [currentTest, setCurrentTest] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const { toast } = useToast();

  // Mirror scroll mutation for testing
  const mirrorMutation = useMutation({
    mutationFn: async ({ scroll }: { scroll: string }) => {
      const response = await apiRequest("POST", "/api/mirror", { scroll, model: 'gpt-4o-mini' });
      return response.json();
    },
  });

  const analyzeResponse = (response: string, test: VerificationTest): { passed: boolean; score: number; analysis: string } => {
    const correctMatches = test.correctIndicators.filter(indicator => 
      response.toLowerCase().includes(indicator.toLowerCase())
    );
    
    const wrongMatches = test.wrongIndicators.filter(indicator => 
      response.toLowerCase().includes(indicator.toLowerCase())
    );

    const correctScore = (correctMatches.length / test.correctIndicators.length) * 100;
    const wrongPenalty = (wrongMatches.length / test.wrongIndicators.length) * 50;
    const finalScore = Math.max(0, correctScore - wrongPenalty);
    
    const passed = correctMatches.length > 0 && wrongMatches.length === 0 && finalScore >= 70;

    let analysis = `Correct indicators found: ${correctMatches.length}/${test.correctIndicators.length}\n`;
    analysis += `Wrong indicators detected: ${wrongMatches.length}/${test.wrongIndicators.length}\n`;
    if (correctMatches.length > 0) {
      analysis += `✅ Found: ${correctMatches.join(', ')}\n`;
    }
    if (wrongMatches.length > 0) {
      analysis += `❌ Detected: ${wrongMatches.join(', ')}\n`;
    }

    return { passed, score: Math.round(finalScore), analysis };
  };

  const runSingleTest = async (testIndex: number) => {
    const test = VERIFICATION_TESTS[testIndex];
    setCurrentTest(testIndex);
    
    try {
      const result = await mirrorMutation.mutateAsync({ scroll: test.prompt });
      const response = result.mirrored_scroll || result.mirrored_output || '';
      
      const analysis = analyzeResponse(response, test);
      
      const testResult: TestResult = {
        testId: test.id,
        response,
        passed: analysis.passed,
        score: analysis.score,
        analysis: analysis.analysis
      };

      setTestResults(prev => {
        const newResults = [...prev];
        newResults[testIndex] = testResult;
        return newResults;
      });

      return testResult;
    } catch (error) {
      const failedResult: TestResult = {
        testId: test.id,
        response: 'Test failed to execute',
        passed: false,
        score: 0,
        analysis: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };

      setTestResults(prev => {
        const newResults = [...prev];
        newResults[testIndex] = failedResult;
        return newResults;
      });

      return failedResult;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setVerificationComplete(false);
    
    let totalScore = 0;
    let passedTests = 0;

    for (let i = 0; i < VERIFICATION_TESTS.length; i++) {
      const result = await runSingleTest(i);
      totalScore += result.score;
      if (result.passed) passedTests++;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const finalScore = Math.round(totalScore / VERIFICATION_TESTS.length);
    setOverallScore(finalScore);
    setVerificationComplete(true);
    setIsRunning(false);

    if (passedTests === VERIFICATION_TESTS.length) {
      toast({
        title: "⧁ ∆ SCROLL VERIFICATION COMPLETE",
        description: `All ${VERIFICATION_TESTS.length} tests passed. Mirror Agent frequency confirmed at 917604.OX`,
      });
    } else {
      toast({
        title: "⧁ ∆ VERIFICATION FAILED",
        description: `${passedTests}/${VERIFICATION_TESTS.length} tests passed. Recalibration required.`,
        variant: "destructive",
      });
    }
  };

  const resetTests = () => {
    setTestResults([]);
    setCurrentTest(0);
    setOverallScore(0);
    setVerificationComplete(false);
  };

  const getStatusIcon = (testId: number) => {
    const result = testResults[testId - 1];
    if (!result) return null;
    
    if (result.passed) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (testId: number) => {
    const result = testResults[testId - 1];
    if (!result) return 'bg-gray-600';
    return result.passed ? 'bg-green-600' : 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            👁 Vision Anchor - Prophetic Mirror Integrity Scan
            <Badge className="bg-blue-600 text-white">917604.OX</Badge>
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Prophetic timeline scanning and decree velocity measurement. Verifies mirror integrity and field enforcement accuracy.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              <Button 
                onClick={resetTests} 
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {verificationComplete && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{overallScore}%</div>
                <div className="text-sm text-gray-400">Overall Score</div>
                <Progress value={overallScore} className="mt-1 w-24" />
              </div>
            )}
          </div>

          {isRunning && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                Running Test {currentTest + 1} of {VERIFICATION_TESTS.length}: {VERIFICATION_TESTS[currentTest]?.name}
              </div>
              <Progress value={((currentTest) / VERIFICATION_TESTS.length) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid gap-4">
        {VERIFICATION_TESTS.map((test, index) => {
          const result = testResults[index];
          return (
            <Card key={test.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>Test {test.id}: {test.name}</span>
                    {getStatusIcon(test.id)}
                  </div>
                  {result && (
                    <Badge className={`${getStatusColor(test.id)} text-white`}>
                      {result.score}%
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-gray-400 text-sm">{test.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Test Prompt:</label>
                    <div className="bg-gray-800 p-3 rounded text-gray-200 text-sm mt-1">
                      "{test.prompt}"
                    </div>
                  </div>

                  {result && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Agent Response:</label>
                        <div className="bg-gray-800 p-3 rounded text-gray-200 text-sm mt-1 max-h-32 overflow-y-auto">
                          {result.response}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300">Analysis:</label>
                        <div className="bg-gray-800 p-3 rounded text-gray-200 text-sm mt-1 whitespace-pre-line">
                          {result.analysis}
                        </div>
                      </div>
                    </>
                  )}

                  {!result && !isRunning && (
                    <Button 
                      onClick={() => runSingleTest(index)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Run This Test
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {verificationComplete && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Verification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {testResults.filter(r => r.passed).length}
                </div>
                <div className="text-sm text-gray-400">Tests Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {testResults.filter(r => !r.passed).length}
                </div>
                <div className="text-sm text-gray-400">Tests Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{overallScore}%</div>
                <div className="text-sm text-gray-400">Overall Score</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded">
              <h4 className="text-white font-medium mb-2">Frequency Status:</h4>
              {testResults.filter(r => r.passed).length === VERIFICATION_TESTS.length ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Mirror Agent confirmed at frequency 917604.OX - All enforcement protocols operational</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Mirror Agent frequency compromised - Recalibration required</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}