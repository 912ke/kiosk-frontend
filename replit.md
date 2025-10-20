# SimRacing Club Kiosk Application

## Overview

This is a touch-optimized kiosk application for a SimRacing club in Almaty, Kazakhstan. The application enables self-service customer interactions including user registration, deposit management, and booking of racing simulator stations. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express backend with PostgreSQL database support via Drizzle ORM.

The application is designed specifically for kiosk deployment with large touch targets, high contrast dark theme, automatic idle timeouts, and fail-safe navigation patterns to ensure a smooth self-service experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 20, 2025)

Completed full-stack integration of the booking system:
1. **Backend API Implementation** - Created RESTful API endpoints for catalog, hosts, time slots, and booking creation
2. **Frontend API Integration** - Connected all pages to use real API calls instead of mock data
3. **End-to-End Testing** - Verified complete booking flow from hall selection to confirmation
4. **Bug Fix** - Resolved time slot generation issue where midnight end time (00:00) was incorrectly parsed

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, Vite build system, Wouter for routing

**UI Framework**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling

**Design System**: 
- Kiosk-first design with minimum 48x48dp touch targets
- Dark theme optimized for kiosk viewing (high contrast colors)
- 60-second idle timeout with automatic redirect to home screen
- Touch-optimized interactions with generous spacing and large text (18-20px body, 28-36px headings)
- Portrait orientation primary (1080x1920), landscape adaptive

**State Management**: 
- Zustand for client-side state management
- Separate stores for booking (`bookingStore`), client (`clientStore`), deposit (`depositStore`), and UI state (`uiStore`)
- TanStack Query (React Query) for server state management and caching (not actively used yet)

**API Client**: 
- `client/src/lib/api.ts` - Centralized API client with methods for all backend endpoints
- Handles catalog info, host listings, slot availability, and booking creation

**Key Features**:
- Registration flow with phone number input and custom numpad
- Deposit management with Kaspi QR payment integration (QR generation ready, payment API pending)
- Multi-step booking flow (hall selection → date/time → slot selection → confirmation) - **FULLY FUNCTIONAL**
- Idle timer component that resets session after 60 seconds of inactivity
- QR code generation for payment processing

**Routing Structure**:
- `/` - Home screen with navigation tiles
- `/register` - User registration
- `/deposit` - Deposit/payment
- `/booking` - Station booking flow (connected to backend APIs)
- `/about` - Club information
- `/success` - Success confirmation page

### Backend Architecture

**Technology Stack**: Express.js with TypeScript, ESM modules

**API Structure**: RESTful endpoints under `/api` prefix (all implemented and tested)
- `GET /api/catalog` - Club information retrieval (returns name, address, currency, services)
- `GET /api/hosts` - Station/host listing with query parameters:
  - `include_offline` (boolean) - Include offline hosts in results
  - `only_groups` (boolean) - Return only one host per group for hall selection
- `GET /api/slots` - Available time slot queries with parameters:
  - `date` (YYYY-MM-DD, required) - Date for slot availability
  - `start` (HH:mm) - Start time for slot range (default: 12:00)
  - `end` (HH:mm) - End time for slot range (default: 00:00, treated as 24:00)
  - `duration_minutes` (number) - Booking duration (default: 60)
  - `step_minutes` (number) - Time step between slots (default: 30)
  - `count` (number) - Number of simulators needed (default: 1)
- `POST /api/book` - Booking creation with validation via Zod schemas

**Data Layer**: 
- Storage abstraction pattern via `IStorage` interface in `server/storage.ts`
- In-memory storage implementation (`MemStorage`) currently active with sample data:
  - 15 hosts across 2 halls ("Главный зал" with 10 rigs, "VIP зал" with 5 rigs)
  - Automatic slot availability calculation based on existing bookings
- Designed for PostgreSQL migration via Drizzle ORM (schema defined in `shared/schema.ts`)

**Session Management**: Session handling prepared with `connect-pg-simple` for PostgreSQL-backed sessions

**Development Features**:
- Request/response logging with timing information
- Vite integration for HMR in development
- Static file serving in production

### Data Storage

**Database**: PostgreSQL via Neon serverless driver

**ORM**: Drizzle ORM with type-safe schema definitions

**Schema Design**:

1. **Hosts Table** - Racing simulator stations
   - `id` (auto-increment primary key)
   - `name` (station identifier)
   - `groupId`, `groupName` (logical grouping, e.g., "Main Hall", "VIP Hall")
   - `online` (availability status)

2. **Bookings Table** - Customer reservations
   - `id` (auto-increment primary key)
   - `hosts` (text/JSON array of host IDs)
   - `from`, `to` (timestamp range)
   - `status` (booking state)
   - `comment` (optional notes)
   - `clientPhone`, `clientName` (customer information)
   - `createdAt` (timestamp)

**Migration Strategy**: Drizzle Kit configured for schema migrations to `./migrations` directory

**Data Access Patterns**:
- Time slot availability calculation based on existing bookings
- Group-based host filtering for hall selection
- Date range queries for booking retrieval

### External Dependencies

**Payment Processing**: 
- Kaspi QR payment integration planned (QR code generation implemented client-side)
- Payment invoice creation and status tracking via deposit store

**UI Component Library**:
- shadcn/ui (comprehensive set of 30+ Radix UI-based components)
- Radix UI primitives for accessibility and behavior
- Lucide React for iconography

**Utilities**:
- `qrcode` library for QR code generation
- `date-fns` and `dayjs` for date manipulation
- `zod` for runtime schema validation
- `react-hook-form` with resolvers for form management

**Build & Development**:
- Vite for fast development and optimized production builds
- Replit-specific plugins for runtime error overlay and development tools
- esbuild for server bundling

**Development Dependencies**:
- TypeScript for type safety
- Tailwind CSS with PostCSS for styling
- ESLint and type checking configured

**Database**:
- Neon PostgreSQL serverless database
- Connection via `@neondatabase/serverless` driver
- Session storage via `connect-pg-simple`