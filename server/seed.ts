import { db } from "./db";
import { users, activities, tickets, chatMessages } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    // Get existing user
    const [user] = await db.select().from(users).where(eq(users.email, "sarah.johnson@company.com"));
    
    if (!user) {
      // Create demo user if doesn't exist
      const [newUser] = await db.insert(users).values({
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
      console.log("✅ Created demo user:", newUser.email);
    } else {
      console.log("✅ Using existing user:", user.email);
    }

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

    // Create demo tickets
    const ticketsData = [
      {
        title: "Payment Processing Issue",
        description: "Customer unable to complete payment for order #12345",
        status: "open",
        priority: "high",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        customerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
        assignedTo: "Sarah Johnson",
      },
      {
        title: "Account Access Problem",
        description: "User cannot log into their account after password reset",
        status: "in-progress",
        priority: "medium",
        customerName: "Emma Davis",
        customerEmail: "emma.davis@example.com",
        customerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        assignedTo: "Sarah Johnson",
      },
      {
        title: "Feature Request - Dark Mode",
        description: "Customer requesting dark mode feature for mobile app",
        status: "open",
        priority: "low",
        customerName: "Michael Chen",
        customerEmail: "michael.chen@example.com",
        customerAvatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        assignedTo: "Sarah Johnson",
      },
    ];

    const createdTickets = [];
    for (const ticket of ticketsData) {
      const [createdTicket] = await db.insert(tickets).values(ticket).returning();
      createdTickets.push(createdTicket);
    }

    console.log("✅ Created demo tickets");

    // Create demo chat messages
    const chatMessagesData = [
      // Messages for ticket 1
      {
        ticketId: createdTickets[0].id,
        senderId: null,
        senderName: "John Smith",
        senderType: "customer",
        message: "Hi, I'm having trouble completing my payment for order #12345. The payment page keeps timing out.",
        isAiSuggestion: false,
      },
      {
        ticketId: createdTickets[0].id,
        senderId: user.id,
        senderName: "Sarah Johnson",
        senderType: "agent",
        message: "Hello John, I'm sorry to hear about this issue. Let me look into your order right away. Can you tell me which payment method you're trying to use?",
        isAiSuggestion: false,
      },
      {
        ticketId: createdTickets[0].id,
        senderId: null,
        senderName: "John Smith",
        senderType: "customer",
        message: "I'm trying to use my Visa credit card ending in 1234. I've tried multiple times but it keeps failing.",
        isAiSuggestion: false,
      },
      
      // Messages for ticket 2
      {
        ticketId: createdTickets[1].id,
        senderId: null,
        senderName: "Emma Davis",
        senderType: "customer",
        message: "I reset my password but still can't log in. It says 'invalid credentials' every time I try.",
        isAiSuggestion: false,
      },
      {
        ticketId: createdTickets[1].id,
        senderId: user.id,
        senderName: "Sarah Johnson",
        senderType: "agent",
        message: "Hi Emma, I can help you with that. Let me check your account status. Can you confirm the email address you're using to log in?",
        isAiSuggestion: false,
      },
    ];

    for (const message of chatMessagesData) {
      await db.insert(chatMessages).values(message);
    }

    console.log("✅ Created demo chat messages");
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