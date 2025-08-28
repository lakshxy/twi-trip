import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut, Users, Bell, Settings, Compass, MapPin, Menu } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/twi logo.png";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [declinedIds, setDeclinedIds] = useState<number[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);
  const { toast } = useToast();
  const [chatPrompt, setChatPrompt] = useState<{ open: boolean; notif: any | null }>({ open: false, notif: null });
  const [firstMessage, setFirstMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/explore", label: "Explore", icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/swipe", label: "Swipe", icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/properties", label: "Stays", icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/rides", label: "Rides", icon: <Car className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/messages", label: "Messages", icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/groups", label: "Groups", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/itinerary", label: "Itinerary", icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/tour-guides", label: "Guides", icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { href: "/dashboard", label: "Dashboard", icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  const notifications = [
    {
      id: 1,
      type: "ride",
      title: "Ride Join Request",
      message: "Priya Sharma wants to join your ride to Pune.",
      user: "Priya Sharma",
      action: "ride",
    },
    {
      id: 2,
      type: "stay",
      title: "Homestay Request",
      message: "Aarav Singh requested to stay at your property in Goa.",
      user: "Aarav Singh",
      action: "stay",
    },
    {
      id: 3,
      type: "tour",
      title: "Tour Guide Request",
      message: "Sara Mehta wants to book your city tour.",
      user: "Sara Mehta",
      action: "tour",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleContinueChat = (notif: any) => {
    setChatPrompt({ open: true, notif });
    setFirstMessage("");
  };

  const handleSendFirstMessage = async () => {
    if (!chatPrompt.notif || !firstMessage.trim()) return;
    setSending(true);
    try {
      const receiverId = chatPrompt.notif.userId || 2;
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content: firstMessage.trim() })
      });
      setChatPrompt({ open: false, notif: null });
      setFirstMessage("");
      setSending(false);
      setLocation(`/messages?user=${receiverId}`);
      toast({
        title: "Message sent!",
        description: "Opening chat...",
      });
    } catch (e) {
      setSending(false);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block glass-card sticky top-0 z-50 border-b border-travel-navy/10 dark:border-zinc-800 transition-all duration-300 bg-white dark:bg-zinc-900" role="navigation" aria-label="Top navigation">
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Logo */}
            <div className="flex items-center animate-fade-in">
              <Link href="/explore">
                <div className="flex items-center space-x-3 group cursor-pointer transition-all duration-300 rounded-2xl hover:bg-gradient-primary/90 hover:shadow-lg px-4 py-2">
                  <h1 className="text-xl lg:text-2xl font-bold text-travel-navy dark:text-white group-hover:text-travel-navy transition-colors duration-300 flex items-center gap-2">
                    <img src={logo} alt="TwiTrip Logo" className="h-8 w-auto inline-block align-middle" />
                    TwiTrip
                  </h1>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Items */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.slice(0, 6).map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-travel-navy dark:text-white bg-travel-lavender/20 dark:bg-travel-lavender/10"
                        : "text-travel-navy/70 dark:text-white/70 hover:text-travel-navy dark:hover:text-white hover:bg-travel-navy/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-2xl px-3 py-2 text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              
              {/* Notification Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative px-3 py-2 rounded-2xl text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <Badge className="absolute -top-2 -right-2 bg-travel-lavender text-white text-xs w-5 h-5 flex items-center justify-center p-0 animate-pulse">
                      {notifications.length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={12} className="w-[350px] p-0 rounded-2xl shadow-2xl border-travel-lavender/20 bg-white dark:bg-zinc-900">
                  {/* Notification content */}
                  <div className="flex flex-col items-center pt-6 pb-2">
                    <div className="relative bg-white rounded-full shadow-md w-16 h-16 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-travel-navy" />
                      <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-t-2xl px-8 py-4 border-b border-travel-lavender/10 mb-2">
                    <span className="text-xl font-semibold text-travel-navy">Notifications</span>
                    <button className="text-travel-primary font-medium hover:underline text-base" onClick={() => setAcceptedIds(notifications.map(n => n.id))}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-travel-lavender/20 max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => {
                      const isDeclined = declinedIds.includes(notif.id);
                      const isRead = readIds.includes(notif.id);
                      return (
                        <div
                          key={notif.id}
                          className={`p-4 flex flex-col gap-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            isRead ? 'bg-white' : 'bg-travel-lavender/10 border-l-4 border-travel-lavender'
                          }`}
                          onClick={() => {
                            if (!isRead) setReadIds(ids => [...ids, notif.id]);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-travel-lavender/10 p-2">
                              {notif.type === "ride" && <Car className="w-6 h-6 text-travel-terracotta" />}
                              {notif.type === "stay" && <Home className="w-6 h-6 text-travel-sage" />}
                              {notif.type === "tour" && <Users className="w-6 h-6 text-travel-mint" />}
                            </div>
                            <div>
                              <p className={`font-semibold ${isRead ? 'text-travel-navy/70' : 'text-travel-navy'}`}>{notif.title}</p>
                              <p className={`text-sm ${isRead ? 'text-travel-navy/50' : 'text-travel-navy/80'}`}>{notif.message}</p>
                            </div>
                            {!isRead && <span className="ml-auto w-2 h-2 bg-travel-lavender rounded-full" />}
                          </div>
                          {!isDeclined && !acceptedIds.includes(notif.id) && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" className="bg-travel-mint text-white" onClick={e => { e.stopPropagation(); setAcceptedIds(ids => [...ids, notif.id]); }}>Accept</Button>
                              <Button size="sm" variant="outline" className="border-travel-lavender text-travel-navy" onClick={e => { e.stopPropagation(); setDeclinedIds(ids => [...ids, notif.id]); }}>Decline</Button>
                            </div>
                          )}
                          {acceptedIds.includes(notif.id) && !isDeclined && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" className="bg-travel-navy text-white" onClick={e => { e.stopPropagation(); handleContinueChat(notif); }}>Continue Chat</Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {notifications.length === 0 && (
                      <div className="p-8 text-center text-travel-navy/50">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="rounded-2xl px-3 py-2 text-travel-navy/80 dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tablet/Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-zinc-700/50 shadow-lg" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/explore">
            <div className="flex items-center space-x-2 group cursor-pointer transition-all duration-300 rounded-xl hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 px-2 py-1">
              <img src={logo} alt="TwiTrip Logo" className="h-6 w-auto" />
              <h1 className="text-lg font-bold text-travel-navy dark:text-white">TwiTrip</h1>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 rounded-xl text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 bg-travel-lavender text-white text-xs w-4 h-4 flex items-center justify-center p-0">
                    {notifications.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="w-[300px] p-0 rounded-2xl shadow-2xl">
                {/* Simplified notification content for mobile */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notif) => (
                      <div key={notif.id} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200/50 dark:border-zinc-700/50 shadow-lg animate-slide-down">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left p-3 rounded-xl ${
                      isActive(item.href)
                        ? "text-travel-navy dark:text-white bg-travel-lavender/20 dark:bg-travel-lavender/10"
                        : "text-travel-navy/70 dark:text-white/70 hover:text-travel-navy dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-zinc-800/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200/50 dark:border-zinc-700/50">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="w-full justify-start text-left p-3 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-3">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
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

      {/* Chat Prompt Modal */}
      {chatPrompt.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-zinc-700/50 animate-scale-in">
            <h2 className="text-xl font-bold mb-4 text-travel-navy dark:text-white">Send a message to {chatPrompt.notif?.user}</h2>
            <textarea
              className="w-full border rounded-xl p-3 mb-4 min-h-[80px] resize-none focus:ring-2 focus:ring-travel-lavender focus:border-transparent"
              placeholder="Type your message..."
              value={firstMessage}
              onChange={e => setFirstMessage(e.target.value)}
              disabled={sending}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setChatPrompt({ open: false, notif: null })} 
                disabled={sending}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button 
                className="bg-travel-navy text-white flex-1 sm:flex-none" 
                onClick={handleSendFirstMessage} 
                disabled={sending || !firstMessage.trim()}
              >
                {sending ? "Sending..." : "Send & Continue"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
