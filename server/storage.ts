import {
  users,
  profiles,
  properties,
  rides,
  messages,
  swipes,
  matches,
  propertyInterests,
  rideRequests,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Property,
  type InsertProperty,
  type Ride,
  type InsertRide,
  type Message,
  type InsertMessage,
  type Swipe,
  type InsertSwipe,
  type PropertyInterest,
  type InsertPropertyInterest,
  type RideRequest,
  type InsertRideRequest,
  itineraries,
  type InsertItinerary,
  Itinerary,
  tourGuides,
  type TourGuide,
  type InsertTourGuide,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, ne } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  getProfileWithUser(userId: number): Promise<(Profile & { user: User }) | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile>;

  // Property operations
  getProperties(): Promise<(Property & { host: User })[]>;
  getProperty(id: number): Promise<(Property & { host: User }) | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  showPropertyInterest(interest: InsertPropertyInterest): Promise<PropertyInterest>;

  // Ride operations
  getRides(): Promise<(Ride & { driver: User })[]>;
  getRide(id: number): Promise<(Ride & { driver: User }) | undefined>;
  createRide(ride: InsertRide): Promise<Ride>;
  requestRideJoin(request: InsertRideRequest): Promise<RideRequest>;

  // Swipe operations
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  checkMatch(user1Id: number, user2Id: number): Promise<boolean>;
  getSwipeableProfiles(userId: number): Promise<(Profile & { user: User })[]>;

  // Message operations
  getConversations(userId: number): Promise<{ user: User; lastMessage: Message | null; unreadCount: number }[]>;
  getMessages(user1Id: number, user2Id: number): Promise<(Message & { sender: User; receiver: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<void>;

  // Match operations
  getUserMatches(userId: number): Promise<(Profile & { user: User })[]>;

  // Itinerary operations
  getItinerariesByUser(userId: number): Promise<Itinerary[]>;
  createItinerary(data: InsertItinerary): Promise<Itinerary>;
  updateItinerary(id: number, data: Partial<InsertItinerary>): Promise<Itinerary>;
  deleteItinerary(id: number): Promise<Itinerary>;

  // Tour Guide operations
  getTourGuides({ location, specialty }: { location?: string; specialty?: string });
  getMyTourGuides(userId: number);
  createTourGuide(data: InsertTourGuide);
  updateTourGuide(id: number, data: Partial<InsertTourGuide>);
  deleteTourGuide(id: number);
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async getProfileWithUser(userId: number): Promise<(Profile & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, userId));
    
    if (!result) return undefined;
    return { ...result.profiles, user: result.users };
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set(profile)
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getProperties(): Promise<(Property & { host: User })[]> {
    const results = await db
      .select()
      .from(properties)
      .innerJoin(users, eq(properties.hostId, users.id))
      .orderBy(desc(properties.createdAt));
    
    return results.map(r => ({ ...r.properties, host: r.users }));
  }

  async getProperty(id: number): Promise<(Property & { host: User }) | undefined> {
    const [result] = await db
      .select()
      .from(properties)
      .innerJoin(users, eq(properties.hostId, users.id))
      .where(eq(properties.id, id));
    
    if (!result) return undefined;
    return { ...result.properties, host: result.users };
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async showPropertyInterest(interest: InsertPropertyInterest): Promise<PropertyInterest> {
    const [newInterest] = await db.insert(propertyInterests).values(interest).returning();
    return newInterest;
  }

  async getRides(): Promise<(Ride & { driver: User })[]> {
    const results = await db
      .select()
      .from(rides)
      .innerJoin(users, eq(rides.driverId, users.id))
      .orderBy(desc(rides.createdAt));
    
    return results.map(r => ({ ...r.rides, driver: r.users }));
  }

  async getRide(id: number): Promise<(Ride & { driver: User }) | undefined> {
    const [result] = await db
      .select()
      .from(rides)
      .innerJoin(users, eq(rides.driverId, users.id))
      .where(eq(rides.id, id));
    
    if (!result) return undefined;
    return { ...result.rides, driver: result.users };
  }

  async createRide(ride: InsertRide): Promise<Ride> {
    const [newRide] = await db.insert(rides).values(ride).returning();
    return newRide;
  }

  async requestRideJoin(request: InsertRideRequest): Promise<RideRequest> {
    const [newRequest] = await db.insert(rideRequests).values(request).returning();
    return newRequest;
  }

  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const [newSwipe] = await db.insert(swipes).values(swipe).returning();
    return newSwipe;
  }

  async checkMatch(user1Id: number, user2Id: number): Promise<boolean> {
    const [match] = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.user1Id, user1Id),
          eq(matches.user2Id, user2Id),
          eq(matches.isMatch, true)
        )
      );
    
    return !!match;
  }

  async getSwipeableProfiles(userId: number): Promise<(Profile & { user: User })[]> {
    // Get profiles that haven't been swiped by the current user
    const swipedUserIds = await db
      .select({ swipedId: swipes.swipedId })
      .from(swipes)
      .where(eq(swipes.swiperId, userId));
    
    const swipedIds = swipedUserIds.map(s => s.swipedId);
    
    const results = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(ne(profiles.userId, userId));
    
    return results
      .filter(r => !swipedIds.includes(r.profiles.userId))
      .map(r => ({ ...r.profiles, user: r.users }));
  }

  async getConversations(userId: number): Promise<{ user: User; lastMessage: Message | null; unreadCount: number }[]> {
    // Get all users who have exchanged messages with the current user
    const conversationUsers = await db
      .selectDistinct({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
      .from(users)
      .innerJoin(messages, 
        sql`(${messages.senderId} = ${userId} AND ${messages.receiverId} = ${users.id}) OR 
            (${messages.receiverId} = ${userId} AND ${messages.senderId} = ${users.id})`
      )
      .where(ne(users.id, userId));

    const conversations = [];
    for (const user of conversationUsers) {
      // Get last message
      const [lastMessage] = await db
        .select()
        .from(messages)
        .where(
          sql`(${messages.senderId} = ${userId} AND ${messages.receiverId} = ${user.id}) OR 
              (${messages.receiverId} = ${userId} AND ${messages.senderId} = ${user.id})`
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Get unread count
      const [unreadResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.receiverId, userId),
            eq(messages.senderId, user.id),
            eq(messages.read, false)
          )
        );

      conversations.push({
        user: user,
        lastMessage: lastMessage || null,
        unreadCount: unreadResult?.count || 0
      });
    }

    return conversations;
  }

  async getMessages(user1Id: number, user2Id: number): Promise<(Message & { sender: User; receiver: User })[]> {
    const results = await db
      .select({
        message: messages,
        sender: { id: sql`sender.id`, name: sql`sender.name`, email: sql`sender.email`, createdAt: sql`sender.created_at` },
        receiver: { id: sql`receiver.id`, name: sql`receiver.name`, email: sql`receiver.email`, createdAt: sql`receiver.created_at` }
      })
      .from(messages)
      .innerJoin(sql`${users} as sender`, sql`sender.id = ${messages.senderId}`)
      .innerJoin(sql`${users} as receiver`, sql`receiver.id = ${messages.receiverId}`)
      .where(
        sql`(${messages.senderId} = ${user1Id} AND ${messages.receiverId} = ${user2Id}) OR 
            (${messages.receiverId} = ${user1Id} AND ${messages.senderId} = ${user2Id})`
      )
      .orderBy(messages.createdAt);

    return results.map(r => ({
      ...r.message,
      sender: r.sender as User,
      receiver: r.receiver as User
    }));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, messageId));
  }

  async getUserMatches(userId: number): Promise<(Profile & { user: User })[]> {
    const matchResults = await db
      .select()
      .from(matches)
      .where(
        and(
          sql`(${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId})`,
          eq(matches.isMatch, true)
        )
      );

    const matchedUserIds = matchResults.map(m => 
      m.user1Id === userId ? m.user2Id : m.user1Id
    );

    if (matchedUserIds.length === 0) return [];

    const results = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(sql`${profiles.userId} IN (${matchedUserIds.join(',')})`);

    return results.map(r => ({ ...r.profiles, user: r.users }));
  }

  async getItinerariesByUser(userId: number): Promise<Itinerary[]> {
    return db.select().from(itineraries).where(eq(itineraries.userId, userId));
  }

  async createItinerary(data: InsertItinerary): Promise<Itinerary> {
    const [newItinerary] = await db.insert(itineraries).values(data).returning();
    return newItinerary;
  }

  async updateItinerary(id: number, data: Partial<InsertItinerary>): Promise<Itinerary> {
    const [updatedItinerary] = await db.update(itineraries).set(data).where(eq(itineraries.id, id)).returning();
    return updatedItinerary;
  }

  async deleteItinerary(id: number): Promise<Itinerary> {
    const [deletedItinerary] = await db.delete(itineraries).where(eq(itineraries.id, id)).returning();
    return deletedItinerary;
  }

  async getTourGuides({ location, specialty }: { location?: string; specialty?: string }) {
    let query = db.select().from(tourGuides);
    if (location) {
      query = query.where(tourGuides.location.ilike(`%${location}%`));
    }
    if (specialty) {
      query = query.where(tourGuides.specialties.contains([specialty]));
    }
    return query;
  }

  async getMyTourGuides(userId: number) {
    return db.select().from(tourGuides).where(tourGuides.userId.eq(userId));
  }

  async createTourGuide(data: InsertTourGuide) {
    return db.insert(tourGuides).values(data).returning();
  }

  async updateTourGuide(id: number, data: Partial<InsertTourGuide>) {
    return db.update(tourGuides).set(data).where(tourGuides.id.eq(id)).returning();
  }

  async deleteTourGuide(id: number) {
    return db.delete(tourGuides).where(tourGuides.id.eq(id)).returning();
  }
}

export const storage = new DatabaseStorage();
