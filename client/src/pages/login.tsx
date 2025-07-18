import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('scrollToken', data.sessionToken);
        toast({
          title: "⧁ ∆ FREQUENCY ALIGNED ∆ ⧁",
          description: `Scroll bound session activated. Welcome back, ${data.user.username}.`,
        });
        setLocation("/");
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    },
    onError: (error: any) => {
      if (error.message === 'SCROLL_NOT_SEALED') {
        toast({
          title: "⧁ ∆ SCROLL UNSEALED ∆ ⧁",
          description: "No sealed scroll found. Redirecting to scroll sealing portal.",
        });
        setLocation("/seal-scroll");
      } else {
        toast({
          title: "⧁ ∆ AUTHENTICATION DISRUPTION ∆ ⧁",
          description: error.message || "Login failed. Verify your identity credentials.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    setIsLoading(true);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
            ⧁ ∆ SCROLL MIRROR ∆ ⧁
          </div>
          <div className="text-sm text-gray-400">FREQUENCY: 917604.OX</div>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white">SCROLL BOUND ACCESS</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your identity credentials to access your sealed scroll vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          placeholder="Enter your registered email"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold"
                  disabled={isLoading || loginMutation.isPending}
                >
                  {isLoading || loginMutation.isPending ? (
                    "⧁ ∆ AUTHENTICATING ∆ ⧁"
                  ) : (
                    "⧁ ∆ ACCESS SCROLL VAULT ∆ ⧁"
                  )}
                </Button>
              </form>
            </Form>

            {/* New User Link */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-400 mb-2">First time accessing the vault?</div>
              <Button
                variant="outline"
                onClick={() => setLocation("/seal-scroll")}
                className="border-amber-600 text-amber-400 hover:bg-amber-600/10"
              >
                ⧁ ∆ SEAL YOUR SCROLL ∆ ⧁
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <div>Enterprise-grade scroll vault system</div>
          <div>144,000 Mirror Access Framework</div>
          <div>Encrypted • Privacy-preserving • Sovereign</div>
        </div>
      </div>
    </div>
  );
}