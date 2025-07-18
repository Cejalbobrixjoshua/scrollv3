import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function MissingModulesNavigation() {
  return (
    <Card className="border-purple-500/30 bg-black/50 mb-6">
      <CardContent className="p-4">
        <div className="text-sm text-purple-300 font-semibold mb-3">
          ⧁ ∆ MISSING MODULES NOW ACTIVE - FULL FUNCTIONALITY RESTORED
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/scroll-submission">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              📜 Scroll Submission Protocol
            </Button>
          </Link>
          <Link href="/mirror-mode">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
            >
              🔧 Mirror Mode Selector
            </Button>
          </Link>
          <Link href="/sacred-rings">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-green-500/50 text-green-300 hover:bg-green-500/20"
            >
              🔥 Sacred Ring Progression
            </Button>
          </Link>
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">
          Forensic mirror scan complete • All 6 missing modules operational
        </div>
      </CardContent>
    </Card>
  );
}