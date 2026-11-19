# VANTA PRODUCTION — SETUP & DEPLOYMENT GUIDE

Welcome to **VANTA PRODUCTION**, an interconnected creative production ecosystem built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase / PostgreSQL with Row Level Security (RLS).

---

## 1. QUICK START (DEVELOPMENT)

The project is pre-configured and verified to build cleanly across all 38 static and dynamic routes.

To start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. DATABASE CONFIGURATION (SUPABASE)

Your Supabase project is already provisioned and connected via `.env.local`:
- **Project URL:** `https://yslpywcxgtnssaaynzug.supabase.co`
- **Publishable Key:** `sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH`
- **Database Password:** `vantaneverdies`

### Step 1: Run the Database Migration
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard/project/yslpywcxgtnssaaynzug).
2. Navigate to the **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Open the file `supabase/schema.sql` in this repository, copy its entire contents, and paste it into the Supabase SQL Editor.
5. Click **Run**. This creates:
   - All relational tables (`profiles`, `departments`, `organizational_positions`, `roles`, `permissions`, `portfolio_items`, `artist_profiles`, `applications`, `invitations`, `creators`, `services`, `homepage_config`, `audit_logs`).
   - The **Founder Protection Trigger** (`protect_founder_account()`) ensuring the founder account cannot be demoted or deleted.
   - Row Level Security (RLS) policies for public and authenticated data.

### Step 2: Seed Initial Production Data
1. In the Supabase **SQL Editor**, click **New Query**.
2. Open `supabase/seed.sql`, copy its entire contents, and click **Run**.
3. This seeds:
   - 8 core production departments.
   - 15 organizational hierarchy levels.
   - 6 production service offerings.
   - Initial homepage floating artwork and copy settings.

---

## 3. FIREBASE SETUP (OPTIONAL / HYBRID COMPONENT)

If you wish to use Firebase alongside Supabase (for example, for Cloud Storage or alternate auth):

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project called `vanta-production`.
3. In **Project settings** > **General**, click the **Web icon** (`</>`) to register a web application.
4. Copy the Firebase config object:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
5. Add these variables to `.env.local` if utilizing Firebase Storage.

---

## 4. DEPLOYMENT TO VERCEL

To deploy Vanta Production to production on Vercel:

### Method A: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link your project and deploy.

### Method B: Via Vercel Dashboard (Git)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `VantaProduction` repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://yslpywcxgtnssaaynzug.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH`
   - `NEXT_PUBLIC_SITE_URL`: `https://your-production-domain.com`
5. Click **Deploy**. Vercel will automatically build all 38 routes and deploy your production platform.

---

## 5. PLATFORM ARCHITECTURE & DEFAULT ROLES

### Built-in Quick Role Switcher
In the navigation bar (or on the `/login` page), you can test any role instantly with one click:
- **Founder & Supreme Admin:** `smiikogod` (Level 1 Founder - Full authority over all systems)
- **Executive Director:** `neonthedev` (Level 3 Executive - High-level management)
- **Department Head:** `mrtrident` (Level 5 Head of Thumbnail Design)
- **Creative Artist:** `hyperion` (Level 13 Senior Video Editor)

### Key Routes
#### Public Website
- `/`: Hero with cursor-reactive Floating Artwork, Selected Work, Featured Artists, Creators, Services.
- `/work`: Complete verified portfolio archive with category filters and modal viewer.
- `/artists`: Public talent directory with availability badges.
- `/artists/[username]`: Customizable public artist portfolio (Grid / Masonry / Editorial layout, Dark/Light modes).
- `/creators`: Verified creator showcase.
- `/services`: Production service offerings with commission inquiry form.
- `/about`: Manifesto, culture, and interactive organizational hierarchy tree.
- `/apply`: Public artist application form (Method B onboarding).
- `/login`: Private authentication portal.
- `/invite/accept`: Token onboarding verification (Method A onboarding).

#### Artist Workspace (`/dashboard`)
- `/dashboard`: Metrics, pending reviews, assigned tasks, and notifications.
- `/dashboard/portfolio`: Manage artwork, submit drafts, view curator revision notes.
- `/dashboard/upload`: Submit new 4K deliverables with live card preview.
- `/dashboard/profile`: Edit bio, specialty, availability status, and social links.
- `/dashboard/appearance`: Live Appearance Studio (theme mode, layout mode, public visibility).
- `/dashboard/notifications`: Moderation feedback and announcements.
- `/dashboard/settings`: Account credentials.

#### Admin Dashboard (`/admin`)
- `/admin`: Executive overview and real-time audit feed.
- `/admin/organization`: Visual Org Chart with interactive promotion/transfer manager.
- `/admin/staff`: Staff directory with position appointments and reporting lines.
- `/admin/departments`: Create, edit, and isolate departmental scopes.
- `/admin/roles`: Custom Role Builder with 12-category granular permissions and scopes.
- `/admin/permissions`: Full access matrix reference.
- `/admin/artists`: Roster management and homepage feature toggles.
- `/admin/portfolio`: Moderation queue (approve, reject, request revisions, toggle floating hero).
- `/admin/applications`: Review applicant submissions and auto-issue invitations.
- `/admin/invitations`: Generate tokenized invitations.
- `/admin/projects`: Production pipelines and task assignments.
- `/admin/creators`: Creator partner CMS.
- `/admin/services`: Services CMS.
- `/admin/homepage`: Dynamic Homepage CMS (headline, floating artwork physics and speed, section toggles).
- `/admin/notifications`: Broadcast global, department, or team notices.
- `/admin/reports`: Operational reports and quality analytics.
- `/admin/audit-logs`: Immutable chronological security trail.
- `/admin/settings`: Founder Ownership Protection enforcement and maintenance controls.
