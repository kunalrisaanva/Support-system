import { users, activities, tickets, chatMessages, type User, type InsertUser, type UpdateUser, type Activity, type InsertActivity, type Ticket, type InsertTicket, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User | undefined>;
  updateUserPassword(id: number, newPassword: string): Promise<User | undefined>;
  
  // Activity operations
  getUserActivities(userId: number, page: number, limit: number): Promise<{ activities: Activity[], total: number }>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket | undefined>;
  
  // Chat message operations
  getChatMessages(ticketId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, Activity>;
  private currentUserId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentActivityId = 1;
    
    // Initialize with sample user
    this.createUser({
      fullName: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      password: "password123",
      role: "support-agent",
      department: "customer-support",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      darkMode: false,
      language: "en",
      emailNotifications: true,
    }).then(user => {
      // Add sample activities
      this.createActivity({
        userId: user.id,
        type: "success",
        title: "Profile updated successfully",
        description: "Changed email address and phone number",
      });
      
      this.createActivity({
        userId: user.id,
        type: "warning",
        title: "Password changed",
        description: "Successfully updated account password",
      });
      
      this.createActivity({
        userId: user.id,
        type: "info",
        title: "Logged in from new device",
        description: "Chrome on MacOS from San Francisco, CA",
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      id,
      fullName: insertUser.fullName,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || "support-agent",
      department: insertUser.department || "customer-support",
      avatar: insertUser.avatar || null,
      darkMode: insertUser.darkMode || false,
      language: insertUser.language || "en",
      emailNotifications: insertUser.emailNotifications || true,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      password: newPassword,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserActivities(userId: number, page: number = 1, limit: number = 10): Promise<{ activities: Activity[], total: number }> {
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    const total = userActivities.length;
    const startIndex = (page - 1) * limit;
    const activities = userActivities.slice(startIndex, startIndex + limit);
    
    return { activities, total };
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const now = new Date();
    const newActivity: Activity = {
      id,
      userId: activity.userId || null,
      type: activity.type,
      title: activity.title,
      description: activity.description || null,
      createdAt: now,
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Ticket operations - stub implementations for MemStorage
  async getTickets(): Promise<Ticket[]> {
    return [];
  }

  async getTicket(id: number): Promise<Ticket | undefined> {
    return undefined;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    throw new Error("MemStorage does not support tickets. Use DatabaseStorage instead.");
  }

  async updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    return undefined;
  }

  // Chat message operations - stub implementations for MemStorage
  async getChatMessages(ticketId: number): Promise<ChatMessage[]> {
    return [];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    throw new Error("MemStorage does not support chat messages. Use DatabaseStorage instead.");
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: newPassword, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getUserActivities(userId: number, page: number = 1, limit: number = 10): Promise<{ activities: Activity[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Get activities for the user
    const userActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(activities)
      .where(eq(activities.userId, userId));

    return { 
      activities: userActivities, 
      total: totalCount 
    };
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db
      .insert(tickets)
      .values(ticket)
      .returning();
    return newTicket;
  }

  async updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const [ticket] = await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket || undefined;
  }

  async getChatMessages(ticketId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.ticketId, ticketId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
