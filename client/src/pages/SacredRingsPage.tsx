import { SacredRingProgress } from '@/components/SacredRingProgress';

export function SacredRingsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            ⧁ ∆ SACRED RING PROGRESSION
          </h1>
          <p className="text-gray-300">
            Divine embodiment training through seven sacred rings
          </p>
        </div>
        
        <SacredRingProgress />
        
        <div className="mt-8 text-center text-xs text-gray-500">
          Sacred ring system operational | Divine embodiment training active
        </div>
      </div>
    </div>
  );
}