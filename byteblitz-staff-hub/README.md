# ByteBlitz Staff Hub

ByteBlitz Staff Hub is a private CRM and resource dashboard built for
commission‑based sales representatives at ByteBlitz, a digital agency
based in Montrose, Scotland.  The hub includes tools for
managing leads, booking meetings, tracking commissions, accessing
resources, and administering users and data.  It offers a
mobile‑friendly dark mode interface with purple highlights to match
ByteBlitz branding.

## Project structure

```
byteblitz-staff-hub/
├── server/                 # Node.js + Express backend
│   ├── app.js             # Entry point for the API server
│   ├── config/
│   │   └── supabase.js    # Initializes Supabase client
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication middleware
│   │   └── role.js        # Role‑based access control (RBAC) middleware
│   ├── routes/
│   │   ├── auth.js        # Register/login endpoints
│   │   ├── leads.js       # Lead CRUD and assignment
│   │   ├── resources.js   # Resource library endpoints
│   │   ├── bookings.js    # Bookings & commissions endpoints
│   │   ├── support.js     # Contact/alerts endpoints
│   │   └── admin.js       # Admin‑only endpoints
│   ├── seed.js            # Script to populate database with mock data
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Template for environment variables
└── client/                # React + Tailwind frontend
    ├── index.html         # HTML template used by Vite
    ├── vite.config.js     # Vite configuration for React
    ├── package.json       # Frontend dependencies
    ├── postcss.config.js  # PostCSS configuration
    ├── tailwind.config.js # Tailwind configuration
    ├── .env.example       # Template for frontend environment variables
    └── src/
        ├── main.jsx       # Application entry point
        ├── App.jsx        # Defines routes and global layout
        ├── index.css      # Tailwind imports and base styles
        ├── context/
        │   └── AuthContext.jsx  # React context for auth state
        ├── utils/
        │   └── api.js     # Helper for making API requests
        ├── components/
        │   ├── Sidebar.jsx      # Left navigation drawer
        │   ├── StatsCard.jsx    # Small card used in Dashboard
        │   ├── LeadsTable.jsx   # Table for displaying leads
        │   ├── ResourceList.jsx # Resource library UI
        │   ├── BookingsTable.jsx# Table for bookings & commissions
        │   ├── SupportForm.jsx  # Contact Elias form
        │   └── AdminPanel.jsx   # Admin management UI
        └── pages/
            ├── Dashboard.jsx    # Dashboard with metrics & announcements
            ├── Leads.jsx        # Leads tab
            ├── Resources.jsx    # Resource library tab
            ├── Bookings.jsx     # Bookings & commissions tab
            ├── Support.jsx      # Support tab
            └── Admin.jsx        # Admin panel tab
```

## Setup instructions

### Prerequisites

* Node.js 18 or later
* npm or yarn
* A [Supabase](https://supabase.com/) project (free tier is sufficient)

### 1. Configure Supabase

1. Sign up for a free Supabase account and create a new project.  Note your
   **Project URL** and **API Key** from the Supabase dashboard.
2. In the **SQL editor**, run the following commands to create the
   necessary tables.  Supabase uses Postgres under the hood, so these
   commands work in the built‑in SQL editor:

```sql
-- Users table: stores sales reps and admin accounts
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('rep','admin')),
  created_at timestamp default now()
);

-- Leads table: tracks lead details and assignment
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  industry text,
  region text,
  quantity integer,
  tags text[],
  notes text,
  status text not null default 'New',
  assigned_to uuid references users(id),
  requested_by uuid references users(id),
  created_at timestamp default now()
);

-- Resources table: stores scripts, PDFs, videos, etc.
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  url text not null,
  created_at timestamp default now()
);

-- Bookings table: tracks confirmed sales
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  client_name text not null,
  meeting_date date not null,
  sale_amount numeric(10,2) not null,
  booking_reference text,
  created_at timestamp default now()
);

-- Commissions table: stores commission calculations and payment status
create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  user_id uuid not null references users(id),
  commission_amount numeric(10,2) not null,
  is_paid boolean default false,
  created_at timestamp default now()
);

-- Messages table: stores announcements from Elias
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamp default now()
);

-- Support requests: messages sent from reps to admin
create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  subject text not null,
  body text not null,
  created_at timestamp default now()
);
```

3. In **Authentication → Policies** within Supabase, disable the default
   email/password auth if you intend to manage authentication
   yourself.  The backend in this project implements its own
   email+password login using bcrypt and JSON Web Tokens (JWT).

### 2. Backend setup

Navigate into the `server` directory and install dependencies:

```bash
cd byteblitz-staff-hub/server
npm install
```

Create a `.env` file based on the provided `.env.example` and fill in
the variables:

```
PORT=4000
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_KEY=<your_supabase_service_role_key>
JWT_SECRET=<any_random_string>
```

> **Note:** use the **service role key** for `SUPABASE_SERVICE_KEY` so that
> the API can perform reads/writes on behalf of authenticated users.

To seed the database with a default admin user and some sample
records, run:

```bash
node seed.js
```

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:4000` (or whatever
`PORT` you specify).  See each route module under
`server/routes/` for available endpoints.

### 3. Frontend setup

Navigate into the `client` directory and install dependencies:

```bash
cd byteblitz-staff-hub/client
npm install
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to point
to your backend:

```
VITE_API_BASE_URL=http://localhost:4000
```

Run the development server:

```bash
npm run dev
```

You can now open the app at `http://localhost:5173` (Vite default
port).  Use the default admin credentials below to log in as an
administrator and explore the features.

### Default admin credentials

During seeding, the following admin account is created:

```
Email: admin@byteblitz.co.uk
Password: admin123
Role: admin
```

Create additional sales reps either through the admin UI or by
inserting rows directly into the database.

## Security considerations

Passwords are hashed with bcrypt before being stored in the database.
The freeCodeCamp tutorial on password hashing notes that `bcrypt.compare`
should be used to verify user passwords against stored hashes【401683945050912†L310-L341】.
Each password is salted and hashed to protect against rainbow table
attacks【401683945050912†L347-L363】.

Authentication is handled using JWTs.  Upon successful login the
server returns a signed token containing the user’s ID and role.  The
frontend stores this token in memory and sends it in the
`Authorization` header (`Bearer <token>`) for subsequent requests.  A
middleware verifies the token on every protected route and attaches
the decoded user information to the request object.  Role‑based
authorization is enforced by checking the user’s role in another
middleware.  Although libraries like Auth0 provide ready‑made role
based access control, this project implements a simpler built‑in
middleware for demonstration purposes.

## Extending the application

This repository is designed to be a starting point.  Additional
features, such as team calendars, CRM integrations, advanced lead
scoring, or unified search across resources, can be added by
implementing new endpoints and React components.  The modular folder
structure makes it easy to grow the codebase over time.
