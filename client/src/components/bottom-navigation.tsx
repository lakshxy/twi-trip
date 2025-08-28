import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const navItems = [
    { href: "/swipe", icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Swipe" },
    { href: "/properties", icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Stays" },
    { href: "/rides", icon: <Car className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Rides" },
    {
      href: "/messages",
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: "Messages",
    },
    { href: "/profile", icon: <User className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Profile" },
  ];

  const isActive = (path: string) => location.startsWith(path);

  const handleLogout = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
  };

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-zinc-700/50 shadow-lg"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex flex-col items-center justify-center w-full h-full min-h-[3rem] px-2 py-1 text-xs sm:text-sm font-medium transition-all duration-200 rounded-xl ${
                  isActive(item.href)
                    ? "text-travel-navy dark:text-white bg-travel-lavender/20 dark:bg-travel-lavender/10"
                    : "text-gray-600 dark:text-gray-400 hover:text-travel-navy dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                <span className="mt-1 text-center leading-tight">{item.label}</span>
              </a>
            </Link>
          ))}
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full min-h-[3rem] px-2 py-1 text-xs sm:text-sm font-medium transition-all duration-200 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10"
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="mt-1 text-center leading-tight">Logout</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200/50 dark:border-zinc-700/50 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Log Out</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to log out?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex-1 sm:flex-none"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
