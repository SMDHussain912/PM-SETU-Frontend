/**
 * Display formatters.
 *
 * The most important rule here is PENDING_VALUE. The Home KPI contract
 * (Backend/src/modules/home/home.types.ts) types `trainees` and
 * `industries_engaged` as `number | null` because RoadMap §25 defines no
 * source table or column for them, and the backend comment is explicit:
 * "Do NOT ship with permanent NULLs and do NOT substitute fake numbers."
 *
 * So a null KPI must render as an em dash with an explanation — never 0.
 * Zero is a factual claim ("we have no trainees"); null means "not measured".
 */

export const PENDING_VALUE = '\u2014'
export const PENDING_HINT = 'Data source not yet established by the department'

/**
 * Formats a KPI counter.
 * @param {number|null|undefined} value
 * @returns {string} the number, or an em dash when the source is undefined
 */
export function formatCount(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return PENDING_VALUE
  return new Intl.NumberFormat('en-IN').format(value)
}

/** Same as formatCount but for rupee amounts. */
export function formatCurrencyINR(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return PENDING_VALUE
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

/** True when a KPI has no confirmed data source. */
export const isPending = (value) =>
  value === null || value === undefined || Number.isNaN(value)

/**
 * Formats a date as DD-MM-YYYY, the format plan §6 requires for
 * "Data as on:" lines.
 */
export function formatDate(value) {
  if (!value) return PENDING_VALUE
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return PENDING_VALUE
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${date.getFullYear()}`
}

/** Human-readable enum label: UNDER_FORMATION -> "Under Formation". */
export function formatStatus(value) {
  if (!value) return PENDING_VALUE
  return String(value)
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Fallback for a record with no published title. */
export function orPending(value) {
  return value === null || value === undefined || value === '' ? PENDING_VALUE : value
}

/** Byte size for document downloads. */
export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return PENDING_VALUE
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(1)} ${units[unit]}`
}
