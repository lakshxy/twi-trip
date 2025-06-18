import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, insertPropertySchema, insertRideSchema, insertMessageSchema, insertSwipeSchema, insertPropertyInterestSchema, insertRideRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ email, name });
      }
      
      // Store user session
      (req.session as any).userId = user.id;
      res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/auth/demo-login", async (req, res) => {
    try {
      // Create or get demo user
      const demoEmail = "demo@travelswipe.com";
      let user = await storage.getUserByEmail(demoEmail);
      
      if (!user) {
        // Create demo user
        user = await storage.createUser({ 
          email: demoEmail, 
          name: "Demo Explorer" 
        });
      }

      // Store user session
      (req.session as any).userId = user.id;
      res.json({ user });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "Demo login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const profile = await storage.getProfileWithUser(userId);
      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const profileData = insertProfileSchema.parse({ ...req.body, userId });
      
      const existingProfile = await storage.getProfile(userId);
      let profile;
      
      if (existingProfile) {
        profile = await storage.updateProfile(userId, profileData);
      } else {
        profile = await storage.createProfile(profileData);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Create/Update profile error:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Swipe routes
  app.get("/api/swipe/profiles", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const profiles = await storage.getSwipeableProfiles(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Get swipeable profiles error:", error);
      res.status(500).json({ message: "Failed to get profiles" });
    }
  });

  app.post("/api/swipe", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const swipeData = insertSwipeSchema.parse({ ...req.body, swiperId: userId });
      const swipe = await storage.createSwipe(swipeData);
      
      // Check for match if it's a like
      let isMatch = false;
      if (swipeData.action === 'like') {
        isMatch = await storage.checkMatch(userId, swipeData.swipedId);
      }
      
      res.json({ swipe, isMatch });
    } catch (error) {
      console.error("Swipe error:", error);
      res.status(500).json({ message: "Failed to process swipe" });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ message: "Failed to get properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const propertyData = insertPropertySchema.parse({ ...req.body, hostId: userId });
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error("Create property error:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.post("/api/properties/:id/interest", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const propertyId = parseInt(req.params.id);
      const interestData = insertPropertyInterestSchema.parse({ userId, propertyId });
      const interest = await storage.showPropertyInterest(interestData);
      res.json(interest);
    } catch (error) {
      console.error("Show property interest error:", error);
      res.status(500).json({ message: "Failed to show interest" });
    }
  });

  // Ride routes
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.getRides();
      res.json(rides);
    } catch (error) {
      console.error("Get rides error:", error);
      res.status(500).json({ message: "Failed to get rides" });
    }
  });

  app.post("/api/rides", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const rideData = insertRideSchema.parse({ ...req.body, driverId: userId });
      const ride = await storage.createRide(rideData);
      res.json(ride);
    } catch (error) {
      console.error("Create ride error:", error);
      res.status(500).json({ message: "Failed to create ride" });
    }
  });

  app.post("/api/rides/:id/request", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const rideId = parseInt(req.params.id);
      const requestData = insertRideRequestSchema.parse({ userId, rideId });
      const request = await storage.requestRideJoin(requestData);
      res.json(request);
    } catch (error) {
      console.error("Request ride join error:", error);
      res.status(500).json({ message: "Failed to request ride join" });
    }
  });

  // Message routes
  app.get("/api/conversations", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const currentUserId = (req.session as any)?.userId;
      if (!currentUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const otherUserId = parseInt(req.params.userId);
      const messages = await storage.getMessages(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const messageData = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Get matches error:", error);
      res.status(500).json({ message: "Failed to get matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
