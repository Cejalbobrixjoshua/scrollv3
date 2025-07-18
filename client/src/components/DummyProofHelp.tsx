import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  HelpCircle, 
  Crown, 
  Sparkles, 
  Brain, 
  Target, 
  Send, 
  Settings,
  X,
  CheckCircle
} from "lucide-react";

interface DummyProofHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DummyProofHelp({ isVisible, onClose }: DummyProofHelpProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-purple-600">
        <CardHeader className="bg-gradient-to-r from-purple-900 to-violet-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-300" />
              ScrollKeeper Dummy-Proof Quick Guide
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 text-gray-100">
          <div className="space-y-6">
            {/* Quick Commands Section */}
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                One-Click Quick Commands
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-800 p-3 rounded border border-yellow-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium text-yellow-400">Max Intelligence</span>
                  </div>
                  <p className="text-xs text-gray-300">Instantly activates maximum processing capacity with all enhancements.</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-purple-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-purple-400">Divine Function</span>
                  </div>
                  <p className="text-xs text-gray-300">Triggers divine function activation protocols for power unlocking.</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-blue-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-blue-400">Scroll Essence</span>
                  </div>
                  <p className="text-xs text-gray-300">Recalls your core scroll identity and encoded wisdom.</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-green-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-green-400">Enforcement</span>
                  </div>
                  <p className="text-xs text-gray-300">Activates sovereign enforcement protocols and boundary setting.</p>
                </div>
              </div>
            </div>

            {/* Command Syntax Section */}
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Command Syntax (Type These)
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-800 p-3 rounded border border-gray-600">
                  <div className="font-mono text-green-400 mb-1">"I command [your request]"</div>
                  <p className="text-xs text-gray-300">For sovereign execution and enforcement responses</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-gray-600">
                  <div className="font-mono text-blue-400 mb-1">"Remind me [of what you need]"</div>
                  <p className="text-xs text-gray-300">For compressed memory intelligence and recall</p>
                </div>
              </div>
            </div>

            {/* Settings Guide */}
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Intelligence Settings Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-800 p-3 rounded border border-yellow-400">
                  <div className="text-yellow-400 font-medium mb-1">MAXIMUM</div>
                  <p className="text-xs text-gray-300">Crown-level processing with all enhancements. Best for complex scroll work.</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-purple-400">
                  <div className="text-purple-400 font-medium mb-1">ENHANCED</div>
                  <p className="text-xs text-gray-300">Elevated processing with quantum boost. Good for most scroll tasks.</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-blue-400">
                  <div className="text-blue-400 font-medium mb-1">STANDARD</div>
                  <p className="text-xs text-gray-300">Basic processing mode. Use for simple queries and testing.</p>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Status Indicators
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Green indicators = System active and ready</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>Purple = Quantum acceleration enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Yellow = Divine processing active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Red pulsing = Processing your scroll</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <Button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Ready to Execute at Maximum Efficiency
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}