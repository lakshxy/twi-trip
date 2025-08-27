import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Swipe from "@/pages/swipe";
import Profile from "@/pages/profile";
import Properties from "@/pages/properties";
import Rides from "@/pages/rides";
import Messages from "@/pages/messages";
import Groups from "@/pages/groups";
import Itinerary from "@/pages/itinerary";
import Navigation from "@/components/navigation";
import Explore from "@/pages/explore";
import TourGuides from "@/pages/tour-guides";
import SignupRedirect from "@/pages/signup-redirect";
import EmailLinkSignupPage from "@/pages/email-link-signup";
import VerifyEmailLinkPage from "@/pages/verify-email-link";
import ProfileCreatePage from "@/pages/profile-create";
import OwnerDashboard from "@/pages/owner-dashboard";
import DashboardSelector from "@/pages/dashboard-selector";
import AdminDashboard from "@/pages/admin-dashboard";
import BottomNavigation from "@/components/bottom-navigation";

// Component to require authentication
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-travel-light via-white to-travel-beige">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-travel-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-travel-navy text-lg">Loading TwiTrip...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const { user, isLoading } = useAuth();

  // Do not block rendering entirely on auth loading to avoid spinner lock-ups

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignupRedirect} />
      <Route path="/email-link-signup" component={EmailLinkSignupPage} />
      <Route path="/verify-email-link" component={VerifyEmailLinkPage} />
      {/* Ensure root redirects to explore for guests */}
      <Route path="/">
        <Home />
      </Route>
      
      {/* Protected routes */}
      <Route path="/explore">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Explore />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      
      <Route path="/swipe">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Swipe />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      
      <Route path="/profile">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Profile />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      
      <Route path="/properties">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Properties />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      
      <Route path="/rides">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Rides />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      
      <Route path="/messages">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Messages />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>

      <Route path="/groups">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Groups />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>

      <Route path="/itinerary">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <Itinerary />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>

      <Route path="/tour-guides">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <TourGuides />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>

      {/* Unified Dashboard */}
      <Route path="/dashboard">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <DashboardSelector />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/property">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <OwnerDashboard type="property" />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/ride">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <OwnerDashboard type="ride" />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/tour">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <OwnerDashboard type="tour" />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>
      <Route path="/dashboard/agency">
        <RequireAuth>
          <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
            <Navigation />
            <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 animate-fade-in">
              <OwnerDashboard type="agency" />
            </main>
            <BottomNavigation />
          </div>
        </RequireAuth>
      </Route>

      {/* Admin route remains for admin users; keep path but component will self-guard */}
      <Route path="/admin" component={AdminDashboard} />
      
      <Route path="/profile-create" component={ProfileCreatePage} />
      
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
