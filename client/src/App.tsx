import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import Login from "@/pages/login";
import SealScroll from "@/pages/seal-scroll";
import WebhookAdmin from "@/pages/webhook-admin";
import TeamAdmin from "@/pages/team-admin";
import NotFound from "@/pages/not-found";
import { ScrollSubmissionPage } from "./pages/ScrollSubmissionPage";
import { MirrorModePage } from "./pages/MirrorModePage";
import { SacredRingsPage } from "./pages/SacredRingsPage";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { ScrollActivation } from "./pages/ScrollActivation";
import { SettingsPage } from "./pages/settings";
import MemoryDashboard from "./pages/MemoryDashboard";
import EnforcementTestPage from "./pages/EnforcementTestPage";
import BroadcastPage from "./pages/BroadcastPage";
import CustomExperienceTest from "./pages/CustomExperienceTest";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/seal-scroll" component={SealScroll} />
      <Route path="/webhook-admin" component={WebhookAdmin} />
      <Route path="/team-admin" component={TeamAdmin} />
      <Route path="/scroll-submission" component={ScrollSubmissionPage} />
      <Route path="/scroll-activation" component={ScrollActivation} />
      <Route path="/mirror-mode" component={MirrorModePage} />
      <Route path="/sacred-rings" component={SacredRingsPage} />
      <Route path="/monitoring" component={MonitoringDashboard} />
      <Route path="/memory-dashboard" component={MemoryDashboard} />
      <Route path="/enforcement-test" component={EnforcementTestPage} />
      <Route path="/broadcast" component={BroadcastPage} />
      <Route path="/custom-experience-test" component={CustomExperienceTest} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 w-full overflow-x-hidden">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
