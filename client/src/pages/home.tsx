import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Home as HomeIcon,
  Car,
  MessageCircle,
  MapPin,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white">
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/">
            <a className="group inline-flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Swipe</span>
              </span>
            </a>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link href="/swipe"><a className="text-sm text-slate-300 hover:text-white">Discover</a></Link>
            <Link href="/host"><a className="text-sm text-slate-300 hover:text-white">Become a Host</a></Link>
            <Link href="/safety"><a className="text-sm text-slate-300 hover:text-white">Safety</a></Link>
          </nav>

          <Link href="/swipe">
            <Button className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(244,114,182,0.18),transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-10 md:grid-cols-2 md:pt-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">fellow</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">travelers</span>
              <br />
              worldwide
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
              Discover authentic homestays, find travel companions, share rides, and plan adventures together — all with a fun, swipe-first experience.
            </p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/swipe">
                <Button size="lg" className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:scale-[1.02]">
                  Start exploring <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="rounded-2xl border-2 border-slate-400 bg-transparent px-8 py-6 text-lg font-semibold text-slate-200 hover:bg-slate-800/40">
                  Watch demo
                </Button>
              </Link>
            </div>

            {/* Trust */}
            <ul className="flex flex-wrap items-center gap-6 text-slate-300">
              <li className="inline-flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-5 w-5 text-emerald-400" /> Free to join</li>
              <li className="inline-flex items-center gap-2 text-sm font-medium"><Shield className="h-5 w-5 text-blue-400" /> Safe & secure</li>
              <li className="inline-flex items-center gap-2 text-sm font-medium"><Globe className="h-5 w-5 text-indigo-400" /> Worldwide community</li>
            </ul>
          </motion.div>

          {/* Phone mock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="relative rounded-[2.5rem] bg-slate-800 p-2 shadow-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-white">
                <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">9:41</span>
                    <div className="flex space-x-1">
                      <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                      <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                      <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Discover</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4 rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-400">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">Maya, 26</h4>
                    <p className="mb-3 text-sm font-medium text-slate-800">Digital Nomad • Bangkok</p>
                    <p className="text-xs text-slate-700">Looking for travel buddies to explore street food markets and temples!</p>
                    <div className="mt-3 flex space-x-2">
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs text-blue-700">Street Food</span>
                      <span className="rounded-lg bg-green-100 px-2 py-1 text-xs text-green-700">Photography</span>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <span className="font-bold text-red-500">✕</span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Everything you need for
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">amazing</span>
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">travels</span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
              A social matching platform that blends authentic experiences with trusted connections across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Smart Matching */}
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-rose-500" />}
              title="Smart Matching"
              text="Swipe through travelers and hosts by interests, destination, and style to find your perfect companion."
            />
            {/* Authentic Homestays */}
            <FeatureCard
              icon={<HomeIcon className="h-8 w-8 text-teal-600" />}
              title="Authentic Homestays"
              text="Stay with verified locals who offer unique spaces and insider knowledge."
            />
            {/* Ride Sharing */}
            <FeatureCard
              icon={<Car className="h-8 w-8 text-blue-600" />}
              title="Ride Sharing"
              text="Split costs and make friends on the way by sharing rides with fellow travelers."
            />
            {/* Real-time Chat */}
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8 text-emerald-600" />}
              title="Real-time Chat"
              text="Plan adventures instantly with secure, built-in messaging."
            />
            {/* Activity Partners */}
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-violet-600" />}
              title="Activity Partners"
              text="Find companions for hiking, sightseeing, dining — whatever you're into."
            />
            {/* Location-based */}
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-amber-600" />}
              title="Location-based"
              text="Discover nearby opportunities or plan ahead with destination filters."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">Ready to start your adventure?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300">
            Join thousands of travelers who are already matching and exploring together.
          </p>

          <Link href="/swipe">
            <Button size="lg" className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-12 py-6 text-xl font-semibold shadow-2xl transition-all hover:scale-[1.02]">
              Start exploring now <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>

          <div className="mt-10 flex items-center justify-center space-x-8 text-slate-400">
            <span className="inline-flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-400" /> Free to join</span>
            <span className="inline-flex items-center gap-2"><Shield className="h-5 w-5 text-blue-400" /> Safe & secure</span>
            <span className="inline-flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-400" /> Worldwide community</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-pink-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold">TravelSwipe</h3>
          </div>
          <p className="mx-auto mb-6 max-w-2xl text-slate-400">
            Connecting travelers through authentic experiences and meaningful connections.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} TravelSwipe</span>
            <span>•</span>
            <span>Available Worldwide</span>
            <span>•</span>
            <span>Safe & Secure Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-0 bg-slate-900/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="mx-auto max-w-xs leading-relaxed text-slate-300">{text}</p>
      </CardContent>
    </Card>
  );
}
