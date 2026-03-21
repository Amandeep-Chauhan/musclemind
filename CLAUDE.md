# MuscleMind – Claude Context

This is the **MuscleMind** gym management system frontend. This file gives Claude Code full context about the project so it can assist effectively.

## Project Overview

- **Framework**: Next.js 14 (Pages Router — NOT App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: styled-components v6 + Tailwind CSS (for shadcn/ui)
- **State**: Redux Toolkit (auth, members, plans, trainers, ui slices)
- **Data Fetching**: React Query v5 + Axios
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Design System

All colors are hex-defined in `styles/colorPalette.js`.
Light/dark theme tokens live in `styles/theme.js` — always use `theme.colors.*` in styled-components (never hardcode colors).

## Architecture Rules

1. **Absolute imports** via `@/` prefix (e.g., `import Button from '@/components/common/Button'`)
2. **No TypeScript** — use plain JS with JSDoc comments where helpful
3. **All pages** must be wrapped in `<ProtectedRoute>` and `<MainLayout>`
4. **styled-components** for custom UI; **Tailwind** only for shadcn/ui components
5. **SSR**: styled-components SSR is handled in `pages/_document.js` via `ServerStyleSheet`
6. **Mock data** lives in `data/dummyData.js` — services have real API call commented out beside mock

## Key Files

| File | Purpose |
|---|---|
| `pages/_app.js` | Redux Provider, QueryClientProvider, ThemeProvider |
| `pages/_document.js` | styled-components SSR injection |
| `store/index.js` | Redux store configuration |
| `styles/colorPalette.js` | All brand colors (HEX) |
| `styles/theme.js` | lightTheme / darkTheme token objects |
| `data/dummyData.js` | All mock data for the entire app |
| `utils/constants.js` | ROUTES, ROLES, QUERY_KEYS |
| `utils/helpers.js` | cn(), hasRole(), debounce(), etc. |

## Available Routes

- `/login` — Login page (AuthLayout)
- `/signup` — Signup page (AuthLayout)
- `/dashboard` — KPI dashboard with charts
- `/members` — Member management (table, add/edit)
- `/plans` — Subscription plans (Admin+ only)
- `/trainers` — Trainer directory

## Role Hierarchy (highest to lowest)

```
superadmin → admin → trainer → client
```

Use `hasRole(userRole, requiredRole)` from `utils/helpers.js` to check permissions.
Use `<ProtectedRoute requiredRole={ROLES.ADMIN}>` for page-level role guards.

## Adding New Features

1. Add route constant to `utils/constants.js`
2. Create page in `pages/yournewpage.js`
3. Add service methods in `services/`
4. Add Redux slice in `store/slices/`
5. Create React Query hook in `hooks/`
6. Add nav item to `components/layout/Sidebar.js`

## Running the Project

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # ESLint check
npm run format    # Prettier format
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | alex@musclemind.io | password123 |
| Admin | jordan@musclemind.io | password123 |
| Trainer | sam@musclemind.io | password123 |
