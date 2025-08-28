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
    // Add real data seeding here if available
    console.log("Database seeding completed successfully! (no demo data)");

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