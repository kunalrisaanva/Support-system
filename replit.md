# SupportHub - Customer Support Platform

## Overview

SupportHub is a comprehensive customer support platform built with a modern full-stack architecture. The application provides a dashboard for support agents to manage tickets, customers, and user profiles with a clean, responsive interface.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side navigation
- **Build Tool**: Vite for development and production builds
- **Theme System**: Custom theme provider with light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions
- **API Design**: RESTful API with structured error handling

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with persistent storage
- **Schema**: Shared schema definitions with proper relations between users and activities
- **Migrations**: Drizzle Kit for database schema management
- **Storage**: DatabaseStorage class implementing IStorage interface for all CRUD operations

## Key Components

### Database Schema
- **Users Table**: Stores user profiles with roles, departments, and preferences
- **Activities Table**: Tracks user actions and system events
- **Relationship**: Activities linked to users via foreign key

### API Endpoints
- `GET /api/user` - Fetch current user profile
- `PATCH /api/user` - Update user profile information
- `PATCH /api/user/password` - Update user password
- `GET /api/user/activities` - Fetch user activity history with pagination

### Frontend Pages
- **Dashboard**: Overview with metrics and charts
- **Tickets**: Support ticket management interface
- **Customers**: Customer relationship management
- **Profile**: User profile management with settings
- **Settings**: Application-wide configuration

### UI Components
- **Layout**: Responsive sidebar navigation with mobile support
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Toast-based user feedback system
- **Themes**: Comprehensive theming system with CSS variables

## Data Flow

### User Authentication
Currently uses hardcoded user ID (1) for demo purposes. The system is designed to support proper authentication once implemented.

### State Management
1. Server state managed via TanStack Query
2. Local form state handled by React Hook Form
3. Theme state persisted to localStorage
4. Toast notifications managed through custom hook

### API Communication
1. Client makes HTTP requests to `/api/*` endpoints
2. Server validates requests using Zod schemas
3. Database operations performed via Drizzle ORM
4. Responses include proper error handling and status codes

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Database**: Drizzle ORM with Neon serverless PostgreSQL
- **Validation**: Zod for schema validation
- **HTTP Client**: Native fetch API with custom wrapper
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite development server for frontend with HMR
- tsx for running TypeScript server code
- Database migrations via Drizzle Kit
- Replit integration for cloud development

### Production Build
1. Frontend: Vite builds React app to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Static files served via Express in production
4. Database: PostgreSQL via Neon serverless platform

### Environment Configuration
- Database URL via environment variables
- Development/production mode detection
- Replit-specific tooling integration

## Changelog

Changelog:
- July 07, 2025: Initial setup
- July 07, 2025: Complete SupportHub implementation with all pages and features
  - Added Login, Register, and Forgot Password pages with full form validation
  - Enhanced Dashboard with metrics, recent tickets, team performance, and quick actions
  - Improved Tickets page with realistic ticket data, filtering, and status management
  - Enhanced Customers page with customer cards, avatars, and comprehensive information
  - Fixed Profile page infinite render issue and enhanced functionality
  - Implemented proper routing with authenticated and public layouts
  - Added comprehensive styling with dark mode support
  - Created mobile-responsive design across all pages
- July 07, 2025: Database integration completed
  - Migrated from in-memory storage to PostgreSQL database
  - Created DatabaseStorage class implementing IStorage interface
  - Added proper database relations between users and activities
  - Successfully seeded database with initial demo data
  - All API endpoints now use persistent PostgreSQL storage

## User Preferences

Preferred communication style: Simple, everyday language.