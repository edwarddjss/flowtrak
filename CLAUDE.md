# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `pnpm install` - Install dependencies (project uses pnpm)

## Project Architecture

FlowTrak is a Next.js 14 job application tracker with the following key architectural patterns:

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand store (`src/lib/store/application-store.ts`)
- **Database**: Supabase (PostgreSQL) with TypeScript types
- **Authentication**: Mock auth system (demo mode)
- **Data Visualization**: Nivo charts (Sankey diagrams)

### Core Architecture

**Application State**: Centralized in Zustand store with demo user ID. Applications are managed through `useApplicationStore` with CRUD operations.

**Database Schema**: Applications table with fields: company, position, location, status (applied|interviewing|offer|rejected|accepted), dates, salary, notes, links.

**Route Structure**:
- `/` - Landing page
- `/dashboard` - Main dashboard with applications table
- `/dashboard/applications` - Application management
- `/dashboard/analytics` - Sankey diagram visualization
- `/auth/signin` - Mock authentication (always succeeds)

**Component Architecture**:
- `src/components/ui/` - Reusable shadcn/ui components
- `src/components/dashboard/` - Dashboard-specific components  
- `src/components/` - Feature components (tables, forms, dialogs)

**Data Flow**: Uses React Query for server state, Zustand for client state, and Supabase clients for database operations.

### Key Files

- `src/lib/store/application-store.ts` - Main application state management
- `src/types/index.ts` - TypeScript definitions for Application types
- `src/lib/supabase.ts` - Database client configuration
- `src/auth.ts` - Mock authentication (returns demo user)
- `middleware.ts` - Pass-through middleware (no auth enforcement)

### Development Notes

The project uses mock authentication in demo mode. All data operations use a fixed "demo-user" ID. TypeScript and ESLint errors are ignored in production builds (see next.config.js).

Uses `@` alias for `src/` directory imports. Tailwind configured with custom design system colors using CSS variables.