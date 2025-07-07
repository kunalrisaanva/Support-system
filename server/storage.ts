import { users, activities, type User, type InsertUser, type UpdateUser, type Activity, type InsertActivity } from "@shared/schema";

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
      ...insertUser,
      id,
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
      ...activity,
      id,
      createdAt: now,
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
