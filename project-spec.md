# Smart Campus Marketplace — Project Spec
 
## Overview
A web app for BCA students to buy and sell used books,
electronics, and lab equipment within campus.
 
## Tech Stack
- Frontend: Next.js 14 (App Router) + Tailwind CSS
- Database & Auth: Supabase (Postgres, Row Level Security)
- Hosting: Vercel
 
## Data Model
 
### profiles
- id (uuid, primary key, references auth.users)
- full_name (text)
- roll_number (text)
- created_at (timestamp, default now())
 
### listings
- id (uuid, primary key, default generated)
- seller_id (uuid, references profiles.id)
- title (text)
- description (text)
- price (numeric)
- category (text) — one of: Books, Electronics, Lab Equipment
- image_url (text, nullable)
- created_at (timestamp, default now())
 
## Security Rules
- Row Level Security enabled on both tables.
- Any authenticated user can SELECT from listings.
- A user can INSERT/UPDATE/DELETE only rows where
  seller_id = auth.uid().
 
## Pages
1. Home (/) — grid of listings pulled from Supabase,
   mobile-first responsive layout.
2. Sell (/sell) — form to create a new listing (title,
   description, price, category, image upload), inserts
   into listings, redirects to home on success.
 
## Build Phases (build and verify in this order)
1. Scaffold the Next.js + Tailwind app and homepage
   with placeholder/dummy data.
2. Create the Supabase tables and RLS policies exactly
   as specified above.
3. Wire the homepage to real Supabase data and build
   the /sell form.
4. Deploy to Vercel and return the live production URL.
 
## Out of Scope (for this build)
- Payments / checkout
- Full login/authentication flow (optional bonus)
- AI-powered semantic search (optional bonus)
