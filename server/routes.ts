import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateUserSchema, updatePasswordSchema, insertTicketSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { generateChatSuggestions } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (using hardcoded ID for demo)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user profile
  app.patch("/api/user", async (req, res) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUser(1, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create activity
      await storage.createActivity({
        userId: 1,
        type: "success",
        title: "Profile updated successfully",
        description: "Updated profile information",
      });

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user password
  app.patch("/api/user/password", async (req, res) => {
    try {
      const validatedData = updatePasswordSchema.parse(req.body);
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real app, you'd verify the current password
      if (user.password !== validatedData.currentPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const updatedUser = await storage.updateUserPassword(1, validatedData.newPassword);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create activity
      await storage.createActivity({
        userId: 1,
        type: "warning",
        title: "Password changed",
        description: "Successfully updated account password",
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user activities
  app.get("/api/user/activities", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getUserActivities(1, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Ticket routes
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tickets/:id", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat message routes
  app.get("/api/tickets/:id/messages", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(ticketId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tickets/:id/messages", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        ticketId
      });
      const message = await storage.createChatMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI suggestions route
  app.post("/api/tickets/:id/suggestions", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const messages = await storage.getChatMessages(ticketId);
      const suggestions = await generateChatSuggestions(messages, {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority
      });

      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
