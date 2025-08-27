import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Heart, User, Home, Car, MessageCircle, LogOut, Users, Bell, Settings, Compass, MapPin } from "lucide-react";
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

  const navItems = [
    { href: "/explore", label: "Explore", icon: <Compass className="w-5 h-5" /> },
    { href: "/swipe", label: "Swipe", icon: <Heart className="w-5 h-5" /> },
    { href: "/properties", label: "Stays", icon: <Home className="w-5 h-5" /> },
    { href: "/rides", label: "Rides", icon: <Car className="w-5 h-5" /> },
    { href: "/messages", label: "Messages", icon: <MessageCircle className="w-5 h-5" /> },
    { href: "/groups", label: "Groups", icon: <Users className="w-5 h-5" /> },
    { href: "/itinerary", label: "Itinerary", icon: <MapPin className="w-5 h-5" /> },
    { href: "/tour-guides", label: "Guides", icon: <Compass className="w-5 h-5" /> },
    { href: "/dashboard", label: "Dashboard", icon: <Settings className="w-5 h-5" /> },
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

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block glass-card sticky top-0 z-50 border-b border-travel-navy/10 dark:border-zinc-800 transition-all duration-300 bg-white dark:bg-zinc-900" role="navigation" aria-label="Top navigation">
        <div className="px-2 sm:px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Logo only */}
            <div className="flex items-center animate-fade-in">
              <Link href="/explore">
                <div className="flex items-center space-x-3 group cursor-pointer transition-all duration-300 rounded-2xl hover:bg-gradient-primary/90 hover:shadow-lg px-4 py-2">
                  <h1 className="text-xl md:text-2xl font-bold text-travel-navy dark:text-white group-hover:text-travel-navy transition-colors duration-300 flex items-center gap-2">
                    <img src={logo} alt="TwiTrip Logo" className="h-8 w-auto inline-block align-middle" />
                    TwiTrip
                  </h1>
                </div>
              </Link>
            </div>
            {/* Right: Dashboard, Notifications, Profile, Logout */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-2xl px-3 md:px-4 py-2 text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5">
                  <Settings className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
              {/* Notification Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative px-3 md:px-4 py-2 rounded-2xl text-travel-navy/80 dark:text-white hover:text-travel-navy hover:bg-travel-navy/5"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                    <Badge className="absolute -top-2 -right-2 bg-travel-lavender text-white text-xs w-5 h-5 flex items-center justify-center p-0 animate-pulse">
                      {notifications.length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={12} className="w-[350px] p-0 rounded-2xl shadow-2xl border-travel-lavender/20 bg-white dark:bg-zinc-900">
                  {/* Centered Bell Icon with Red Dot */}
                  <div className="flex flex-col items-center pt-6 pb-2">
                    <div className="relative bg-white rounded-full shadow-md w-16 h-16 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-travel-navy" />
                      <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                  </div>
                  {/* Header with title and mark all as read */}
                  <div className="flex items-center justify-between bg-white rounded-t-2xl px-8 py-4 border-b border-travel-lavender/10 mb-2">
                    <span className="text-xl font-semibold text-travel-navy">Notifications</span>
                    <button className="text-travel-primary font-medium hover:underline text-base" onClick={() => setAcceptedIds(notifications.map(n => n.id))}>
                      Mark all as read
                    </button>
                  </div>
                  {/* Notification List */}
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
                      <div className="p-8 text-center text-travel-navy/60">No new notifications</div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {/* Profile Avatar - direct link to profile page */}
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full p-0 w-10 h-10 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-travel-navy dark:text-white" />
                  )}
                </Button>
              </Link>
              <Popover open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-travel-navy/70 dark:text-red-400 hover:text-red-500 px-3 md:px-4 py-2 rounded-2xl transition-all duration-300"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-xs p-4 rounded-2xl shadow-2xl border-travel-lavender/20 bg-white dark:bg-zinc-900">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-travel-navy">Log Out</h3>
                    <p className="text-sm text-travel-navy/80 mt-2 mb-4">Are you sure you want to log out?</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setIsLogoutConfirmOpen(false)}>Cancel</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setIsLogoutConfirmOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-travel-navy/10" role="navigation" aria-label="Mobile navigation">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map(item => (
            <Link key={item.href} href={item.href}>
              <a className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${isActive(item.href) ? 'text-travel-primary' : 'text-travel-navy/70'}`}>
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </nav>

      {/* Chat Prompt Modal */}
      {chatPrompt.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-travel-navy">Send a message to {chatPrompt.notif?.user}</h2>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 min-h-[80px]"
              placeholder="Type your message..."
              value={firstMessage}
              onChange={e => setFirstMessage(e.target.value)}
              disabled={sending}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setChatPrompt({ open: false, notif: null })} disabled={sending}>Cancel</Button>
              <Button className="bg-travel-navy text-white" onClick={handleSendFirstMessage} disabled={sending || !firstMessage.trim()}>{sending ? "Sending..." : "Send & Continue"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
