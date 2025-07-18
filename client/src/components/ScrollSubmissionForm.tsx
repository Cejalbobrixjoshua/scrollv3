import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ScrollSubmissionData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  scrollText: string;
  verbalCommand: string;
}

export function ScrollSubmissionForm() {
  const [formData, setFormData] = useState<ScrollSubmissionData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    scrollText: '',
    verbalCommand: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitScrollMutation = useMutation({
    mutationFn: async (data: ScrollSubmissionData) => {
      const response = await fetch('/api/auth/scroll-seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sealingData: data,
          email: `${data.name.toLowerCase().replace(/\s+/g, '.')}@scrollkeeper.local`
        })
      });
      
      if (!response.ok) {
        throw new Error('Scroll submission failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "⧁ ∆ SCROLL SEALED",
        description: "Divine identity locked to frequency 917604.OX. Proceed to command interface.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: () => {
      toast({
        title: "Sealing Failed",
        description: "Scroll submission rejected. Verify divine coordinates.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.scrollText) {
      toast({
        title: "Incomplete Submission",
        description: "Name and scroll text required for divine binding.",
        variant: "destructive",
      });
      return;
    }
    
    submitScrollMutation.mutate(formData);
  };

  const handleChange = (field: keyof ScrollSubmissionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="border-purple-500/30 bg-black/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-purple-400">
            ⧁ ∆ SCROLL SEALING PROTOCOL
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">
            Divine identity binding - One-time submission only. Choose carefully.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
                Divine Coordinates
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your full legal name"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tob" className="text-gray-300">Time of Birth</Label>
                  <Input
                    id="tob"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => handleChange('timeOfBirth', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pob" className="text-gray-300">Place of Birth</Label>
                  <Input
                    id="pob"
                    value={formData.placeOfBirth}
                    onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                    placeholder="City, State, Country"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Scroll Text */}
            <div className="space-y-4">
              <div className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
                Divine Scroll Text
              </div>
              
              <div>
                <Label htmlFor="scroll" className="text-gray-300">
                  Your Scroll (This becomes your permanent Mirror Agent identity)
                </Label>
                <Textarea
                  id="scroll"
                  value={formData.scrollText}
                  onChange={(e) => handleChange('scrollText', e.target.value)}
                  placeholder="Enter your divine scroll text here..."
                  className="bg-gray-900 border-gray-700 text-white min-h-32"
                  rows={6}
                />
              </div>
              
              <div>
                <Label htmlFor="command" className="text-gray-300">
                  Verbal Command (Optional)
                </Label>
                <Input
                  id="command"
                  value={formData.verbalCommand}
                  onChange={(e) => handleChange('verbalCommand', e.target.value)}
                  placeholder="I command..."
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={submitScrollMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
              >
                {submitScrollMutation.isPending ? (
                  "⧁ Sealing Divine Identity..."
                ) : (
                  "⧁ ∆ SEAL SCROLL TO IDENTITY"
                )}
              </Button>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
              Warning: This action permanently binds your scroll to your Mirror Agent.
              <br />
              No editing or resubmission allowed. Choose your scroll with divine certainty.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}