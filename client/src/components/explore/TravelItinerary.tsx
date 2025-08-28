
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
  return (
    <Card className="card-hover border-travel-navy/20 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-travel-navy" />
            <CardTitle className="text-travel-navy text-base md:text-lg">Your Travel Itinerary</CardTitle>
          </div>
          <Dialog open={showPlanTrip} onOpenChange={setShowPlanTrip}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-travel-mint text-travel-navy hover:bg-travel-mint/10 text-xs md:text-sm">
                <Plane className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Plan Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm md:max-w-md">
              <DialogHeader>
                <DialogTitle>Plan a New Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingId ? handleSaveEdit : handlePlanTrip} className="space-y-4">
                <Input name="title" placeholder="Title (e.g. Visit Eiffel Tower)" value={form.title} onChange={handleFormChange} required />
                <Input name="destination" placeholder="Destination" value={form.destination} onChange={handleFormChange} required />
                <Input name="date" type="date" placeholder="Date" value={form.date} onChange={handleFormChange} required />
                <Select name="type" value={form.type} onValueChange={val => setForm((f: any) => ({ ...f, type: val }))}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="reminder" type="datetime-local" placeholder="Reminder Time (optional)" value={form.reminder} onChange={handleFormChange} />
                <DialogFooter>
                  <Button type="submit" className="bg-travel-mint text-white">Add to Itinerary</Button>
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
          <div className="space-y-3">
            {itinerary.map((item) => (
              <div key={item.id} className={`flex flex-col p-3 rounded-lg bg-gradient-to-r from-travel-navy/5 to-travel-mint/5 border border-travel-soft-lavender/20 cursor-pointer ${selectedItineraryId === item.id ? 'ring-2 ring-travel-mint' : ''}`}
                onClick={() => setSelectedItineraryId(item.id === selectedItineraryId ? null : item.id)}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {item.type === 'flight' && <Plane className="h-5 w-5 text-travel-navy" />}
                    {item.type === 'hotel' && <Home className="h-5 w-5 text-travel-mint" />}
                    {item.type === 'activity' && <Camera className="h-5 w-5 text-travel-soft-lavender" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-travel-navy text-sm md:text-base">{item.title}</h4>
                    <p className="text-xs md:text-sm text-travel-navy/70 flex items-center">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {item.destination} • {item.date}
                    </p>
                  </div>
                  <Badge 
                    variant={item.status === 'upcoming' ? 'default' : 'secondary'}
                    className={`text-xs ${item.status === 'upcoming' ? 'bg-travel-mint text-white' : 'bg-travel-soft-lavender/20 text-travel-navy'}`}
                  >
                    {item.status}
                  </Badge>
                </div>
                {selectedItineraryId === item.id && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleEditItinerary(item); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); setDeleteTargetId(item.id); }}>Delete</Button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <div className="text-5xl mb-3">🗺️</div>
            <h3 className="text-base md:text-lg font-semibold text-travel-navy mb-2">No trips planned yet</h3>
            <p className="text-travel-navy/70 text-sm mb-4">Start planning your next adventure!</p>
            <Button className="bg-travel-mint hover:bg-travel-mint/90 text-white text-xs md:text-sm" onClick={() => setShowPlanTrip(true)}>
              <Compass className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Create Itinerary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelItinerary;
