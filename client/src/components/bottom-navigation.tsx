import { Link, useLocation } from "wouter";
import { Heart, Home, Car, MessageCircle, Users, Compass } from "lucide-react";

const navItems = [
  { label: "Swipe", icon: Heart, href: "/swipe" },
  { label: "Stays", icon: Home, href: "/properties" },
  { label: "Rides", icon: Car, href: "/rides" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
  { label: "Groups", icon: Users, href: "/groups" },
  { label: "Guides", icon: Compass, href: "/tour-guides" },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  return (
    <nav
      className="fixed left-0 right-0 bottom-6 z-50 flex justify-center pointer-events-none"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-2xl rounded-full px-2 py-2 flex justify-around items-center gap-1 max-w-2xl w-[96vw] border border-gray-200 dark:border-zinc-800 mx-auto mb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = location.startsWith(href);
          return (
            <Link key={label} href={href} aria-label={label} tabIndex={0}>
              <button
                className={`flex flex-col items-center min-h-[44px] min-w-[44px] text-xs sm:text-sm md:text-base px-3 py-1 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 relative
                  ${active
                    ? "bg-travel-mint/20 dark:bg-travel-mint/30 text-travel-primary shadow-md scale-105 animate-nav-pop"
                    : "text-gray-600 dark:text-gray-200 hover:text-travel-primary hover:bg-travel-mint/10"
                }`}
                aria-current={active ? "page" : undefined}
                style={{ transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s' }}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mb-0.5" />
                {label}
              </button>
            </Link>
          );
        })}
      </div>
      <style>{`
        @keyframes nav-pop {
          0% { transform: scale(1); opacity: 0.7; }
          60% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        .animate-nav-pop { animation: nav-pop 0.25s; }
      `}</style>
    </nav>
  );
}
