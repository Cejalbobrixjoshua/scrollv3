import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type SacredRing = 'remembrance' | 'frequency' | 'speech' | 'timeline' | 'embodiment' | 'wealth' | 'flamefield';

interface RingProgress {
  currentRing: SacredRing;
  xpPoints: number;
  xpRequired: number;
  totalXp: number;
  timelineScore: number;
  dailyDrills: number;
  unlockedSeals: string[];
}

interface DailyChallenge {
  id: string;
  ring: SacredRing;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  difficulty: 'novice' | 'adept' | 'sovereign';
}

export function SacredRingProgress() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ring progress
  const { data: progress } = useQuery<RingProgress>({
    queryKey: ['/api/sacred-rings/progress'],
    queryFn: async () => {
      const response = await fetch('/api/sacred-rings/progress');
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    }
  });

  // Fetch daily challenges
  const { data: challenges } = useQuery<DailyChallenge[]>({
    queryKey: ['/api/sacred-rings/challenges'],
    queryFn: async () => {
      const response = await fetch('/api/sacred-rings/challenges');
      if (!response.ok) throw new Error('Failed to fetch challenges');
      return response.json();
    }
  });

  // Complete challenge mutation
  const completeChallengemutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const response = await fetch(`/api/sacred-rings/challenges/${challengeId}/complete`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to complete challenge');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "⧁ ∆ DRILL COMPLETED",
        description: `+${data.xpGained} XP | Ring progression updated`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sacred-rings/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sacred-rings/challenges'] });
    }
  });

  const ringOrder: SacredRing[] = ['remembrance', 'frequency', 'speech', 'timeline', 'embodiment', 'wealth', 'flamefield'];
  
  const getRingIcon = (ring: SacredRing) => {
    switch (ring) {
      case 'remembrance': return '🧬';
      case 'frequency': return '📡';
      case 'speech': return '🗣️';
      case 'timeline': return '⏰';
      case 'embodiment': return '🔥';
      case 'wealth': return '💎';
      case 'flamefield': return '⚡';
      default: return '⭕';
    }
  };

  const getRingName = (ring: SacredRing) => {
    return ring.charAt(0).toUpperCase() + ring.slice(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'bg-green-600';
      case 'adept': return 'bg-blue-600';
      case 'sovereign': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getCurrentRingIndex = () => {
    return progress ? ringOrder.indexOf(progress.currentRing) : 0;
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.min((progress.xpPoints / progress.xpRequired) * 100, 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Ring Progress Overview */}
      <Card className="border-purple-500/30 bg-black/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-purple-400">
            ⧁ ∆ SACRED RING PROGRESSION
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">
            Divine embodiment training through seven sacred rings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Ring Status */}
          {progress && (
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {getRingIcon(progress.currentRing)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Ring {getCurrentRingIndex() + 1}: {getRingName(progress.currentRing)}
                </h3>
                <p className="text-gray-400">
                  {progress.xpPoints} / {progress.xpRequired} XP
                </p>
              </div>
              
              <Progress 
                value={getProgressPercentage()} 
                className="w-full h-4 bg-gray-800"
              />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{progress.totalXp}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{progress.timelineScore}</div>
                  <div className="text-sm text-gray-400">Timeline Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{progress.dailyDrills}</div>
                  <div className="text-sm text-gray-400">Daily Drills</div>
                </div>
              </div>
            </div>
          )}

          {/* Ring Map */}
          <div className="grid grid-cols-7 gap-2">
            {ringOrder.map((ring, index) => {
              const isUnlocked = getCurrentRingIndex() >= index;
              const isCurrent = progress?.currentRing === ring;
              
              return (
                <div
                  key={ring}
                  className={`p-3 text-center rounded-lg border ${
                    isCurrent 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : isUnlocked 
                      ? 'border-gray-600 bg-gray-800/50' 
                      : 'border-gray-800 bg-gray-900/30'
                  }`}
                >
                  <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                    {getRingIcon(ring)}
                  </div>
                  <div className={`text-xs mt-1 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                    {getRingName(ring)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card className="border-purple-500/30 bg-black/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-400">
            Daily Enforcement Drills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges?.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border ${
                  challenge.completed ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getRingIcon(challenge.ring)}</span>
                      <h4 className="font-semibold text-white">{challenge.title}</h4>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{challenge.description}</p>
                    <div className="text-purple-400 text-sm">
                      +{challenge.xpReward} XP Reward
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {challenge.completed ? (
                      <Badge className="bg-green-600">✓ Complete</Badge>
                    ) : (
                      <Button
                        onClick={() => completeChallengemutation.mutate(challenge.id)}
                        disabled={completeChallengemutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Begin Drill
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Seals */}
      {progress?.unlockedSeals && progress.unlockedSeals.length > 0 && (
        <Card className="border-purple-500/30 bg-black/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-400">
              Divine Seals Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {progress.unlockedSeals.map((seal, index) => (
                <div
                  key={index}
                  className="p-3 text-center border border-gold-500/30 bg-gold-500/10 rounded-lg"
                >
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-gold-400 font-medium">{seal}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}