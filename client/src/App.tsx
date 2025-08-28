
import { AuthProvider, useAuth } from "./lib/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import BottomNavigation from "./components/bottom-navigation";
import Navigation from "./components/navigation";

import { Route, Switch, Redirect, useLocation } from "wouter";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import ExplorePage from "./pages/explore";
import VerifyEmailPage from "./pages/verify-email";
import CreateProfilePage from "./pages/create-profile";
import DashboardPage from "./pages/dashboard";
import SwipePage from "./pages/swipe";
import PropertiesPage from "./pages/properties";
import RidesPage from "./pages/rides";
import MessagesPage from "./pages/messages";
import ProfilePage from "./pages/profile";
import GroupsPage from "./pages/groups";
import ItineraryPage from "./pages/itinerary";
import TourGuidesPage from "./pages/tour-guides";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";

const AppRoutes = () => {
  const { user, firebaseUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/">
        {user ? <Redirect to="/explore" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        {user ? <Redirect to="/explore" /> : <LoginPage />}
      </Route>
      <Route path="/signup">
        {user ? <Redirect to="/explore" /> : <SignUpPage />}
      </Route>
      <Route path="/verify-email">
        {!firebaseUser ? (
          <Redirect to="/login" />
        ) : firebaseUser.emailVerified ? (
          <Redirect to="/create-profile" />
        ) : (
          <VerifyEmailPage />
        )}
      </Route>
      <Route path="/create-profile">
        {!firebaseUser ? (
          <Redirect to="/login" />
        ) : !firebaseUser.emailVerified ? (
          <Redirect to="/verify-email" />
        ) : user?.profileComplete ? (
          <Redirect to="/explore" />
        ) : (
          <CreateProfilePage />
        )}
      </Route>
      <Route path="/explore">
        {!user ? <Redirect to="/login" /> : <ExplorePage />}
      </Route>
      <Route path="/dashboard">
        {!user ? <Redirect to="/login" /> : <DashboardPage />}
      </Route>
      <Route path="/swipe">
        {!user ? <Redirect to="/login" /> : <SwipePage />}
      </Route>
      <Route path="/properties">
        {!user ? <Redirect to="/login" /> : <PropertiesPage />}
      </Route>
      <Route path="/rides">
        {!user ? <Redirect to="/login" /> : <RidesPage />}
      </Route>
      <Route path="/messages">
        {!user ? <Redirect to="/login" /> : <MessagesPage />}
      </Route>
      <Route path="/profile">
        {!user ? <Redirect to="/login" /> : <ProfilePage />}
      </Route>
      <Route path="/groups">
        {!user ? <Redirect to="/login" /> : <GroupsPage />}
      </Route>
      <Route path="/itinerary">
        {!user ? <Redirect to="/login" /> : <ItineraryPage />}
      </Route>
      <Route path="/tour-guides">
        {!user ? <Redirect to="/login" /> : <TourGuidesPage />}
      </Route>
      <Route path="/home">
        {!user ? <Redirect to="/login" /> : <HomePage />}
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

function App() {
  const [location] = useLocation();
  const showBottomNav = !["/login", "/signup", "/verify-email"].includes(location);
  const showTopNav = !["/login", "/signup", "/verify-email"].includes(location);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {showTopNav && <Navigation />}
        <div className={showTopNav ? "pt-16 lg:pt-20" : ""}>
          <AppRoutes />
        </div>
        {showBottomNav && <BottomNavigation />}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
