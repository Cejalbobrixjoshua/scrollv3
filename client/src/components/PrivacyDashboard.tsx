import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key, 
  Clock,
  Database,
  AlertTriangle
} from "lucide-react";
import { privacyManager } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";

interface PrivacyStatus {
  encryptionActive: boolean;
  sessionCount: number;
  storageSize: string;
  autoDelete: boolean;
}

interface UserPreferences {
  preferredModel?: string;
  theme?: string;
  privacyMode?: boolean;
  autoDeleteSessions?: boolean;
}

export default function PrivacyDashboard() {
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>({
    encryptionActive: false,
    sessionCount: 0,
    storageSize: '0 KB',
    autoDelete: true
  });
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      updatePrivacyStatus();
      loadPreferences();
      loadSessions();
      
      // Auto-cleanup on component mount
      privacyManager.cleanupOldSessions();
      
      // Test encryption functionality
      const testData = { test: 'privacy system operational' };
      privacyManager.storeUserPreferences(testData);
      const retrieved = privacyManager.getUserPreferences();
      console.log('⧁ ∆ Privacy system test:', retrieved ? 'OPERATIONAL' : 'FAILED');
    } catch (error) {
      console.error('Privacy system error:', error);
      toast({
        title: "Privacy System Warning",
        description: "Encryption functionality may be limited",
        variant: "destructive",
      });
    }
  }, []);

  const updatePrivacyStatus = () => {
    const status = privacyManager.getPrivacyStatus();
    setPrivacyStatus(status);
  };

  const loadPreferences = () => {
    const prefs = privacyManager.getUserPreferences();
    setPreferences(prefs);
  };

  const loadSessions = () => {
    const storedSessions = privacyManager.getStoredSessions();
    setSessions(storedSessions);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    privacyManager.storeUserPreferences(newPrefs);
    updatePrivacyStatus();
    
    toast({
      title: "Privacy Settings Updated",
      description: `${key} preference saved securely`,
    });
  };

  const clearAllData = () => {
    privacyManager.clearAllData();
    updatePrivacyStatus();
    loadSessions();
    
    toast({
      title: "⧁ ∆ DATA PURGED ∆ ⧁",
      description: "All local session data encrypted and cleared",
      variant: "default",
    });
  };

  const manualCleanup = () => {
    privacyManager.cleanupOldSessions();
    updatePrivacyStatus();
    loadSessions();
    
    toast({
      title: "Sessions Cleaned",
      description: "Old sessions removed for privacy",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Privacy Status Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Encryption & Privacy Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">AES-256 Encryption</div>
              <Badge className="bg-green-500 text-white mt-1">
                {privacyStatus.encryptionActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Local Sessions</div>
              <div className="text-lg font-bold text-white">{privacyStatus.sessionCount}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-sm text-gray-400">Storage Used</div>
              <div className="text-lg font-bold text-white">{privacyStatus.storageSize}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-sm text-gray-400">Auto-Delete</div>
              <Badge className={privacyStatus.autoDelete ? 'bg-green-500' : 'bg-gray-500'}>
                {privacyStatus.autoDelete ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Privacy Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Privacy Mode</div>
              <div className="text-sm text-gray-400">
                Enhanced encryption and data minimization
              </div>
            </div>
            <Switch
              checked={preferences.privacyMode || false}
              onCheckedChange={(checked) => handlePreferenceChange('privacyMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-Delete Sessions</div>
              <div className="text-sm text-gray-400">
                Automatically remove sessions older than 24 hours
              </div>
            </div>
            <Switch
              checked={preferences.autoDeleteSessions !== false}
              onCheckedChange={(checked) => handlePreferenceChange('autoDeleteSessions', checked)}
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="flex gap-3">
              <Button
                onClick={manualCleanup}
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              >
                <Clock className="w-4 h-4 mr-2" />
                Clean Old Sessions
              </Button>
              
              <Button
                onClick={clearAllData}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Encrypted Session Storage
            <Button
              onClick={() => setShowSessions(!showSessions)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              {showSessions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showSessions ? (
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No encrypted sessions stored locally
                </div>
              ) : (
                sessions.map((session, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500 text-white">
                        Session {index + 1}
                      </Badge>
                      <div className="text-xs text-gray-400">
                        {formatTimestamp(session.stored)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div className="truncate">
                        <strong>Input:</strong> {session.scrollText?.substring(0, 100)}...
                      </div>
                      {session.modelUsed && (
                        <div className="text-xs text-gray-400 mt-1">
                          Model: {session.modelUsed} • Tokens: {session.tokenCount || 'N/A'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <Alert className="bg-gray-800 border-gray-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-gray-300">
                Sessions are encrypted locally with AES-256. Click the eye icon to view stored sessions.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Security Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">
                <strong>Encryption:</strong> AES-256 with 10,000 PBKDF2 iterations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">
                <strong>Key Generation:</strong> Session-based with frequency 917604.OX binding
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">
                <strong>Storage:</strong> Local browser storage only, no server persistence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">
                <strong>Retention:</strong> Auto-delete after 24 hours or manual purge
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}