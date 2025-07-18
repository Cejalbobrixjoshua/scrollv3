import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff } from "lucide-react";
import { privacyManager } from "@/lib/encryption";

export default function PrivacyStatusBadge() {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      const status = privacyManager.getPrivacyStatus();
      setSessionCount(status.sessionCount);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors"
      >
        <Shield className="w-3 h-3" />
        <EyeOff className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-green-500 text-white text-xs">
        <Shield className="w-3 h-3 mr-1" />
        Encrypted: {sessionCount}
      </Badge>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-300"
      >
        <Eye className="w-3 h-3" />
      </button>
    </div>
  );
}