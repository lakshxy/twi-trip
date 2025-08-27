import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
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
import ProfileCreatePage from "@/pages/profile-create";
import OwnerDashboard from "@/pages/owner-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import BottomNavigation from "@/components/bottom-navigation";

// A component to wrap protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // a optional redirect query param can be added
    return <Redirect to={`/login?redirect=${location}`} />;
  }

  return <>{children}</>;
}

// Layout for pages that are protected and have the bottom navigation
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const isMobile = () => window.innerWidth < 768;
  return (
    <ProtectedRoute>
      <div className="min-h-screen max-w-7xl mx-auto px-2 sm:px-4 md:px-8 bg-gradient-to-br from-travel-light via-white to-travel-beige transition-all duration-500">
        <Navigation />
        <main className={`pb-[calc(3.5rem+env(safe-area-inset-bottom))] ${isMobile() ? '' : 'md:pb-0'} animate-fade-in`}>
          {children}
        </main>
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}

function AppRouter() {
  return (
    <Switch>
      {/* --- Public Routes --- */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* --- Protected Routes --- */}
      <Route path="/explore">
        <ProtectedLayout><Explore /></ProtectedLayout>
      </Route>
      <Route path="/swipe">
        <ProtectedLayout><Swipe /></ProtectedLayout>
      </Route>
      <Route path="/profile">
        <ProtectedLayout><Profile /></ProtectedLayout>
      </Route>
      <Route path="/profile-create">
        <ProtectedLayout><ProfileCreatePage /></ProtectedLayout>
      </Route>
      <Route path="/properties">
        <ProtectedLayout><Properties /></ProtectedLayout>
      </Route>
      <Route path="/rides">
        <ProtectedLayout><Rides /></ProtectedLayout>
      </Route>
      <Route path="/messages">
        <ProtectedLayout><Messages /></ProtectedLayout>
      </Route>
      <Route path="/groups">
        <ProtectedLayout><Groups /></ProtectedLayout>
      </Route>
      <Route path="/itinerary">
        <ProtectedLayout><Itinerary /></ProtectedLayout>
      </Route>
      <Route path="/tour-guides">
        <ProtectedLayout><TourGuides /></ProtectedLayout>
      </Route>

      {/* --- Dashboards --- */}
      <Route path="/dashboard/property">
        <ProtectedLayout><OwnerDashboard type="property" /></ProtectedLayout>
      </Route>
      <Route path="/dashboard/ride">
        <ProtectedLayout><OwnerDashboard type="ride" /></ProtectedLayout>
      </Route>
      <Route path="/dashboard/tour">
        <ProtectedLayout><OwnerDashboard type="tour" /></ProtectedLayout>
      </Route>
      <Route path="/dashboard/agency">
        <ProtectedLayout><OwnerDashboard type="agency" /></ProtectedLayout>
      </Route>
      
      {/* --- Admin Route --- */}
      <Route path="/admin">
        <ProtectedLayout><AdminDashboard /></ProtectedLayout>
      </Route>
      
      {/* 404 Not Found */}
      <Route>
        <NotFound />
      </Route>
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
