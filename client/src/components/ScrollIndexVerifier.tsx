import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Shield, Flame, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ScrollVerification {
  name: string;
  verified: boolean;
  scroll_role: string;
  flame_signature: boolean | string;
  timeline_conflict: string;
  risk_level: string;
  decree: string;
  status: 'INDEXED' | 'UNINDEXED';
}

interface ScrollIndexResult {
  scan_complete: boolean;
  names_found: number;
  indexed_entities?: number;
  high_risk_entities?: number;
  verifications: ScrollVerification[];
  summary: string;
  formatted_output?: string;
  frequency?: string;
  verification_timestamp?: string;
}

export default function ScrollIndexVerifier() {
  const [scrollText, setScrollText] = useState("");
  const [entityName, setEntityName] = useState("");
  const [verificationResult, setVerificationResult] = useState<ScrollIndexResult | null>(null);
  const { toast } = useToast();

  const verifyScrollMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest("/api/verify-scroll", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      toast({
        title: "Scroll Index Scan Complete",
        description: `${data.names_found} entities found, ${data.indexed_entities || 0} verified`,
      });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const verifyEntityMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest("/api/verify-entity", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: (data) => {
      if (data.status === "NO_ENTITIES_FOUND") {
        toast({
          title: "No Entities Found",
          description: "No verifiable entities detected in input",
          variant: "destructive",
        });
        return;
      }
      
      setVerificationResult({
        scan_complete: true,
        names_found: 1,
        indexed_entities: data.verified ? 1 : 0,
        high_risk_entities: ['High', 'Maximum'].includes(data.risk_level) ? 1 : 0,
        verifications: [data],
        summary: `Entity "${data.name}" verified`,
        formatted_output: data.formatted_output,
        frequency: data.frequency,
        verification_timestamp: data.verification_timestamp
      });
      
      toast({
        title: "Entity Verified",
        description: `${data.name}: ${data.scroll_role}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "None": return "bg-green-500";
      case "Low": return "bg-yellow-500";
      case "Medium": return "bg-orange-500";
      case "High": return "bg-red-500";
      case "Maximum": return "bg-red-900";
      default: return "bg-gray-500";
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "None": return <CheckCircle className="w-4 h-4" />;
      case "Low": return <AlertTriangle className="w-4 h-4" />;
      case "Medium": return <AlertTriangle className="w-4 h-4" />;
      case "High": return <XCircle className="w-4 h-4" />;
      case "Maximum": return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-900 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            MODULE 4: SCROLL INDEX VERIFIER
          </CardTitle>
          <p className="text-slate-300 text-sm">
            Frequency: 917604.OX | Divine intelligence index for proper noun verification
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scroll Text Verification */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Scroll Text Verification</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Enter scroll text containing names, entities, or titles to verify..."
                value={scrollText}
                onChange={(e) => setScrollText(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
              />
              <Button
                onClick={() => verifyScrollMutation.mutate(scrollText)}
                disabled={verifyScrollMutation.isPending || !scrollText.trim()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {verifyScrollMutation.isPending ? "Scanning..." : "Verify Scroll Text"}
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Single Entity Verification */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Single Entity Verification</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter specific name or entity..."
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Button
                onClick={() => verifyEntityMutation.mutate(entityName)}
                disabled={verifyEntityMutation.isPending || !entityName.trim()}
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
              >
                <Shield className="w-4 h-4 mr-2" />
                {verifyEntityMutation.isPending ? "Verifying..." : "Verify Entity"}
              </Button>
            </div>
          </div>

          {/* Verification Results */}
          {verificationResult && (
            <div className="space-y-4">
              <Separator className="bg-slate-700" />
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Verification Results
                </h3>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <div className="text-yellow-400 text-sm">Names Found</div>
                    <div className="text-white text-xl font-bold">{verificationResult.names_found}</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <div className="text-green-400 text-sm">Indexed</div>
                    <div className="text-white text-xl font-bold">{verificationResult.indexed_entities || 0}</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <div className="text-red-400 text-sm">High Risk</div>
                    <div className="text-white text-xl font-bold">{verificationResult.high_risk_entities || 0}</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <div className="text-blue-400 text-sm">Frequency</div>
                    <div className="text-white text-sm font-mono">{verificationResult.frequency || "917604.OX"}</div>
                  </div>
                </div>

                {/* Entity Details */}
                <div className="space-y-3">
                  {verificationResult.verifications.map((verification, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="text-white font-semibold text-lg">{verification.name}</h4>
                            {verification.flame_signature && (
                              <Flame className="w-5 h-5 text-orange-400" />
                            )}
                            <Badge 
                              variant="outline" 
                              className={`${getRiskLevelColor(verification.risk_level)} text-white border-0`}
                            >
                              <span className="flex items-center gap-1">
                                {getRiskLevelIcon(verification.risk_level)}
                                {verification.risk_level}
                              </span>
                            </Badge>
                          </div>
                          <Badge 
                            variant={verification.status === "INDEXED" ? "default" : "destructive"}
                            className={verification.status === "INDEXED" ? "bg-green-600" : "bg-red-600"}
                          >
                            {verification.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Scroll Role:</span>
                            <span className="text-white ml-2">{verification.scroll_role}</span>
                          </div>
                          
                          {verification.timeline_conflict !== "None" && verification.timeline_conflict !== "UNKNOWN" && (
                            <div>
                              <span className="text-slate-400">Timeline Conflict:</span>
                              <span className="text-red-400 ml-2">{verification.timeline_conflict}</span>
                            </div>
                          )}
                          
                          <div className="bg-slate-700 p-3 rounded mt-3">
                            <span className="text-slate-400 text-xs uppercase tracking-wide">Divine Decree:</span>
                            <p className="text-yellow-300 mt-1">{verification.decree}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-slate-800 p-4 rounded border border-slate-600 mt-4">
                  <h4 className="text-white font-semibold mb-2">Scan Summary</h4>
                  <p className="text-slate-300">{verificationResult.summary}</p>
                  {verificationResult.verification_timestamp && (
                    <p className="text-slate-500 text-xs mt-2">
                      Verified: {new Date(verificationResult.verification_timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}