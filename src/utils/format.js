const EMPTY = '—';

/** Accepts ISO strings, epoch seconds, epoch ms. Returns null when unusable. */
function toDate(timestamp) {
  if (timestamp === null || timestamp === undefined || timestamp === '') return null;
  if (timestamp instanceof Date) return Number.isNaN(timestamp.getTime()) ? null : timestamp;

  if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
    // Anything below ~1e12 is epoch seconds, not milliseconds.
    const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Previously rendered the literal string "Invalid Date" whenever the backend
 * omitted or malformed a timestamp. Never show that to a user.
 */
export function formatDate(timestamp) {
  const date = toDate(timestamp);
  if (!date) return EMPTY;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp) {
  const date = toDate(timestamp);
  if (!date) return EMPTY;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(timestamp) {
  const date = toDate(timestamp);
  if (!date) return EMPTY;

  const diffMs = Date.now() - date.getTime();

  // Clock skew / future timestamps read better as plain dates than "0m ago".
  if (diffMs < 0) return formatDate(date);
  if (diffMs < 60000) return 'just now';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(date);
}

export function truncate(text, length = 120) {
  if (typeof text !== 'string' || !text) return '';
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return collapsed.length > length ? `${collapsed.slice(0, length).trimEnd()}...` : collapsed;
}

/** Compact numeric display: 1200 -> "1.2k". */
export function formatCompactNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return EMPTY;
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function formatCurrency(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return EMPTY;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}
