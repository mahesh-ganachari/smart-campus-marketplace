# 🎓 Smart Campus Marketplace

> A peer-to-peer web marketplace for BCA students to **buy and sell used books, electronics, and lab equipment** within campus — fast, verified, and commission-free.

🌐 **Live Demo:** [smart-campus-marketplace-ten.vercel.app](https://smart-campus-marketplace-ten.vercel.app)

---

## 📸 Features

- 🏠 **Home Feed** — Browse all live listings in a responsive grid, pulled in real-time from Supabase
- 🔍 **Search & Filter** — Search by title, description, or seller; filter by category (Books, Electronics, Lab Equipment)
- 📦 **Listing Detail Modal** — Click any card to view full details, seller info, and contact prompt
- ➕ **Sell an Item** — Post a new listing with title, description, price, category, and image (file upload or URL)
- 🎨 **Premium UI** — Glassmorphism navbar, animated hero banner, skeleton loading states, responsive on all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| **Storage** | Supabase Storage (for listing images) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Hosting** | [Vercel](https://vercel.com/) |
| **Language** | TypeScript |

---

## 📂 Project Structure

```
smart-campus-marketplace/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + Tailwind directives
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Home page (listings grid)
│   │   └── sell/
│   │       └── page.tsx         # Sell item form
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky nav with search bar
│   │   ├── Hero.tsx             # Gradient hero banner
│   │   ├── CategoryFilter.tsx   # Category pill buttons
│   │   ├── ListingCard.tsx      # Individual listing card
│   │   ├── ListingModal.tsx     # Full-screen listing detail modal
│   │   └── Footer.tsx           # Site footer
│   ├── lib/
│   │   └── supabaseClient.ts    # Supabase client instance
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Listing, Profile, Category)
│   └── data/
│       └── dummyListings.ts     # Fallback sample data
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema (Supabase)

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, references `auth.users` |
| `full_name` | text | Student's full name |
| `roll_number` | text | BCA roll number (e.g. `23BCA019`) |
| `created_at` | timestamp | Default: `now()` |

### `listings`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `seller_id` | uuid | References `profiles.id` |
| `title` | text | Item title |
| `description` | text | Item description |
| `price` | numeric | Price in ₹ INR |
| `category` | text | One of: `Books`, `Electronics`, `Lab Equipment` |
| `image_url` | text | Nullable — Supabase Storage or external URL |
| `created_at` | timestamp | Default: `now()` |

### Row Level Security
- Any user can **SELECT** from `listings`
- A user can **INSERT / UPDATE / DELETE** only rows where `seller_id = auth.uid()`

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/mahesh-ganachari/smart-campus-marketplace.git
cd smart-campus-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Find these in your Supabase dashboard → **Project Settings → API**

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

This project is deployed on **Vercel** with automatic production builds.

To deploy your own instance:

1. Push to a GitHub repo (already done ✅)
2. Import the project on [vercel.com](https://vercel.com)
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel project settings
4. Deploy!

---

## 📋 Build Phases

- [x] **Phase 1** — Scaffold Next.js + Tailwind app with placeholder data
- [x] **Phase 2** — Create Supabase tables (`profiles`, `listings`) with RLS policies
- [x] **Phase 3** — Wire homepage to real Supabase data; build `/sell` form
- [x] **Phase 4** — Deploy to Vercel → [live URL](https://smart-campus-marketplace-ten.vercel.app)

---

## 🔭 Out of Scope (Future Enhancements)

- 💳 Payments / checkout flow
- 🔐 Full authentication (Supabase Auth login/signup)
- 🤖 AI-powered semantic search for listings

---

## 👤 Author

**Mahesh Ganachari**
- GitHub: [@mahesh-ganachari](https://github.com/mahesh-ganachari)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
