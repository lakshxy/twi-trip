
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plane, Home, Camera, Compass, MapPin } from "lucide-react";

interface ItineraryItem {
  id: number;
  destination: string;
  date: string;
  type: 'flight' | 'hotel' | 'activity';
  status: 'upcoming' | 'completed' | 'cancelled';
  title: string;
  reminder?: string;
}

interface TravelItineraryProps {
  itinerary: ItineraryItem[];
  showPlanTrip: boolean;
  setShowPlanTrip: (show: boolean) => void;
  editingId: number | null;
  form: any;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: (form: any) => void;
  handleSaveEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  handlePlanTrip: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedItineraryId: number | null;
  setSelectedItineraryId: (id: number | null) => void;
  handleEditItinerary: (item: ItineraryItem) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  setDeleteTargetId: (id: number | null) => void;
}

const TravelItinerary: React.FC<TravelItineraryProps> = ({
  itinerary,
  showPlanTrip,
  setShowPlanTrip,
  editingId,
  form,
  handleFormChange,
  setForm,
  handleSaveEdit,
  handlePlanTrip,
  selectedItineraryId,
  setSelectedItineraryId,
  handleEditItinerary,
  setShowDeleteConfirm,
  setDeleteTargetId
}) => {
  const getIcon = (type: ItineraryItem['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-5 w-5 text-travel-lavender" />;
      case 'hotel':
        return <Home className="h-5 w-5 text-travel-mint" />;
      case 'activity':
        return <Camera className="h-5 w-5 text-travel-beige" />;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card modern-card mb-8 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-travel-navy" />
            <CardTitle className="text-travel-navy text-xl md:text-2xl">Your Travel Itinerary</CardTitle>
          </div>
          <Dialog open={showPlanTrip} onOpenChange={setShowPlanTrip}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white font-semibold text-sm">
                <Plane className="h-4 w-4 mr-2" />
                Plan Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-sm md:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-travel-navy">{editingId ? 'Edit Your Trip' : 'Plan a New Trip'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingId ? handleSaveEdit : handlePlanTrip} className="space-y-4">
                <Input name="title" placeholder="Title (e.g. Visit Eiffel Tower)" value={form.title} onChange={handleFormChange} required className="bg-white/80" />
                <Input name="destination" placeholder="Destination" value={form.destination} onChange={handleFormChange} required className="bg-white/80" />
                <Input name="date" type="date" placeholder="Date" value={form.date} onChange={handleFormChange} required className="bg-white/80" />
                <Select name="type" value={form.type} onValueChange={val => setForm((f: any) => ({ ...f, type: val }))}>
                  <SelectTrigger className="bg-white/80"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md">
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="reminder" type="datetime-local" placeholder="Reminder Time (optional)" value={form.reminder} onChange={handleFormChange} className="bg-white/80" />
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-primary text-white">{editingId ? 'Save Changes' : 'Add to Itinerary'}</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {itinerary.length > 0 ? (
          <div className="space-y-4">
            {itinerary.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-white/20 cursor-pointer transition-all hover:bg-white/80 ${selectedItineraryId === item.id ? 'ring-2 ring-travel-mint' : ''}`}
                onClick={() => setSelectedItineraryId(item.id === selectedItineraryId ? null : item.id)}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-travel-navy text-base md:text-lg">{item.title}</h4>
                    <p className="text-sm md:text-base text-travel-navy/70 flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      {item.destination} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={item.status === 'upcoming' ? 'default' : 'secondary'}
                    className={`text-xs ${item.status === 'upcoming' ? 'bg-travel-mint text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {item.status}
                  </Badge>
                </div>
                {selectedItineraryId === item.id && (
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleEditItinerary(item); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); setDeleteTargetId(item.id); }}>Delete</Button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-travel-navy mb-2">No trips planned yet</h3>
            <p className="text-travel-navy/70 text-base mb-6">Start planning your next adventure!</p>
            <Button className="bg-gradient-primary text-white font-semibold" onClick={() => setShowPlanTrip(true)}>
              <Compass className="h-4 w-4 mr-2" />
              Create Itinerary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelItinerary;
