import { db } from "./db";
import { users, profiles, properties, rides } from "@shared/schema";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data
    await db.delete(rides);
    await db.delete(properties);
    await db.delete(profiles);
    await db.delete(users);

    // Seed users
    const sampleUsers = await db.insert(users).values([
      { name: "Sarah Johnson", email: "sarah@example.com" },
      { name: "Marco Rodriguez", email: "marco@example.com" },
      { name: "Priya Sharma", email: "priya@example.com" },
      { name: "David Chen", email: "david@example.com" },
      { name: "Emma Thompson", email: "emma@example.com" },
      { name: "Hiroshi Tanaka", email: "hiroshi@example.com" },
      { name: "Luna Garcia", email: "luna@example.com" },
      { name: "Oliver Smith", email: "oliver@example.com" }
    ]).returning();

    console.log(`Created ${sampleUsers.length} users`);

    // Seed profiles
    const sampleProfiles = await db.insert(profiles).values([
      {
        userId: sampleUsers[0].id,
        bio: "Adventure seeker and photography enthusiast. Love exploring new cultures and trying local cuisines. Always up for hiking and outdoor adventures!",
        city: "Barcelona", 
        state: "Catalonia",
        age: 28,
        interests: ["Photography", "Hiking", "Cooking", "Art", "Music"],
        languages: ["English", "Spanish", "French"],
        travelGoals: ["Visit all European capitals", "Learn photography", "Try street food worldwide"],
        rating: "4.8",
        tripCount: 15
      },
      {
        userId: sampleUsers[1].id,
        bio: "Digital nomad exploring the world one city at a time. Love connecting with locals and fellow travelers. Passionate about sustainable travel.",
        city: "Mexico City",
        state: "Mexico City",
        age: 32,
        interests: ["Technology", "Sustainability", "Local Culture", "Coffee", "Architecture"],
        languages: ["Spanish", "English", "Portuguese"],
        travelGoals: ["Work from 50 cities", "Learn local languages", "Promote eco-tourism"],
        rating: "4.9",
        tripCount: 23
      },
      {
        userId: sampleUsers[2].id,
        bio: "Yoga instructor and wellness enthusiast. Seeking authentic experiences and spiritual growth through travel. Love meeting mindful travelers.",
        city: "Rishikesh",
        state: "Uttarakhand", 
        age: 26,
        interests: ["Yoga", "Meditation", "Wellness", "Nature", "Spirituality"],
        languages: ["Hindi", "English", "Sanskrit"],
        travelGoals: ["Visit sacred sites worldwide", "Teach yoga globally", "Connect with spiritual communities"],
        rating: "4.7",
        tripCount: 12
      },
      {
        userId: sampleUsers[3].id,
        bio: "Tech entrepreneur and foodie. Always looking for the next great meal and startup inspiration. Love sharing rides and splitting costs!",
        city: "Singapore",
        state: "Singapore",
        age: 30,
        interests: ["Technology", "Food", "Business", "Innovation", "Gaming"],
        languages: ["English", "Mandarin", "Malay"],
        travelGoals: ["Attend tech conferences worldwide", "Try Michelin star restaurants", "Network with entrepreneurs"],
        rating: "4.6",
        tripCount: 18
      },
      {
        userId: sampleUsers[4].id,
        bio: "Marine biologist and ocean advocate. Passionate about underwater photography and coral conservation. Looking for eco-conscious travel partners.",
        city: "Sydney",
        state: "New South Wales",
        age: 29,
        interests: ["Marine Biology", "Scuba Diving", "Photography", "Conservation", "Research"],
        languages: ["English", "French", "German"],
        travelGoals: ["Document coral reefs globally", "Promote ocean conservation", "Dive in all continents"],
        rating: "4.8",
        tripCount: 20
      },
      {
        userId: sampleUsers[5].id,
        bio: "Minimalist traveler and cultural enthusiast. Prefer authentic experiences over luxury. Always eager to learn about local traditions and customs.",
        city: "Kyoto",
        state: "Kyoto Prefecture",
        age: 35,
        interests: ["Culture", "History", "Minimalism", "Tea Ceremony", "Martial Arts"],
        languages: ["Japanese", "English", "Korean"],
        travelGoals: ["Experience traditional festivals", "Study martial arts worldwide", "Practice mindful travel"],
        rating: "4.9",
        tripCount: 25
      }
    ]).returning();

    console.log(`Created ${sampleProfiles.length} profiles`);

    // Seed properties
    const sampleProperties = await db.insert(properties).values([
      {
        hostId: sampleUsers[0].id,
        title: "Cozy Apartment in Gothic Quarter",
        description: "Beautiful apartment in the heart of Barcelona's historic Gothic Quarter. Walking distance to major attractions, authentic tapas bars, and local markets.",
        city: "Barcelona",
        state: "Catalonia",
        pricePerNight: "85.00",
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"],
        rating: "4.8",
        reviewCount: 24,
        amenities: ["WiFi", "Kitchen", "Balcony", "Air Conditioning", "Washing Machine"]
      },
      {
        hostId: sampleUsers[1].id,
        title: "Modern Loft in Roma Norte",
        description: "Stylish loft in trendy Roma Norte neighborhood. Perfect for digital nomads with co-working space and high-speed internet.",
        city: "Mexico City",
        state: "Mexico City",
        pricePerNight: "65.00",
        images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523"],
        rating: "4.9",
        reviewCount: 18,
        amenities: ["WiFi", "Co-working Space", "Gym Access", "Rooftop Terrace", "Kitchen"]
      },
      {
        hostId: sampleUsers[2].id,
        title: "Peaceful Retreat by the Ganges",
        description: "Serene homestay overlooking the Ganges River. Perfect for yoga practitioners and spiritual seekers. Includes daily yoga sessions.",
        city: "Rishikesh",
        state: "Uttarakhand",
        pricePerNight: "45.00",
        images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000"],
        rating: "4.7",
        reviewCount: 31,
        amenities: ["Yoga Studio", "River View", "Meditation Garden", "Vegetarian Meals", "WiFi"]
      },
      {
        hostId: sampleUsers[3].id,
        title: "Central Studio in Marina Bay",
        description: "Modern studio apartment with stunning city views. Located in the heart of Singapore's business district with easy access to everything.",
        city: "Singapore",
        state: "Singapore",
        pricePerNight: "120.00",
        images: ["https://images.unsplash.com/photo-1583395865554-58296a044a3e"],
        rating: "4.6",
        reviewCount: 15,
        amenities: ["City View", "Pool Access", "Gym", "WiFi", "Near MRT"]
      },
      {
        hostId: sampleUsers[4].id,
        title: "Beachfront Villa in Bondi",
        description: "Stunning beachfront villa just steps from Bondi Beach. Perfect for ocean lovers and surfers. Includes surfboard rental.",
        city: "Sydney",
        state: "New South Wales",
        pricePerNight: "150.00",
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"],
        rating: "4.8",
        reviewCount: 28,
        amenities: ["Beach Access", "Surfboard Rental", "Ocean View", "BBQ Area", "WiFi"]
      },
      {
        hostId: sampleUsers[5].id,
        title: "Traditional Ryokan Experience",
        description: "Authentic Japanese ryokan experience in historic Kyoto. Includes traditional breakfast and access to private onsen.",
        city: "Kyoto",
        state: "Kyoto Prefecture",
        pricePerNight: "95.00",
        images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523"],
        rating: "4.9",
        reviewCount: 42,
        amenities: ["Traditional Onsen", "Japanese Breakfast", "Tatami Rooms", "Garden View", "Cultural Activities"]
      }
    ]).returning();

    console.log(`Created ${sampleProperties.length} properties`);

    // Seed rides
    const sampleRides = await db.insert(rides).values([
      {
        driverId: sampleUsers[1].id,
        fromCity: "Mexico City",
        toCity: "Guadalajara",
        departureDate: new Date("2024-07-15"),
        departureTime: "09:00",
        availableSeats: 2,
        totalSeats: 4,
        pricePerSeat: "25.00",
        isFree: false,
        vehicleType: "SUV",
        description: "Comfortable ride to Guadalajara with stops for local food. Great opportunity to explore Mexican countryside together!"
      },
      {
        driverId: sampleUsers[3].id,
        fromCity: "Singapore",
        toCity: "Kuala Lumpur",
        departureDate: new Date("2024-07-20"),
        departureTime: "08:30",
        availableSeats: 3,
        totalSeats: 3,
        pricePerSeat: "0.00",
        isFree: true,
        vehicleType: "Sedan",
        description: "Free ride to KL for a tech conference. Looking for fellow entrepreneurs or tech enthusiasts to share the journey!"
      },
      {
        driverId: sampleUsers[0].id,
        fromCity: "Barcelona",
        toCity: "Valencia",
        departureDate: new Date("2024-07-18"),
        departureTime: "10:15",
        availableSeats: 1,
        totalSeats: 3,
        pricePerSeat: "18.00",
        isFree: false,
        vehicleType: "Hatchback",
        description: "Road trip to Valencia for the weekend. Planning to visit the City of Arts and Sciences. Photography enthusiasts welcome!"
      },
      {
        driverId: sampleUsers[4].id,
        fromCity: "Sydney",
        toCity: "Melbourne",
        departureDate: new Date("2024-07-22"),
        departureTime: "07:00",
        availableSeats: 2,
        totalSeats: 4,
        pricePerSeat: "35.00",
        isFree: false,
        vehicleType: "SUV",
        description: "Early morning departure to Melbourne. Stopping at coastal towns along the way. Perfect for nature lovers!"
      },
      {
        driverId: sampleUsers[5].id,
        fromCity: "Kyoto",
        toCity: "Tokyo",
        departureDate: new Date("2024-07-25"),
        departureTime: "11:30",
        availableSeats: 3,
        totalSeats: 3,
        pricePerSeat: "0.00",
        isFree: true,
        vehicleType: "Van",
        description: "Free ride to Tokyo. Practicing mindful travel with meditation breaks. Welcome to join for a peaceful journey!"
      },
      {
        driverId: sampleUsers[2].id,
        fromCity: "Rishikesh",
        toCity: "Dharamshala",
        departureDate: new Date("2024-07-28"),
        departureTime: "06:00",
        availableSeats: 1,
        totalSeats: 2,
        pricePerSeat: "15.00",
        isFree: false,
        vehicleType: "SUV",
        description: "Spiritual journey to Dharamshala. Early start to enjoy mountain sunrise. Perfect for yoga practitioners and meditation enthusiasts!"
      }
    ]).returning();

    console.log(`Created ${sampleRides.length} rides`);
    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };