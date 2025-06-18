import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", icon: Heart, label: "Match", id: "swipe" },
    { path: "/profile", icon: User, label: "Profile", id: "profile" },
    { path: "/properties", icon: Home, label: "Stays", id: "properties" },
    { path: "/rides", icon: Car, label: "Rides", id: "rides" },
    { path: "/messages", icon: MessageCircle, label: "Messages", id: "messages", badge: 3 },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-travel-dark">TravelSwipe</h1>
              </Link>
              <span className="text-gray-600">Hello, {user?.name}!</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} href={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative ${
                        isActive(item.path) ? 'text-travel-primary' : 'text-gray-600 hover:text-travel-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-travel-primary text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 relative ${
                    isActive(item.path) ? 'text-travel-primary' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 right-0 bg-travel-primary text-white text-xs w-4 h-4 flex items-center justify-center p-0">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
