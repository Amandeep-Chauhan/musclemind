// ── App ─────────────────────────────────────────────────────────────────────
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MuscleMind';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
export const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'musclemind_token';

// ── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  TRAINER: 'trainer',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  trainer: 'Trainer',
  client: 'Client',
};

// Role hierarchy (higher = more access)
export const ROLE_HIERARCHY = {
  superadmin: 4,
  admin: 3,
  trainer: 2,
  client: 1,
};

// ── Member Status ─────────────────────────────────────────────────────────────
export const MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
};

export const STATUS_COLORS = {
  active: '#22c55e',
  inactive: '#94a3b8',
  pending: '#f59e0b',
  suspended: '#ef4444',
};

// ── Navigation Routes ─────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  PLANS: '/plans',
  TRAINERS: '/trainers',
  LEDGER: '/ledger',
  INVENTORY: '/inventory',
  PAYROLL: '/payroll',
  LEADS: '/leads',
};

// Public routes (no auth required)
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP];

// ── Query Keys ────────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  DASHBOARD_STATS: 'dashboard-stats',
  REVENUE_DATA: 'revenue-data',
  MEMBER_GROWTH: 'member-growth',
  PLAN_DISTRIBUTION: 'plan-distribution',
  RECENT_ACTIVITIES: 'recent-activities',
  WEEKLY_ATTENDANCE: 'weekly-attendance',
  MEMBERS: 'members',
  MEMBER_BY_ID: 'member-by-id',
  PLANS: 'plans',
  PLAN_BY_ID: 'plan-by-id',
  TRAINERS: 'trainers',
  TRAINER_BY_ID: 'trainer-by-id',
  EXPENSES: 'expenses',
  ME: 'me',
};

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// ── Date Formats ──────────────────────────────────────────────────────────────
export const DATE_FORMAT = 'DD MMM, YYYY';
export const DATE_TIME_FORMAT = 'DD MMM, YYYY HH:mm';
export const API_DATE_FORMAT = 'YYYY-MM-DD';

// ── Table columns config ──────────────────────────────────────────────────────
export const MEMBER_TABLE_COLUMNS = [
  { key: 'name', label: 'Member', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'joinDate', label: 'Join Date', sortable: true },
  { key: 'expiryDate', label: 'Expiry', sortable: true },
  { key: 'attendanceRate', label: 'Attendance', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];
