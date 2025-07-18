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
  xpReward: number;
  unlockCriteria: string;
  scrollTemplate?: string;
}

interface FieldEnforcementReport {
  id: string;
  userId: string;
  reportType: 'strike_assessment' | 'field_analysis' | 'collapse_confirmation' | 'timeline_enforcement';
  fieldReadings: string[];
  enforcementDirectives: string[];
  realityResponse: string[];
  scrollAlignmentScore: number;
  createdAt: string;
}

interface FieldStrike {
  directive: string;
  scrollIntegrityBonus: number;
  enforcementLevel: string;
}

export default function FieldEnforcementChamber() {
  const [scrollbearerProgress, setScrollbearerProgress] = useState<ScrollbearerProgress | null>(null);
  const [divineRings, setDivineRings] = useState<DivineRing[]>([]);
  const [currentRingLevels, setCurrentRingLevels] = useState<LearningLevel[]>([]);
  const [enforcementReport, setEnforcementReport] = useState<FieldEnforcementReport | null>(null);
  const [fieldStrike, setFieldStrike] = useState<FieldStrike | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rings' | 'enforcement' | 'seals'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFieldData();
  }, []);

  const loadFieldData = async () => {
    setIsLoading(true);
    let successCount = 0;

    // Load scrollbearer progress from Sacred Rings API
    try {
      const progressResponse = await fetch("/api/sacred-rings/progress/1");
      if (progressResponse.ok) {
        const progress = await progressResponse.json();
        setScrollbearerProgress(progress);
        successCount++;
        console.log('✅ Sacred Rings progress loaded successfully');
      } else {
        throw new Error(`HTTP ${progressResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to load Sacred Rings progress:', error);
      // Set default progress data to prevent UI crash
      setScrollbearerProgress({
        userId: "1",
        currentRing: "I_REMEMBRANCE",
        currentSeal: 3,
        scrollIntegrityIndex: 75,
        sovereigntyRank: "SOVEREIGN_APPRENTICE",
        completedRings: ["I_REMEMBRANCE"],
        divineSeals: [],
        flameConsistency: 82,
        lastEnforcementDate: new Date().toISOString()
      });
    }

    // Load divine rings from Sacred Rings API
    try {
      const ringsResponse = await fetch("/api/learning/paths");
      if (ringsResponse.ok) {
        const rings = await ringsResponse.json();
        setDivineRings(rings);
        successCount++;
        console.log('✅ Divine Rings loaded successfully');
      } else {
        throw new Error(`HTTP ${ringsResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to load Divine Rings:', error);
      // Set default rings to prevent UI crash
      setDivineRings([
        {
          id: "ring_i_remembrance",
          name: "Ring I - Remembrance Initiation",
          description: "Burn mimic learning. Identify inherited distortions and activate scroll-coded reversals",
          ringLevel: "I",
          totalSeals: 3,
          requiredScrollIntegrity: 0,
          flameGlyph: "🔥"
        }
      ]);
    }

    // Load field strike
    try {
      const strikeResponse = await fetch("/api/learning/field-strike/1");
      if (strikeResponse.ok) {
        const strike = await strikeResponse.json();
        setFieldStrike(strike);
        successCount++;
        console.log('✅ Field Strike loaded successfully');
      } else {
        throw new Error(`HTTP ${strikeResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to load Field Strike:', error);
      // Set default strike to prevent UI crash
      setFieldStrike({
        directive: "Maintain sovereign enforcement protocols during all interactions",
        scrollIntegrityBonus: 25,
        enforcementLevel: "FREQUENCY_HOLD"
      });
    }

    if (successCount === 3) {
      console.log('⧁ ∆ All Field Enforcement data loaded successfully ∆ ⧁');
      toast({
        title: "⧁ ∆ Field Enforcement Chamber Online ∆ ⧁",
        description: "All divine protocols activated. Frequency 917604.OX operational.",
      });
    } else if (successCount > 0) {
      console.log(`⚠️ Partial load success: ${successCount}/3 components loaded`);
      toast({
        title: "⧁ ∆ Field Enforcement Partially Online ∆ ⧁",
        description: `${successCount}/3 components operational. Using fallback protocols.`,
        variant: "default",
      });
    } else {
      toast({
        title: "⧁ ∆ Field Enforcement Offline ∆ ⧁",
        description: "Operating in emergency mode with fallback protocols.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
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
        title: "⧁ ∆ Field Enforcement Analysis Complete ∆ ⧁",
        description: "Reality compliance assessment operational. Divine directives activated.",
      });
    } catch (error) {
      console.error('Failed to generate enforcement report:', error);
      toast({
        title: "⧁ ∆ Field Analysis Failed ∆ ⧁",
        description: "Unable to generate enforcement report. Frequency interference detected at 917604.OX.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unlockDivineSeal = async (sealId: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", `/api/sacred-rings/unlock-seal/1/${sealId}`);
      const result = await response.json();
      
      if (result.success) {
        // Reload progress data
        await loadFieldData();
        toast({
          title: "⧁ ∆ DIVINE SEAL UNLOCKED ∆ ⧁",
          description: `${result.seal.name} - Sacred certification achieved through scroll enforcement.`,
        });
      }
    } catch (error) {
      console.error('Failed to unlock divine seal:', error);
      toast({
        title: "Seal Activation Failed",
        description: "Unable to unlock divine seal. Sovereignty level insufficient.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            ⧁ ∆ FIELD ENFORCEMENT CHAMBER ∆ ⧁
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
        </div>
      )}

      {/* Sacred Rings Tab */}
      {selectedTab === 'rings' && (
        <div className="space-y-6">
          {/* Quick Seal Unlock Panel */}
          <Card className="bg-gradient-to-r from-purple-900 to-violet-900 border-purple-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                ⧁ ∆ DIVINE SEAL ACTIVATION CHAMBER ∆ ⧁
              </CardTitle>
              <p className="text-sm text-purple-200 mt-1">Unlock sacred certifications through scroll enforcement</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['mimic_collapse_seal', 'timeline_mastery_seal', 'divine_commerce_seal', 'flamefield_integration_seal', 'sovereignty_perfection_seal'].map((sealId) => (
                  <Button
                    key={sealId}
                    onClick={() => unlockDivineSeal(sealId)}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-3 h-auto flex flex-col items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs text-center">{sealId.split('_')[0]}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Ring Progress */}
          {scrollbearerProgress && (
            <Card className="bg-gray-900 border-purple-500">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Active Ring Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">{scrollbearerProgress.currentRing}</p>
                    <p className="text-gray-400 text-sm">Seal {scrollbearerProgress.currentSeal}/7</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-bold">{scrollbearerProgress.scrollIntegrityIndex}%</p>
                    <p className="text-gray-400 text-sm">Scroll Integrity</p>
                  </div>
                </div>
                <Progress value={(scrollbearerProgress.currentSeal / 7) * 100} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* All Sacred Rings */}
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
        </div>
      )}

      {/* Divine Seals Tab */}
      {selectedTab === 'seals' && (
        <div>
          {scrollbearerProgress ? (
            scrollbearerProgress.divineSeals && scrollbearerProgress.divineSeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scrollbearerProgress.divineSeals.map((seal) => (
                  <Card key={seal.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white text-lg">
                          {seal.flameGlyph}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{seal.name}</h3>
                          <Badge className="bg-violet-500 text-white text-xs">
                            {seal.frequency}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{seal.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-violet-400 font-bold">+{seal.scrollIntegrityBonus}% Integrity</span>
                        <span className="text-xs text-gray-500">
                          {seal.sealedAt ? new Date(seal.sealedAt).toLocaleDateString() : 'Unsealed'}
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
                    <Crown className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300">No divine seals secured yet</p>
                    <p className="text-gray-500 text-sm">Complete sacred ring progressions to unlock divine seals</p>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Flame className="w-8 h-8 mx-auto mb-4 text-purple-400 animate-pulse" />
                  <p className="text-gray-300">Loading Divine Seals...</p>
                </div>
              </CardContent>
            </Card>
          )}
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
                    ⧁ ∆ Field Enforcement Analysis Complete ∆ ⧁
                  </CardTitle>
                  <p className="text-xs text-gray-400">Report ID: {enforcementReport.id} • Frequency: 917604.OX</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Field Readings
                    </h4>
                    <div className="space-y-2">
                      {enforcementReport.fieldReadings.map((reading, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded border-l-2 border-purple-500">
                          <p className="text-gray-300 text-sm">{reading}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Enforcement Directives
                    </h4>
                    <div className="space-y-2">
                      {enforcementReport.enforcementDirectives.map((directive, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded border-l-2 border-yellow-500">
                          <p className="text-gray-300 text-sm">{directive}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Reality Response Protocol
                    </h4>
                    <div className="space-y-2">
                      {enforcementReport.realityResponse.map((response, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded border-l-2 border-green-500">
                          <p className="text-gray-300 text-sm">{response}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Scroll Alignment Score</p>
                      <p className="text-2xl font-bold text-purple-400">{enforcementReport.scrollAlignmentScore}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Generated</p>
                      <p className="text-gray-300 text-sm">{new Date(enforcementReport.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No field enforcement report generated</p>
                  <p className="text-gray-500 text-sm">Click "Field Analysis" to generate compliance assessment</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}