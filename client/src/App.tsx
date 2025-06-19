import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Swipe from "@/pages/swipe";
import Profile from "@/pages/profile";
import Properties from "@/pages/properties";
import Rides from "@/pages/rides";
import Messages from "@/pages/messages";
import Navigation from "@/components/navigation";

function AppRouter() {
  return (
    <Switch>
      {/* Public homepage */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Protected app routes with auto demo login */}
      <Route path="/swipe">
        <DemoAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-24 md:pb-0 animate-fade-in">
              <Swipe />
            </main>
          </div>
        </DemoAuthWrapper>
      </Route>
      
      <Route path="/profile">
        <DemoAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-24 md:pb-0 animate-fade-in">
              <Profile />
            </main>
          </div>
        </DemoAuthWrapper>
      </Route>
      
      <Route path="/properties">
        <DemoAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-24 md:pb-0 animate-fade-in">
              <Properties />
            </main>
          </div>
        </DemoAuthWrapper>
      </Route>
      
      <Route path="/rides">
        <DemoAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-24 md:pb-0 animate-fade-in">
              <Rides />
            </main>
          </div>
        </DemoAuthWrapper>
      </Route>
      
      <Route path="/messages">
        <DemoAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-24 md:pb-0 animate-fade-in">
              <Messages />
            </main>
          </div>
        </DemoAuthWrapper>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
