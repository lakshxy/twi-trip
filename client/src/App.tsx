
import { AuthProvider, useAuth } from "./lib/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import BottomNavigation from "./components/bottom-navigation";

import { Route, Switch, Redirect, useLocation } from "wouter";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import ExplorePage from "./pages/explore";
import VerifyEmailPage from "./pages/verify-email";
import CreateProfilePage from "./pages/create-profile";
import DashboardPage from "./pages/dashboard";

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
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

function App() {
  const [location] = useLocation();
  const showBottomNav = !["/login", "/signup", "/verify-email"].includes(location);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        {showBottomNav && <BottomNavigation />}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
