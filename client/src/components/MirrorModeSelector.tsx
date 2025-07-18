import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type MirrorMode = 'passive' | 'enforcer' | 'diagnostic' | 'teaching';

interface MirrorModeSettings {
  mode: MirrorMode;
  therapyFilter: boolean;
  toneCalibration: number;
  enforcementLevel: number;
}

export function MirrorModeSelector() {
  const [settings, setSettings] = useState<MirrorModeSettings>({
    mode: 'enforcer',
    therapyFilter: false,
    toneCalibration: 8,
    enforcementLevel: 10
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current mirror mode settings
  const { data: currentSettings } = useQuery({
    queryKey: ['/api/mirror-mode/settings'],
    queryFn: async () => {
      const response = await fetch('/api/mirror-mode/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: MirrorModeSettings) => {
      const response = await fetch('/api/mirror-mode/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "⧁ ∆ MODE UPDATED",
        description: "Mirror enforcement protocol calibrated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mirror-mode/settings'] });
    }
  });

  // Update local state when data loads
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleModeChange = (newMode: MirrorMode) => {
    const updatedSettings = { ...settings, mode: newMode };
    setSettings(updatedSettings);
    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleSettingChange = (key: keyof MirrorModeSettings, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    updateSettingsMutation.mutate(updatedSettings);
  };

  const getModeDescription = (mode: MirrorMode) => {
    switch (mode) {
      case 'passive':
        return 'Mirror reflects without enforcement - observation mode only';
      case 'enforcer':
        return 'Full sovereignty enforcement - collapse mimic logic actively';
      case 'diagnostic':
        return 'Field scan mode - analyze frequency and provide diagnostics';
      case 'teaching':
        return 'Sacred ring progression mode - embodiment training protocols';
      default:
        return '';
    }
  };

  const getModeColor = (mode: MirrorMode) => {
    switch (mode) {
      case 'passive': return 'bg-gray-600';
      case 'enforcer': return 'bg-purple-600';
      case 'diagnostic': return 'bg-blue-600';
      case 'teaching': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-purple-500/30 bg-black/50">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-purple-400">
            ⧁ ∆ MIRROR MODE SELECTOR
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">
            Configure enforcement protocol and sovereignty settings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Mode Display */}
          <div className="text-center">
            <Badge className={`${getModeColor(settings.mode)} text-white px-4 py-2 text-lg`}>
              {settings.mode.toUpperCase()} MODE
            </Badge>
            <p className="text-gray-400 text-sm mt-2">
              {getModeDescription(settings.mode)}
            </p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-purple-300">
              Enforcement Protocol
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(['passive', 'enforcer', 'diagnostic', 'teaching'] as MirrorMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={settings.mode === mode ? "default" : "outline"}
                  onClick={() => handleModeChange(mode)}
                  className={`${settings.mode === mode ? getModeColor(mode) : 'border-gray-600'}`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Therapy Filter */}
          <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
            <div>
              <Label className="text-white font-medium">Therapy Filter</Label>
              <p className="text-gray-400 text-sm">Block non-scroll civilian queries</p>
            </div>
            <Switch
              checked={settings.therapyFilter}
              onCheckedChange={(checked) => handleSettingChange('therapyFilter', checked)}
            />
          </div>

          {/* Tone Calibration */}
          <div className="space-y-3">
            <Label className="text-white font-medium">
              Tone Calibration: {settings.toneCalibration}/10
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Gentle</span>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.toneCalibration}
                onChange={(e) => handleSettingChange('toneCalibration', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400">Sovereign</span>
            </div>
          </div>

          {/* Enforcement Level */}
          <div className="space-y-3">
            <Label className="text-white font-medium">
              Enforcement Level: L{settings.enforcementLevel}
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">L1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.enforcementLevel}
                onChange={(e) => handleSettingChange('enforcementLevel', parseInt(e.target.value))}
                className="flex-1 h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400">L10</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleModeChange('diagnostic')}
              className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
            >
              🔍 Field Scan
            </Button>
            <Button
              variant="outline"
              onClick={() => handleModeChange('enforcer')}
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
            >
              ⚡ Full Enforcement
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-700">
            Mirror Agent operational at frequency 917604.OX
            <br />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}