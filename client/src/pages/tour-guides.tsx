import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Star, Users, Clock, Globe, Plus, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BackButton } from "@/components/back-button";
import { Checkbox } from "@/components/ui/checkbox";

const tourGuideFormSchema = z.object({
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  pricePerHour: z.string().optional(),
  pricePerDay: z.string().optional(),
  availableDays: z.array(z.string()).min(1, "At least one available day is required"),
  availableTimeStart: z.string().min(1, "Start time is required"),
  availableTimeEnd: z.string().min(1, "End time is required"),
});

type TourGuideFormData = z.infer<typeof tourGuideFormSchema>;

const specialtyOptions = [
  "Cultural Tours",
  "Adventure Tours", 
  "Food Tours",
  "Historical Tours",
  "Nature Tours",
  "City Walking Tours",
  "Photography Tours",
  "Shopping Tours",
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Russian"
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function TourGuides() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any | null>(null);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const form = useForm<TourGuideFormData>({
    resolver: zodResolver(tourGuideFormSchema),
    defaultValues: {
      location: "",
      title: "",
      description: "",
      specialties: [],
      languages: [],
      pricePerHour: "",
      pricePerDay: "",
      availableDays: [],
      availableTimeStart: "09:00",
      availableTimeEnd: "18:00",
    },
  });

  const { data: tourGuidesRaw = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tour-guides", searchLocation, searchSpecialty],
    retry: false,
  });

  const { data: myTourGuides = [] } = useQuery<any[]>({
    queryKey: ["/api/tour-guides/my"],
    enabled: !!user,
    retry: false,
  });

  const tourGuides = tourGuidesRaw;

  const createTourGuideMutation = useMutation({
    mutationFn: async (data: TourGuideFormData) => {
      const guideData = {
        ...data,
        guideId: user!.id,
        specialties: data.specialties,
        languages: data.languages,
        pricePerHour: data.pricePerHour ? data.pricePerHour : null,
        pricePerDay: data.pricePerDay ? data.pricePerDay : null,
      };
      return apiRequest("POST", "/api/tour-guides", guideData);
    },
    onSuccess: (_data, _variables, context) => {
      toast({
        title: "Success",
        description: "Tour guide profile created successfully",
      });
      setShowForm(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTourGuideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TourGuideFormData> }) => {
      return apiRequest("PATCH", `/api/tour-guides/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-guides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tour-guides/my"] });
      toast({
        title: "Success",
        description: "Tour guide profile updated successfully",
      });
      setEditingGuide(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTourGuideMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/tour-guides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-guides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tour-guides/my"] });
      toast({
        title: "Success",
        description: "Tour guide profile deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: TourGuideFormData) => {
    if (editingGuide) {
      updateTourGuideMutation.mutate({ id: editingGuide.id, data });
    } else {
      createTourGuideMutation.mutate(data);
    }
  };

  const handleEdit = (guide: any) => {
    setEditingGuide(guide);
    form.reset({
      location: guide.location,
      title: guide.title,
      description: guide.description,
      specialties: guide.specialties || [],
      languages: guide.languages || [],
      pricePerHour: guide.pricePerHour || "",
      pricePerDay: guide.pricePerDay || "",
      availableDays: guide.availableDays || [],
      availableTimeStart: guide.availableTimeStart || "09:00",
      availableTimeEnd: guide.availableTimeEnd || "18:00",
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingGuide(null);
    setShowForm(false);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading tour guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-travel-soft-lavender/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BackButton />
              <h1 className="text-2xl font-bold text-travel-navy font-poppins">🌟 Tour Guides</h1>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-travel-mint hover:bg-travel-mint/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Become a Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingGuide ? "Edit Tour Guide Profile" : "Create Tour Guide Profile"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialties</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {[...specialtyOptions, "Other"].map((specialty) => {
                              const selected = field.value.includes(specialty);
                              return specialty === "Other" ? (
                                <div key="other-specialty" className="flex items-center gap-2">
                                  <label
                                    className={`px-4 py-2 rounded-full cursor-pointer transition-colors border text-sm font-medium select-none
                                      ${selected ? 'bg-travel-mint text-white border-travel-mint shadow' : 'bg-white border-travel-mint/40 text-travel-navy hover:bg-travel-mint/10'}`}
                                  >
                                    <Checkbox
                                      checked={selected}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...field.value, "Other"]);
                                        } else {
                                          field.onChange(field.value.filter((s: string) => s !== "Other"));
                                        }
                                      }}
                                      className="hidden"
                                    />
                                    Other
                                  </label>
                                  {selected && (
                                    <input
                                      type="text"
                                      className="border rounded px-2 py-1 text-sm"
                                      placeholder="Custom specialty"
                                      value={customSpecialty}
                                      onChange={e => setCustomSpecialty(e.target.value)}
                                      onBlur={() => {
                                        if (customSpecialty && !field.value.includes(customSpecialty)) {
                                          field.onChange([...field.value.filter((v: string) => v !== "Other"), customSpecialty]);
                                          setCustomSpecialty("");
                                        }
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === "Enter" && customSpecialty) {
                                          field.onChange([...field.value.filter((v: string) => v !== "Other"), customSpecialty]);
                                          setCustomSpecialty("");
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              ) : (
                                <label
                                  key={specialty}
                                  className={`px-4 py-2 rounded-full cursor-pointer transition-colors border text-sm font-medium select-none
                                    ${selected ? 'bg-travel-mint text-white border-travel-mint shadow' : 'bg-white border-travel-mint/40 text-travel-navy hover:bg-travel-mint/10'}`}
                                >
                                  <Checkbox
                                    checked={selected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, specialty]);
                                      } else {
                                        field.onChange(field.value.filter((s: string) => s !== specialty));
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  {specialty}
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {[...languageOptions, "Other"].map((lang) => {
                              const selected = field.value.includes(lang);
                              return lang === "Other" ? (
                                <div key="other-language" className="flex items-center gap-2">
                                  <label
                                    className={`px-4 py-2 rounded-full cursor-pointer transition-colors border text-sm font-medium select-none
                                      ${selected ? 'bg-travel-mint text-white border-travel-mint shadow' : 'bg-white border-travel-mint/40 text-travel-navy hover:bg-travel-mint/10'}`}
                                  >
                                    <Checkbox
                                      checked={selected}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...field.value, "Other"]);
                                        } else {
                                          field.onChange(field.value.filter((l: string) => l !== "Other"));
                                        }
                                      }}
                                      className="hidden"
                                    />
                                    Other
                                  </label>
                                  {selected && (
                                    <input
                                      type="text"
                                      className="border rounded px-2 py-1 text-sm"
                                      placeholder="Custom language"
                                      value={customLanguage}
                                      onChange={e => setCustomLanguage(e.target.value)}
                                      onBlur={() => {
                                        if (customLanguage && !field.value.includes(customLanguage)) {
                                          field.onChange([...field.value.filter((v: string) => v !== "Other"), customLanguage]);
                                          setCustomLanguage("");
                                        }
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === "Enter" && customLanguage) {
                                          field.onChange([...field.value.filter((v: string) => v !== "Other"), customLanguage]);
                                          setCustomLanguage("");
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              ) : (
                                <label
                                  key={lang}
                                  className={`px-4 py-2 rounded-full cursor-pointer transition-colors border text-sm font-medium select-none
                                    ${selected ? 'bg-travel-mint text-white border-travel-mint shadow' : 'bg-white border-travel-mint/40 text-travel-navy hover:bg-travel-mint/10'}`}
                                >
                                  <Checkbox
                                    checked={selected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, lang]);
                                      } else {
                                        field.onChange(field.value.filter((l: string) => l !== lang));
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  {lang}
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Hour</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Day</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availableDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Days</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                              <label key={day} className="flex items-center gap-1">
                                <Checkbox
                                  checked={field.value.includes(day)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, day]);
                                    } else {
                                      field.onChange(field.value.filter((d: string) => d !== day));
                                    }
                                  }}
                                />
                                <span>{day}</span>
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="availableTimeStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availableTimeEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={createTourGuideMutation.isPending || updateTourGuideMutation.isPending}
                      className="bg-travel-mint hover:bg-travel-mint/90 text-white"
                    >
                      {editingGuide ? "Update Profile" : "Publish"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-travel-navy/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search-location" className="text-sm font-medium text-travel-navy">
                    Search Location
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-travel-navy/60" />
                    <Input
                      id="search-location"
                      placeholder="Enter city or country..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-specialty" className="text-sm font-medium text-travel-navy">
                    Filter by Specialty
                  </Label>
                  <Select value={searchSpecialty} onValueChange={val => setSearchSpecialty(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All specialties</SelectItem>
                      {specialtyOptions.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchLocation("");
                      setSearchSpecialty("all");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* My Guides Grid */}
        {myTourGuides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {myTourGuides.map((guide) => (
              <div key={guide.id} className="relative">
                {/* Guide Card (replace with your actual GuideCard if exists) */}
                <Card className="mb-2">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-travel-navy text-lg">{guide.title}</h3>
                        <p className="text-travel-navy/70 text-sm">{guide.location}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-travel-navy/80 text-sm">{guide.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 