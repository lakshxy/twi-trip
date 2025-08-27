import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut } from "lucide-react";
import { useState } from "react";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const navItems = [
    { href: "/swipe", icon: <Heart className="w-6 h-6" />, label: "Swipe" },
    { href: "/properties", icon: <Home className="w-6 h-6" />, label: "Stays" },
    { href: "/rides", icon: <Car className="w-6 h-6" />, label: "Rides" },
    {
      href: "/messages",
      icon: <MessageCircle className="w-6 h-6" />,
      label: "Messages",
    },
    { href: "/profile", icon: <User className="w-6 h-6" />, label: "Profile" },
  ];

  const isActive = (path: string) => location.startsWith(path);

  const handleLogout = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/20"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-6 h-6" />
          <span className="mt-1">Logout</span>
        </button>
      </div>

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-11/12 max-w-sm">
            <h3 className="text-lg font-semibold">Log Out</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
