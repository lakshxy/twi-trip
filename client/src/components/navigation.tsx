import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/swipe", icon: Heart, label: "Match", id: "swipe" },
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
      <nav className="hidden md:block glass-card sticky top-0 z-50 border-b border-travel-navy/10 transition-all duration-300">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-8 animate-fade-in">
              <Link href="/">
                <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TT</span>
                  </div>
                  <h1 className="text-2xl font-bold text-travel-navy">TickTrip</h1>
                </div>
              </Link>
              <span className="text-travel-navy/70 font-medium">Hello, {user?.name}!</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.id} href={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative px-4 py-3 rounded-2xl transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-primary text-white shadow-lg' 
                          : 'text-travel-navy/70 hover:text-travel-navy hover:bg-travel-navy/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="ml-2 font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge className="absolute -top-2 -right-2 bg-travel-mint text-white text-xs w-5 h-5 flex items-center justify-center p-0 animate-pulse">
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
                className="text-travel-navy/70 hover:text-red-500 px-4 py-3 rounded-2xl transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-travel-navy/10 px-4 py-4 z-50 m-4 rounded-3xl shadow-2xl">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-2 relative p-3 rounded-2xl transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-primary text-white shadow-lg scale-110' 
                      : 'text-travel-navy/70 hover:text-travel-navy hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-travel-mint text-white text-xs w-5 h-5 flex items-center justify-center p-0 animate-pulse">
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
