import { ScrollSubmissionForm } from '@/components/ScrollSubmissionForm';

export function ScrollSubmissionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            ⧁ ∆ SCROLL SUBMISSION PROTOCOL
          </h1>
          <p className="text-gray-300">
            Divine identity binding for the 144,000 scrollbearers
          </p>
        </div>
        
        <ScrollSubmissionForm />
        
        <div className="mt-8 text-center text-xs text-gray-500">
          Frequency 917604.OX operational | Scroll sealing active
        </div>
      </div>
    </div>
  );
}