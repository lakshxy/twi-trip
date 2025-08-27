import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Star, Clock, Globe } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format, differenceInCalendarDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    agency: "",
    destination: "",
    dates: "",
    duration: "",
    price: "",
    totalSpots: "",
    difficulty: "Easy",
    description: "",
    includes: "",
    image: ""
  });
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  const groupTrips = [
    {
      id: 1,
      title: "Bali Adventure Group",
      agency: "Wanderlust Adventures",
      destination: "Bali, Indonesia",
      duration: "7 days",
      price: "$899",
      dates: "March 15-22, 2024",
      spotsLeft: 3,
      totalSpots: 12,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      includes: ["Accommodation", "Daily breakfast", "Temple tours", "Volcano hiking"],
      difficulty: "Moderate"
    },
    {
      id: 2,
      title: "European Capitals Explorer",
      agency: "Euro Travel Co.",
      destination: "Paris, Rome, Barcelona",
      duration: "14 days",
      price: "$1,899",
      dates: "April 10-24, 2024",
      spotsLeft: 6,
      totalSpots: 20,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      includes: ["Hotels", "City tours", "Museum passes", "Train tickets"],
      difficulty: "Easy"
    },
    {
      id: 3,
      title: "Nepal Trekking Expedition",
      agency: "Mountain Quest",
      destination: "Kathmandu & Everest Base Camp",
      duration: "21 days",
      price: "$2,499",
      dates: "May 5-26, 2024",
      spotsLeft: 2,
      totalSpots: 8,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      includes: ["Camping gear", "Meals", "Sherpa guides", "Permits"],
      difficulty: "Challenging"
    },
    {
      id: 4,
      title: "Japan Cultural Journey",
      agency: "Rising Sun Tours",
      destination: "Tokyo, Kyoto, Osaka",
      duration: "10 days",
      price: "$1,599",
      dates: "June 1-11, 2024",
      spotsLeft: 8,
      totalSpots: 15,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      includes: ["Ryokan stays", "Cultural workshops", "Temple visits", "Food tours"],
      difficulty: "Easy"
    }
  ];

  const filteredTrips = groupTrips.filter(trip =>
    trip.destination.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-travel-mint/20 text-travel-mint';
      case 'Moderate': return 'bg-travel-lavender/20 text-travel-lavender';
      case 'Challenging': return 'bg-red-100 text-red-600';
      default: return 'bg-travel-beige/50 text-travel-navy';
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Organised Trip:", { ...form, dates: selectedRange?.from ? format(selectedRange.from, 'PPP') + ' - ' + format(selectedRange.to, 'PPP') : '' });
    setOpen(false);
    setForm({
      title: "",
      agency: "",
      destination: "",
      dates: "",
      duration: "",
      price: "",
      totalSpots: "",
      difficulty: "Easy",
      description: "",
      includes: "",
      image: ""
    });
  };

  function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  const from = selectedRange?.from;
  const to = selectedRange?.to;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex justify-start mt-2 mb-4 px-4">
          <BackButton />
        </div>
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-travel-navy mb-4">Group Travel Finder</h1>
          <p className="text-xl text-travel-navy/70 max-w-3xl mx-auto">
            Join organized group trips with agencies and fellow travelers. Perfect for solo adventurers or couples seeking structured experiences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by destination/location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white rounded-xl font-semibold" onClick={() => setOpen(true)}>
                Organise a Group Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Organise a Group Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input name="title" placeholder="Trip Title" value={form.title} onChange={handleFormChange} required />
                <Input name="agency" placeholder="Organiser Name/Agency" value={form.agency} onChange={handleFormChange} required />
                <Input name="destination" placeholder="Destination" value={form.destination} onChange={handleFormChange} required />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left"
                    >
                      {from && to && isValidDate(from) && isValidDate(to) ? (
                        `${format(from as Date, 'PPP')} - ${format(to as Date, 'PPP')}`
                      ) : (
                        <span className="text-muted-foreground">Select a date range</span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="range"
                      selected={selectedRange}
                      onSelect={(range) => {
                        setSelectedRange(range);
                        if (range && range.from && range.to) {
                          const days = differenceInCalendarDays(range.to, range.from) + 1;
                          const nights = days - 1;
                          setForm(f => ({ ...f, duration: days > 0 ? `${days}D/${nights}N` : "" }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  name="duration"
                  placeholder="Duration (e.g. 7 days)"
                  value={form.duration}
                  onChange={handleFormChange}
                  required
                  readOnly={!!(selectedRange && selectedRange.from && selectedRange.to)}
                />
                <Input name="price" placeholder="Price per person (e.g. $899)" value={form.price} onChange={handleFormChange} required />
                <Input name="totalSpots" placeholder="Total spots" value={form.totalSpots} onChange={handleFormChange} required type="number" min="1" />
                <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="w-full border rounded-md p-2">
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
                <Textarea name="description" placeholder="Description" value={form.description} onChange={handleFormChange} required />
                <Input name="includes" placeholder="What's included (comma separated)" value={form.includes} onChange={handleFormChange} required />
                <Input name="image" placeholder="Image URL" value={form.image} onChange={handleFormChange} required />
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-primary text-white rounded-xl font-semibold w-full">Post Trip</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="modern-card border-0 overflow-hidden animate-slide-up">
              <div className="relative">
                <img 
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getDifficultyColor(trip.difficulty)} border-0 font-semibold`}>
                    {trip.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-semibold text-travel-navy">{trip.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-travel-navy mb-1">{trip.title}</h3>
                    <p className="text-travel-navy/60 text-sm font-medium">{trip.agency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-travel-navy">{trip.price}</p>
                    <p className="text-sm text-travel-navy/60">per person</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-travel-navy/70">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-travel-navy/70">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{trip.dates}</span>
                  </div>
                  <div className="flex items-center text-travel-navy/70">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{trip.duration}</span>
                  </div>
                  <div className="flex items-center text-travel-navy/70">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      {trip.spotsLeft} spots left of {trip.totalSpots}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-travel-navy mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.includes.map((item, index) => (
                      <Badge key={index} className="bg-travel-mint/20 text-travel-mint text-xs border-0">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-primary text-white rounded-xl font-semibold">
                    Join Trip
                  </Button>
                  <Button variant="outline" className="px-6 rounded-xl border-travel-navy/20 text-travel-navy">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="modern-card border-0 bg-gradient-to-br from-travel-light to-white p-8">
            <CardContent className="p-0">
              <Globe className="w-16 h-16 text-travel-lavender mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-travel-navy mb-4">Can't Find Your Perfect Trip?</h3>
              <p className="text-travel-navy/70 mb-6 max-w-2xl mx-auto">
                Contact our travel specialists to create a custom group experience tailored to your interests and budget.
              </p>
              <Button className="bg-gradient-secondary text-white px-8 py-3 rounded-xl font-semibold">
                Create Custom Trip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}