# 💪 MuscleMind — Gym Management System

A modern, full-featured gym management frontend built with Next.js, styled-components, Redux Toolkit, and React Query.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:

| Role        | Email                    | Password    |
|-------------|--------------------------|-------------|
| Super Admin | alex@musclemind.io       | password123 |
| Admin       | jordan@musclemind.io     | password123 |
| Trainer     | sam@musclemind.io        | password123 |

---

## 📁 Folder Structure

```
musclemind/
│
├── pages/                  # Next.js pages (file-based routing)
│   ├── _app.js             # App wrapper: Redux, QueryClient, ThemeProvider
│   ├── _document.js        # SSR-compatible styled-components setup
│   ├── index.js            # Root redirect (login or dashboard)
│   ├── login.js            # Authentication — Login page
│   ├── signup.js           # Authentication — Signup page
│   ├── dashboard.js        # Main dashboard with stats & charts
│   ├── members.js          # Member management (list, add, edit, delete)
│   ├── plans.js            # Subscription plan management (Admin+)
│   └── trainers.js         # Trainer directory and management
│
├── components/             # Reusable UI components
│   ├── common/             # Shared components used across pages
│   │   ├── Button.js       # Variants: primary, secondary, outline, ghost, danger
│   │   ├── Input.js        # Text, password, textarea with icons & validation
│   │   ├── Modal.js        # Portal-based modal with SSR support
│   │   ├── Table.js        # Sortable, paginated data table
│   │   ├── Card.js         # Flexible card component with sub-components
│   │   ├── Badge.js        # Status, plan & custom badges
│   │   └── Skeleton.js     # Shimmer skeleton loaders (card, table, stat)
│   │
│   ├── layout/             # Layout-specific components
│   │   ├── Sidebar.js      # Collapsible sidebar with role-based nav items
│   │   └── Navbar.js       # Top navbar with search, theme toggle, notifications
│   │
│   ├── dashboard/          # Dashboard feature components
│   │   ├── StatsCard.js    # KPI stat card with trend indicator
│   │   ├── RevenueChart.js # Area chart (revenue & profit over time)
│   │   ├── MemberGrowthChart.js # Bar chart (members per month)
│   │   └── RecentActivity.js    # Activity feed
│   │
│   ├── members/            # Member management components
│   │   ├── MemberList.js   # Filterable, sortable member table
│   │   └── MemberForm.js   # Add/edit member modal form
│   │
│   ├── plans/              # Plan management components
│   │   └── PlanCard.js     # Pricing card with feature list & usage bar
│   │
│   ├── trainers/           # Trainer components
│   │   └── TrainerCard.js  # Trainer profile card with stats
│   │
│   └── auth/               # Auth utilities
│       └── ProtectedRoute.js  # HOC for auth & role-based route guards
│
├── layouts/                # Page layout templates
│   ├── MainLayout.js       # Sidebar + Navbar layout for authenticated pages
│   └── AuthLayout.js       # Split-screen layout for login/signup
│
├── store/                  # Redux Toolkit state management
│   ├── index.js            # Store configuration
│   └── slices/
│       ├── authSlice.js    # Auth state: user, token, isAuthenticated
│       ├── membersSlice.js # Members CRUD, filters, pagination
│       ├── plansSlice.js   # Plans CRUD
│       ├── trainersSlice.js # Trainers CRUD, filters
│       └── uiSlice.js      # Theme, sidebar, modals, toasts, notifications
│
├── services/               # API service layer (axios-based)
│   ├── api.js              # Axios instance with auth interceptors
│   ├── authService.js      # Login, signup, logout, getMe
│   ├── membersService.js   # Members CRUD operations
│   ├── plansService.js     # Plans CRUD operations
│   ├── trainersService.js  # Trainers CRUD operations
│   └── dashboardService.js # Dashboard stats & chart data
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.js          # Auth actions + role helpers (isSuperAdmin, can, etc.)
│   ├── useMembers.js       # Member queries & mutations via React Query
│   ├── useDashboard.js     # Dashboard data queries
│   ├── useTheme.js         # Theme toggle + localStorage sync
│   └── useDebounce.js      # Debounce hook for search inputs
│
├── styles/                 # Global styling & design system
│   ├── colorPalette.js     # 🎨 All brand colors in HEX (single source of truth)
│   ├── theme.js            # Light & dark theme tokens
│   ├── GlobalStyles.js     # styled-components global styles + CSS reset
│   └── globals.css         # Tailwind base + Radix UI overrides
│
├── data/
│   └── dummyData.js        # 📦 All mock data: members, trainers, plans, charts
│
├── utils/                  # Pure utility functions
│   ├── constants.js        # App-wide constants: routes, roles, query keys
│   ├── formatters.js       # Date, currency, number, percent formatters
│   └── helpers.js          # cn(), hasRole(), debounce(), groupBy(), etc.
│
├── .babelrc                # Babel config with styled-components SSR plugin
├── .env.local              # Environment variables (copy from .env.example)
├── .env.example            # Example env vars template
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier code formatting rules
├── jsconfig.json           # Absolute imports (@/ aliases)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration (for shadcn/ui)
└── postcss.config.js       # PostCSS configuration
```

---

## 🎨 Design System

### Color Palette (`styles/colorPalette.js`)
All colors are defined as HEX values and organized by category:
- **Primary**: Orange-red brand (`#ff3511`)
- **Accent**: Electric blue (`#0078d4`)
- **Neon**: Success green (`#22c55e`)
- **Gold**: Premium/warning (`#f59e0b`)
- **Dark**: Background grays (`#0f172a` → `#f8fafc`)
- **Gym**: Thematic colors (iron, rubber, energy, etc.)

### Themes (`styles/theme.js`)
Both `lightTheme` and `darkTheme` export structured tokens for:
- Colors (backgrounds, text, borders, brand, sidebar)
- Typography (font families, sizes, weights)
- Spacing, border-radius, shadows, transitions, z-index, breakpoints

---

## 🔐 Role-Based Access Control

| Feature            | Super Admin | Admin | Trainer | Client |
|--------------------|-------------|-------|---------|--------|
| Dashboard          | ✅          | ✅    | ✅      | ✅     |
| View Members       | ✅          | ✅    | ✅      | ❌     |
| Manage Members     | ✅          | ✅    | ❌      | ❌     |
| View Plans         | ✅          | ✅    | ❌      | ❌     |
| Manage Plans       | ✅          | ✅    | ❌      | ❌     |
| View Trainers      | ✅          | ✅    | ✅      | ✅     |
| Manage Trainers    | ✅          | ✅    | ❌      | ❌     |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.x | Framework (Pages Router) |
| React | 18.x | UI Library |
| styled-components | 6.x | CSS-in-JS styling |
| Redux Toolkit | 2.x | Global state management |
| React Query | 5.x | Server state & data fetching |
| Axios | 1.x | HTTP client |
| Recharts | 2.x | Charts & data visualization |
| React Hook Form | 7.x | Form management |
| Tailwind CSS | 3.x | Utility classes (shadcn/ui) |
| Radix UI | Latest | Accessible primitives |
| Lucide React | Latest | Icon library |

---

## 🌙 Light & Dark Mode

Theme is toggled via the moon/sun icon in the navbar. Preference is saved to `localStorage`. The `useTheme` hook handles everything.

```js
import { useTheme } from '@/hooks/useTheme';
const { isDark, toggle } = useTheme();
```

---

## 📡 API Integration

All services in `/services/` currently use mock data with simulated delays. To connect to a real backend, replace mock implementations with the commented-out `api.get(...)` / `api.post(...)` calls.

Set your API base URL in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api/v1
```

---

## 🧩 Adding a New Page

1. Create `pages/yourpage.js`
2. Wrap with `<ProtectedRoute>` and `<MainLayout>`
3. Add route constant to `utils/constants.js`
4. Add nav item to `components/layout/Sidebar.js`

---

*Built with ❤️ for the gym management world.*
