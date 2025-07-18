import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Star, 
  BookOpen, 
  Zap, 
  Crown, 
  Flame,
  Award,
  ChevronRight,
  CheckCircle,
  Lock,
  Calendar,
  TrendingUp
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScrollbearerProgress {
  userId: string;
  currentRing: string | null;
  currentSeal: number;
  scrollIntegrityIndex: number;
  sovereigntyRank: string;
  completedRings: string[];
  divineSeals: DivineCertification[];
  flameConsistency: number;
  lastEnforcementDate: string;
}

interface DivineCertification {
  id: string;
  name: string;
  description: string;
  flameGlyph: string;
  scrollIntegrityBonus: number;
  sealedAt: string;
  frequency: '917604.OX' | 'Sacred' | 'Sovereign' | 'Eternal';
}

interface DivineRing {
  id: string;
  name: string;
  description: string;
  ringLevel: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';
  totalSeals: number;
  requiredScrollIntegrity: number;
  flameGlyph: string;
}

interface LearningLevel {
  id: string;
  pathId: string;
  levelNumber: number;
  name: string;
  description: string;
  objective: string;
  requiredActions: string[];
  scrollIntegrityBonus: number;
  enforcementCriteria: string;
  scrollTemplate?: string;
}

interface FieldEnforcementReport {
  id: string;
  userId: string;
  reportType: 'strike_assessment' | 'field_analysis' | 'collapse_confirmation' | 'timeline_enforcement';
  fieldReadings: string[];
  enforcementDirectives: string[];
  realityResponse: string[];
  personalizedContent: string;
  createdAt: string;
}

interface FieldStrike {
  directive: string;
  scrollIntegrityBonus: number;
  enforcementLevel: string;
}

export default function GamifiedLearning() {
  const [scrollbearerProgress, setScrollbearerProgress] = useState<ScrollbearerProgress | null>(null);
  const [divineRings, setDivineRings] = useState<DivineRing[]>([]);
  const [currentRingLevels, setCurrentRingLevels] = useState<LearningLevel[]>([]);
  const [enforcementReport, setEnforcementReport] = useState<FieldEnforcementReport | null>(null);
  const [fieldStrike, setFieldStrike] = useState<FieldStrike | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rings' | 'enforcement' | 'seals'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setIsLoading(true);
    try {
      // Load scrollbearer progress
      const progressResponse = await apiRequest("GET", "/api/learning/progress/1");
      const progress = await progressResponse.json();
      setScrollbearerProgress(progress);

      // Load divine rings
      const ringsResponse = await apiRequest("GET", "/api/learning/paths");
      const rings = await ringsResponse.json();
      setDivineRings(rings);

      // Load current ring levels
      if (progress.currentRing) {
        const levelsResponse = await apiRequest("GET", `/api/learning/paths/${progress.currentRing}/levels`);
        const levels = await levelsResponse.json();
        setCurrentRingLevels(levels);
      }

      // Load field strike
      const strikeResponse = await apiRequest("GET", "/api/learning/field-strike/1");
      const strike = await strikeResponse.json();
      setFieldStrike(strike);

    } catch (error) {
      console.error('Field Enforcement data loading error:', error);
      toast({
        title: "Field Loading Failed",
        description: "Unable to load scroll progress. Frequency interference detected.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnforcementReport = async () => {
    if (!scrollbearerProgress) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/learning/enforcement/1");
      const report = await response.json();
      setEnforcementReport(report);
      setSelectedTab('enforcement');
      
      toast({
        title: "Field Enforcement Analysis Complete",
        description: "Reality compliance report generated.",
      });
    } catch (error) {
      console.error('Failed to generate enforcement report:', error);
      toast({
        title: "Field Analysis Failed",
        description: "Unable to generate enforcement report. Frequency interference detected.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEnforcementColor = (enforcementLevel: string) => {
    switch (enforcementLevel) {
      case 'INITIATE': return 'bg-green-500';
      case 'SOVEREIGN': return 'bg-yellow-500';
      case 'DIVINE': return 'bg-orange-500';
      case 'ETERNAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case '917604.OX': return 'bg-purple-600';
      case 'Sacred': return 'bg-blue-600';
      case 'Sovereign': return 'bg-yellow-600';
      case 'Eternal': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getRankIcon = (rank: string) => {
    if (rank.includes('Divine') || rank.includes('Architect')) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank.includes('Quantum') || rank.includes('Master')) return <Star className="w-5 h-5 text-purple-400" />;
    if (rank.includes('Sovereign')) return <Trophy className="w-5 h-5 text-blue-400" />;
    return <Target className="w-5 h-5 text-green-400" />;
  };

  if (isLoading && !scrollbearerProgress) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Flame className="w-8 h-8 mx-auto mb-4 text-purple-400 animate-pulse" />
            <p className="text-gray-300">Loading Field Enforcement Chamber...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⧁ ∆ PROTOCOL: REMEMBRANCE ∆ ⧁
          </h2>
          <p className="text-sm text-gray-400 mt-1">Divine Function Embodiment System • Frequency 917604.OX</p>
        </div>
        <Button
          onClick={generateEnforcementReport}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          Field Analysis
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'overview', label: 'Field Status', icon: TrendingUp },
          { key: 'rings', label: 'Sacred Rings', icon: BookOpen },
          { key: 'enforcement', label: 'Field Chamber', icon: Zap },
          { key: 'seals', label: 'Divine Seals', icon: Trophy }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setSelectedTab(key as any)}
            variant={selectedTab === key ? "default" : "outline"}
            size="sm"
            className={selectedTab === key ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-gray-600 text-gray-400 hover:bg-gray-800"
            }
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && scrollbearerProgress && (
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                  {getRankIcon(scrollbearerProgress.sovereigntyRank)}
                  Sovereignty Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white">{scrollbearerProgress.sovereigntyRank}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Scroll Integrity Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-400">{scrollbearerProgress.scrollIntegrityIndex}%</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Flame Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-400">{scrollbearerProgress.flameConsistency}%</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Current Seal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-400">Seal {scrollbearerProgress.currentSeal}</div>
              </CardContent>
            </Card>
          </div>

          {/* Field Enforcement Chamber */}
          {fieldStrike && (
            <Card className="bg-gradient-to-r from-purple-900 to-violet-900 border-purple-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  ⚔️ FIELD ENFORCEMENT CHAMBER: "TODAY'S STRIKE"
                </CardTitle>
                <p className="text-sm text-purple-200 mt-1">Reality doesn't respond to effort. It responds to enforcement.</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-3 font-medium">{fieldStrike.directive}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-purple-200">
                    <span className="font-semibold">Enforcement Level:</span> {fieldStrike.enforcementLevel}
                  </div>
                  <div className="text-sm text-violet-200">
                    <span className="font-semibold">Scroll Integrity Bonus:</span> +{fieldStrike.scrollIntegrityBonus}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Ring Progress */}
          {scrollbearerProgress.currentRing && currentRingLevels.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Current Sacred Ring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {divineRings.find(r => r.id === scrollbearerProgress.currentRing)?.name}
                    </span>
                    <span className="text-gray-400">
                      Seal {scrollbearerProgress.currentSeal} / {currentRingLevels.length}
                    </span>
                  </div>
                  <Progress 
                    value={(scrollbearerProgress.currentSeal / currentRingLevels.length) * 100} 
                    className="w-full h-3"
                  />
                  
                  {/* Next Seal Preview */}
                  {currentRingLevels[scrollbearerProgress.currentSeal - 1] && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-2">
                        Next: {currentRingLevels[scrollbearerProgress.currentSeal - 1].name}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        {currentRingLevels[scrollbearerProgress.currentSeal - 1].description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Objective: {currentRingLevels[scrollbearerProgress.currentSeal - 1].objective}
                        </span>
                        <Badge className="bg-violet-500 text-white">
                          +{currentRingLevels[scrollbearerProgress.currentSeal - 1].scrollIntegrityBonus} SIB
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sacred Rings Tab */}
      {selectedTab === 'rings' && (
        <div className="space-y-4">
          {divineRings.map((ring) => {
            const isUnlocked = !scrollbearerProgress || scrollbearerProgress.scrollIntegrityIndex >= ring.requiredScrollIntegrity;
            const isCompleted = scrollbearerProgress?.completedRings.includes(ring.id);
            const isCurrent = scrollbearerProgress?.currentRing === ring.id;
            
            return (
              <Card key={ring.id} className={`bg-gray-900 border-gray-800 ${isCurrent ? 'ring-2 ring-purple-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : isUnlocked ? (
                        <Flame className="w-6 h-6 text-purple-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-500" />
                      )}
                      <div>
                        <CardTitle className={`${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                          {ring.flameGlyph} {ring.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-violet-600 text-white text-xs">
                            RING {ring.ringLevel}
                          </Badge>
                          <span className="text-xs text-gray-400">{ring.totalSeals} Seals</span>
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge className="bg-purple-500 text-white">ACTIVE</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`mb-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                    {ring.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {ring.totalSeals} Divine Seals
                    </span>
                    {!isUnlocked && (
                      <span className="text-sm text-yellow-400">
                        Requires {ring.requiredScrollIntegrity}% Scroll Integrity
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Field Enforcement Report Tab */}
      {selectedTab === 'enforcement' && (
        <div className="space-y-4">
          {enforcementReport ? (
            <div className="space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Scroll Mirror Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enforcementReport.fieldReadings.map((reading, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm">{reading}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Divine Directives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enforcementReport.enforcementDirectives.map((directive, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{directive}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Enforcement Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enforcementReport.realityResponse.map((response, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm">{response}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                  <p className="text-gray-300 mb-4">No scroll mirror analysis available</p>
                  <Button onClick={generateEnforcementReport} className="bg-purple-600 hover:bg-purple-700">
                    Execute Field Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Divine Seals Tab */}
      {selectedTab === 'seals' && scrollbearerProgress && (
        <div className="space-y-4">
          {scrollbearerProgress.divineSeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scrollbearerProgress.divineSeals.map((seal) => (
                <Card key={seal.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${getFrequencyColor(seal.frequency)} rounded-full flex items-center justify-center text-white text-lg`}>
                        {seal.flameGlyph}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{seal.name}</h3>
                        <Badge className={`${getFrequencyColor(seal.frequency)} text-white text-xs`}>
                          {seal.frequency}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{seal.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-bold">+{seal.scrollIntegrityBonus} SIB</span>
                      <span className="text-xs text-gray-500">
                        {new Date(seal.sealedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No divine seals activated yet</p>
                  <p className="text-gray-500 text-sm">Execute sacred ring enforcement protocols to activate divine seals</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}