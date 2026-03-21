import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROLE_HIERARCHY } from './constants';

/**
 * Merge Tailwind classes safely (clsx + twMerge)
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * Check if a user has at least the required role level
 */
export const hasRole = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};

/**
 * Check if a user has exactly one of the provided roles
 */
export const hasAnyRole = (userRole, roles = []) => roles.includes(userRole);

/**
 * Generate a unique ID
 */
export const generateId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * Deep clone an object
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Debounce a function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Sleep for a given number of milliseconds
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely parse JSON (return null on failure)
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

/**
 * Get query string from an object
 */
export const toQueryString = (params) => {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
};

/**
 * Pick specific keys from an object
 */
export const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

/**
 * Omit specific keys from an object
 */
export const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

/**
 * Group an array of objects by a key
 */
export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

/**
 * Sort an array of objects by a key
 */
export const sortBy = (arr, key, dir = 'asc') => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calculate percentage change between two numbers
 */
export const percentChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get color for status badge
 */
export const getStatusColor = (status) => {
  const map = {
    active: '#22c55e',
    inactive: '#94a3b8',
    pending: '#f59e0b',
    suspended: '#ef4444',
    expired: '#ef4444',
    cancelled: '#94a3b8',
  };
  return map[status] || '#94a3b8';
};

/**
 * Check if current environment is browser
 */
export const isBrowser = () => typeof window !== 'undefined';
