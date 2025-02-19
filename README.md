# FlowTrak

FlowTrak is a modern web application for tracking job applications and managing your job search process. Built with Next.js 14, Supabase, and OpenAI, it provides a beautiful and intuitive interface to help you stay organized during your job search.

## Features

- **Application Tracking**: Keep track of all your job applications in one place
- **Visual Analytics**: View your application flow through an interactive Sankey diagram
- **Status Management**: Track applications through different stages (Applied, OA, Interview, Offer, Rejected)
- **Rich Data Storage**: Save important details like company, position, location, salary, and notes
- **AI-Powered Features**:
  - Interview Question Generation
  - Mock Interview Practice
  - Performance Analysis
  - Personalized Feedback
- **Modern UI**: Clean, responsive interface with dark mode support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: OpenAI GPT-4
- **Data Visualization**: Nivo
- **Deployment**: Vercel

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account and project
- OpenAI API key

## Environment Setup

1. Create a `.env.local` file in the root directory with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables in Supabase:

### Applications Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `company`: String (Required)
- `position`: String (Required)
- `location`: String (Required)
- `status`: Enum ('applied', 'oa', 'interview', 'offer', 'rejected')
- `applied_date`: Timestamp
- `interview_date`: Timestamp (Optional)
- `salary`: Numeric (Optional)
- `link`: String (Optional)
- `notes`: Text (Optional)
- `previous_status`: String (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Profiles Table
- `id`: UUID (Primary Key, matches auth.users)
- `username`: String
- `avatar_id`: String (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Interview Questions Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `question`: Text
- `answer`: Text
- `feedback`: Text
- `created_at`: Timestamp

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities and helpers
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom React hooks
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Test thoroughly
4. Push your changes
5. Deploy to production via Vercel

## Production Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables:
   - Supabase credentials
   - OpenAI API key
3. Deploy

## Maintenance

- Keep dependencies updated regularly
- Monitor Supabase usage and limits
- Monitor OpenAI API usage and costs
- Back up database periodically
- Check Vercel analytics for performance issues

## Support

For any issues or questions, please contact the development team.
