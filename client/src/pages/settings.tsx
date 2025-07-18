import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Shield, 
  Palette, 
  Volume2, 
  Zap, 
  Monitor,
  Smartphone,
  Save,
  RotateCcw
} from 'lucide-react';

interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  defaultModel: string;
  autoSave: boolean;
  notifications: boolean;
  soundEffects: boolean;
  enforcementLevel: number;
  frequencyMonitoring: boolean;
  compactMode: boolean;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    defaultModel: 'gpt-4o-mini',
    autoSave: true,
    notifications: true,
    soundEffects: false,
    enforcementLevel: 8,
    frequencyMonitoring: true,
    compactMode: false,
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  });

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "⧁ ∆ SETTINGS UPDATED",
        description: "Your preferences have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
    onError: (error: any) => {
      toast({
        title: "UPDATE FAILED",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleReset = () => {
    setSettings({
      theme: 'dark',
      defaultModel: 'gpt-4o-mini',
      autoSave: true,
      notifications: true,
      soundEffects: false,
      enforcementLevel: 8,
      frequencyMonitoring: true,
      compactMode: false,
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mr-4 text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mirror Agent
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-purple-400 flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              Settings & Preferences
            </h1>
            <p className="text-gray-400 mt-1">
              Configure your Scroll Mirror Agent experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Preferences */}
          <Card className="bg-gray-900 border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <User className="w-5 h-5 mr-2" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Default AI Model
                </label>
                <Select value={settings.defaultModel} onValueChange={(value) => 
                  setSettings({ ...settings, defaultModel: value })
                }>
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">Sovereign Mirror (Premium)</SelectItem>
                    <SelectItem value="gpt-4o-mini">Lightning Mirror (Fastest)</SelectItem>
                    <SelectItem value="gpt-4-turbo">Quantum Mirror (Advanced)</SelectItem>
                    <SelectItem value="o1-preview">Oracle Mirror (Reasoning)</SelectItem>
                    <SelectItem value="o1-mini">Mystic Mirror (Compact)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Enforcement Level: {settings.enforcementLevel}/10
                </label>
                <Slider
                  value={[settings.enforcementLevel]}
                  onValueChange={(value) => 
                    setSettings({ ...settings, enforcementLevel: value[0] })
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher levels increase sovereign command enforcement
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Auto-save sessions</span>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, autoSave: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Enable notifications</span>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Sound effects</span>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, soundEffects: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Frequency monitoring</span>
                  <Switch
                    checked={settings.frequencyMonitoring}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, frequencyMonitoring: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-gray-900 border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Theme
                </label>
                <Select value={settings.theme} onValueChange={(value) => 
                  setSettings({ ...settings, theme: value as any })
                }>
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Font Size
                </label>
                <Select 
                  value={settings.accessibility.fontSize} 
                  onValueChange={(value) => 
                    setSettings({ 
                      ...settings, 
                      accessibility: { 
                        ...settings.accessibility, 
                        fontSize: value as any 
                      } 
                    })
                  }
                >
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Compact mode</span>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, compactMode: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">High contrast</span>
                  <Switch
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => 
                      setSettings({ 
                        ...settings, 
                        accessibility: { 
                          ...settings.accessibility, 
                          highContrast: checked 
                        } 
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Reduced motion</span>
                  <Switch
                    checked={settings.accessibility.reducedMotion}
                    onCheckedChange={(checked) => 
                      setSettings({ 
                        ...settings, 
                        accessibility: { 
                          ...settings.accessibility, 
                          reducedMotion: checked 
                        } 
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="bg-gray-900 border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-900/20 border border-green-600/30 rounded">
                <h4 className="text-green-400 font-semibold text-sm mb-2">Data Protection Active</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>✓ All sessions encrypted with AES-256</p>
                  <p>✓ Local storage only - no cloud data</p>
                  <p>✓ Frequency-bound encryption keys</p>
                  <p>✓ Auto-cleanup after 30 days</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-red-600/50 text-red-400 hover:bg-red-900/20"
                >
                  Clear All Local Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600/50 text-blue-400 hover:bg-blue-900/20"
                >
                  Export Session Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-gray-900 border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Username</label>
                    <p className="text-white font-mono">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Mirror Identity</label>
                    <p className="text-purple-400 font-mono text-sm">
                      {user.mirrorIdentity || 'Not activated'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Subscription</label>
                    <p className="text-green-400 font-semibold">$88/month Active</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Frequency Lock</label>
                    <p className="text-cyan-400 font-mono">917604.OX</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <div className="space-x-3">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-gray-300">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}