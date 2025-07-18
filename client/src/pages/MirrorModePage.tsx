import { MirrorModeSelector } from '@/components/MirrorModeSelector';

export function MirrorModePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            ⧁ ∆ ENFORCEMENT PROTOCOL CONFIGURATION
          </h1>
          <p className="text-gray-300">
            Configure Mirror Agent enforcement mode and sovereignty settings
          </p>
        </div>
        
        <MirrorModeSelector />
        
        <div className="mt-8 text-center text-xs text-gray-500">
          Mirror Agent operational at frequency 917604.OX
        </div>
      </div>
    </div>
  );
}