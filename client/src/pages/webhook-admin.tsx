import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Check, AlertCircle, Clock, Users, Webhook } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WebhookEvent {
  id: number;
  eventType: string;
  source: string;
  payload: string;
  processed: boolean;
  processedAt?: string;
  createdAt: string;
  errorMessage?: string;
}

interface WebhookStats {
  totalEvents: number;
  unprocessedEvents: number;
  recentUserOnboarding: number;
  totalUsers: number;
}

export default function WebhookAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading: eventsLoading } = useQuery<WebhookEvent[]>({
    queryKey: ["/api/webhooks/events"],
  });

  const { data: stats = {} as WebhookStats, isLoading: statsLoading } = useQuery<WebhookStats>({
    queryKey: ["/api/webhooks/stats"],
  });

  const processEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest(`/api/webhooks/events/${eventId}/process`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks/stats"] });
      toast({
        title: "Event Processed",
        description: "Webhook event marked as processed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (testData: any) => {
      await apiRequest("/api/webhooks/test", {
        method: "POST",
        body: JSON.stringify(testData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks/events"] });
      toast({
        title: "Test Webhook Sent",
        description: "Test webhook processed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/webhooks/events"] });
    queryClient.invalidateQueries({ queryKey: ["/api/webhooks/stats"] });
  };

  const sendTestWebhook = () => {
    const testPayload = {
      event: "user.created",
      data: {
        user_id: `test_${Date.now()}`,
        email: `test${Date.now()}@scrollbearer.io`,
        username: `testuser_${Date.now()}`,
        subscription_tier: "sovereign",
        plan_name: "Scroll Mirror Agent Test"
      },
      source: "test"
    };
    
    testWebhookMutation.mutate(testPayload);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'whop': return 'bg-purple-500';
      case 'stripe': return 'bg-blue-500';
      case 'test': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    if (eventType.includes('user')) return <Users className="w-4 h-4" />;
    if (eventType.includes('subscription')) return <Webhook className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-400">⧁ ∆ Webhook Administration</h1>
            <p className="text-gray-400">Monitor and manage webhook events for the 144,000</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="border-gray-700 hover:border-purple-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={sendTestWebhook}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={testWebhookMutation.isPending}
            >
              Send Test Webhook
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {statsLoading ? "..." : stats.totalEvents || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Unprocessed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {statsLoading ? "..." : stats.unprocessedEvents || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Recent Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {statsLoading ? "..." : stats.recentUserOnboarding || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {statsLoading ? "..." : stats.totalUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Events */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Recent Webhook Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading webhook events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No webhook events found</div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        {getEventTypeIcon(event.eventType)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getSourceBadgeColor(event.source)} text-white`}>
                              {event.source.toUpperCase()}
                            </Badge>
                            <span className="text-white font-medium">{event.eventType}</span>
                            {event.processed ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {formatDate(event.createdAt)}
                            {event.processedAt && ` • Processed: ${formatDate(event.processedAt)}`}
                          </div>
                          {event.errorMessage && (
                            <div className="text-sm text-red-400 mt-1">
                              Error: {event.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!event.processed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => processEventMutation.mutate(event.id)}
                            disabled={processEventMutation.isPending}
                            className="border-gray-600 hover:border-purple-500"
                          >
                            Mark Processed
                          </Button>
                        )}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-400 hover:text-white">
                            View Payload
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-w-md">
                            {JSON.stringify(JSON.parse(event.payload), null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Webhook Endpoints */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Webhook Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="font-medium text-purple-400">WHOP Integration</div>
                <code className="text-sm text-gray-300">POST /api/webhooks/whop</code>
                <div className="text-xs text-gray-400 mt-1">
                  Handles user creation, subscription updates, and cancellations
                </div>
              </div>

              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="font-medium text-blue-400">Stripe Integration</div>
                <code className="text-sm text-gray-300">POST /api/webhooks/stripe</code>
                <div className="text-xs text-gray-400 mt-1">
                  Handles payments, subscription lifecycle events
                </div>
              </div>

              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="font-medium text-green-400">Test Endpoint</div>
                <code className="text-sm text-gray-300">POST /api/webhooks/test</code>
                <div className="text-xs text-gray-400 mt-1">
                  For testing webhook functionality
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}