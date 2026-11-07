/**
 * Primary navigation — plan §2 "Primary Navigation".
 *
 * Kept in its own module (not alongside the component) so fast-refresh stays
 * valid, and so the footer, sitemap and nav all read from one source.
 *
 * Core sections plus direct discovery links for SIP Tracking and Search.
 * These public modules must be visible in the primary navigation, not only
 * discoverable through the footer or contextual detail-page links.
 *
 * `label` is the English source string; `i18nKey` resolves to a Telugu
 * translation where one is approved (see src/i18n/te.js for coverage).
 */
export const PRIMARY_NAV = [
  { to: '/', label: 'Home', i18nKey: 'nav.home', end: true },
  { to: '/about', label: 'About PM SETU', i18nKey: 'nav.about' },
  { to: '/governance', label: 'Governance', i18nKey: 'nav.governance' },
  { to: '/clusters', label: 'AP Clusters', i18nKey: 'nav.clusters' },
  { to: '/industry-partners', label: 'Industry Partners / AIPs', i18nKey: 'nav.aips' },
  { to: '/spvs', label: 'SPVs', i18nKey: 'nav.spvs' },
  { to: '/documents', label: 'GOs & Documents', i18nKey: 'nav.documents' },
  { to: '/dashboard', label: 'Dashboard', i18nKey: 'nav.dashboard' },
  { to: '/news', label: 'News & Gallery', i18nKey: 'nav.news' },
  { to: '/contact', label: 'Contact', i18nKey: 'nav.contact' },
  { to: '/sips', label: 'SIP Tracking' },
  { to: '/search', label: 'Search' },
]

/** Footer / sitemap links that sit outside the primary bar. */
export const SECONDARY_NAV = [
  { to: '/gallery', label: 'Gallery' },
  { to: '/sips', label: 'Strategic Investment Plans (SIP)' },
  { to: '/search', label: 'Search' },
]
