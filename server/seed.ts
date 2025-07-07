import { db } from "./db";
import { users, activities } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    // Create demo user
    const [user] = await db.insert(users).values({
      fullName: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      password: "password123",
      role: "support-agent",
      department: "customer-support",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      darkMode: false,
      language: "en",
      emailNotifications: true,
    }).returning();

    console.log("✅ Created demo user:", user.email);

    // Create demo activities
    const activitiesData = [
      {
        userId: user.id,
        type: "success",
        title: "Profile updated successfully",
        description: "Changed email address and phone number",
      },
      {
        userId: user.id,
        type: "warning", 
        title: "Password changed",
        description: "Successfully updated account password",
      },
      {
        userId: user.id,
        type: "info",
        title: "Logged in from new device",
        description: "Chrome on MacOS from San Francisco, CA",
      },
    ];

    for (const activity of activitiesData) {
      await db.insert(activities).values(activity);
    }

    console.log("✅ Created demo activities");
    console.log("🎉 Database seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Run the seed function if this file is executed directly
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });