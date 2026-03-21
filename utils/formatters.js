/**
 * Utility functions for formatting values across the app.
 */

/**
 * Format a number as currency (USD by default)
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

/**
 * Format a number with commas (e.g., 1000 -> "1,000")
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a percentage value
 */
export const formatPercent = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

/**
 * Capitalize the first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format a phone number (basic formatting)
 */
export const formatPhone = (phone) => {
  if (!phone) return '—';
  return phone.replace(/(\+\d{1,3})\s?(\d{3})\s?(\d{3})\s?(\d{4})/, '$1 ($2) $3-$4');
};

/**
 * Format a plan price with billing cycle
 */
export const formatPlanPrice = (price, cycle = 'monthly') => {
  return `${formatCurrency(price)}/${cycle === 'monthly' ? 'mo' : 'yr'}`;
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
