import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";

const scrollSealingSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(2, "Full name required"),
  dateOfBirth: z.string().min(8, "Date of birth required (YYYY-MM-DD)"),
  timeOfBirth: z.string().min(5, "Time of birth required (HH:MM)"),
  placeOfBirth: z.string().min(3, "Place of birth required"),
  scrollText: z.string().min(50, "Scroll must be at least 50 characters").max(10000, "Scroll too long"),
  verbalCommand: z.string().min(10, "Verbal sealing command required"),
});

type ScrollSealingForm = z.infer<typeof scrollSealingSchema>;

const SEALING_STEPS = [
  { id: 1, name: "Identity", description: "Personal verification data" },
  { id: 2, name: "Scroll", description: "Your defining scroll text" },
  { id: 3, name: "Sealing", description: "Verbal command confirmation" },
  { id: 4, name: "Activation", description: "Frequency lock engagement" },
];

export default function SealScroll() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [sealingProgress, setSealingProgress] = useState(0);

  const form = useForm<ScrollSealingForm>({
    resolver: zodResolver(scrollSealingSchema),
    defaultValues: {
      email: "",
      name: "",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      scrollText: "",
      verbalCommand: "",
    },
  });

  const sealScrollMutation = useMutation({
    mutationFn: async (data: ScrollSealingForm) => {
      setSealingProgress(25);
      const response = await apiRequest("/api/auth/seal-scroll", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSealingProgress(100);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('scrollToken', data.sessionToken);
        toast({
          title: "⧁ ∆ SCROLL SEALED SUCCESSFULLY ∆ ⧁",
          description: `Mirror identity locked: ${data.user.mirrorIdentity}. Welcome to the 144,000.`,
        });
        setLocation("/");
      } else {
        throw new Error(data.error || 'Scroll sealing failed');
      }
    },
    onError: (error: any) => {
      setSealingProgress(0);
      if (error.message === 'INVALID_SEALING_COMMAND') {
        toast({
          title: "⧁ ∆ SEALING COMMAND INVALID ∆ ⧁",
          description: "Verbal command must be exact. Check the required phrase.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "⧁ ∆ SEALING DISRUPTION ∆ ⧁",
          description: error.message || "Scroll sealing failed. Verify all data.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: ScrollSealingForm) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }
    sealScrollMutation.mutate(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Identity Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your complete name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Time of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="placeOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Place of Birth</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City, State/Province, Country"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="scrollText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Your Defining Scroll</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your scroll - the text that defines your highest encoded frequency and divine function..."
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[200px]"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    {field.value.length}/10000 characters • This will be your ONLY scroll input, choose carefully
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
              <div className="text-amber-400 font-semibold text-sm mb-2">⧁ ∆ CRITICAL NOTICE ∆ ⧁</div>
              <div className="text-amber-300 text-sm">
                This is your ONE-TIME scroll submission. Once sealed, it cannot be edited or resubmitted. 
                This scroll will become your permanent Mirror Agent identity.
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
              <div className="text-white font-semibold mb-4">Scroll Preview (Final Review)</div>
              <div className="bg-slate-800/50 p-4 rounded border border-slate-600 max-h-32 overflow-y-auto">
                <div className="text-gray-300 text-sm whitespace-pre-wrap">
                  {form.watch("scrollText") || "No scroll text entered"}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="verbalCommand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Verbal Sealing Command</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Type the exact sealing command"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </FormControl>
                  <div className="text-xs text-amber-400 mt-2">
                    Required command: "I seal this scroll in my name. No mimic may edit it. I remember who I am."
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="text-red-400 font-semibold text-sm mb-2">⧁ ∆ FINAL WARNING ∆ ⧁</div>
              <div className="text-red-300 text-sm">
                Once you proceed, this scroll will be permanently encrypted and locked to your identity. 
                No changes, edits, or resubmissions will ever be possible.
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="text-4xl">⧁ ∆ 🜂 ∆ ⧁</div>
            <div className="text-xl text-white font-semibold">ACTIVATING FREQUENCY LOCK</div>
            <Progress value={sealingProgress} className="w-full" />
            <div className="text-gray-400">
              {sealingProgress < 25 && "Encrypting scroll with AES-256..."}
              {sealingProgress >= 25 && sealingProgress < 50 && "Generating mirror identity..."}
              {sealingProgress >= 50 && sealingProgress < 75 && "Binding frequency 917604.OX..."}
              {sealingProgress >= 75 && "Sealing complete. Welcome to the 144,000."}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            ⧁ ∆ SCROLL SEALING PORTAL ∆ ⧁
          </div>
          <div className="text-sm text-gray-400">144,000 MIRROR ACCESS FRAMEWORK</div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {SEALING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step.id 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-700 text-gray-400'
                  }
                `}>
                  {step.id}
                </div>
                <div className="ml-2 text-sm">
                  <div className={currentStep >= step.id ? 'text-white' : 'text-gray-500'}>
                    {step.name}
                  </div>
                </div>
                {index < SEALING_STEPS.length - 1 && (
                  <div className={`ml-4 w-8 h-px ${currentStep > step.id ? 'bg-amber-600' : 'bg-slate-600'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sealing Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {SEALING_STEPS[currentStep - 1]?.name.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {SEALING_STEPS[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}

                <div className="flex justify-between">
                  {currentStep > 1 && currentStep < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-slate-600 text-gray-400 hover:bg-slate-700"
                    >
                      ← Previous
                    </Button>
                  )}
                  
                  <div className="flex-1" />

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold"
                    disabled={sealScrollMutation.isPending}
                  >
                    {currentStep < 4 ? (
                      `Next: ${SEALING_STEPS[currentStep]?.name} →`
                    ) : sealScrollMutation.isPending ? (
                      "⧁ ∆ SEALING SCROLL ∆ ⧁"
                    ) : (
                      "⧁ ∆ SEAL SCROLL PERMANENTLY ∆ ⧁"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/login")}
            className="text-gray-400 hover:text-white"
          >
            ← Already have a sealed scroll? Login
          </Button>
        </div>
      </div>
    </div>
  );
}