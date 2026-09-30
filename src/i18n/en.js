/**
 * English strings — the source of truth for the interface.
 *
 * §19 requires English / Telugu localisation. This file is the single place
 * interface text lives; content that comes from the API (cluster names, news,
 * documents) is never translated here — the department publishes it.
 */
export const en = {
  // utility bar
  'util.govIndia': 'Government of India',
  'util.govAp': 'Government of Andhra Pradesh',
  'util.skip': 'Skip to Main Content',
  'util.textSize': 'Text size',
  'util.decreaseText': 'Decrease text size',
  'util.defaultText': 'Default text size',
  'util.increaseText': 'Increase text size',
  'util.contrast': 'Toggle high contrast',
  'util.darkMode': 'Toggle dark mode',
  'util.language': 'Language',

  // header
  'header.ministry': 'Ministry of Skill Development & Entrepreneurship',
  'header.scheme': 'PM SETU – Andhra Pradesh',
  // §4 spells out the full scheme name. The previous build showed
  // "Pradhan Mantri – Seva Setu", which is neither the PDF wording nor the
  // PM SETU acronym, so it was wrong in both directions.
  'header.schemeFull':
    'Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs',
  // ⚠ D7 — per §4 of the approved PDF this reads "Department of Employment &
  // Training". The previous build used "Dept. of Skill Development, IT &
  // Innovation". Following the PDF as instructed; CONFIRM WITH THE DEPARTMENT
  // before go-live, because a wrong ministry name on a government identity
  // banner is a visible compliance error. Revert here if the current name wins.
  'header.ministryAp': 'Department of Employment & Training',

  // navigation
  'nav.home': 'Home',
  'nav.about': 'About PM SETU',
  'nav.governance': 'Governance',
  'nav.clusters': 'AP Clusters',
  'nav.aips': 'Industry Partners / AIPs',
  'nav.spvs': 'SPVs',
  'nav.documents': 'GOs & Documents',
  'nav.dashboard': 'Dashboard',
  'nav.news': 'News & Gallery',
  'nav.contact': 'Contact',

  // footer
  'footer.quickLinks': 'Quick Links',
  'footer.policies': 'Policies',
  'footer.contact': 'Contact',
  'footer.tagline':
    'Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs.',
  'footer.rights': 'All rights reserved.',

  // common
  'common.viewAll': 'View all',
  'common.loading': 'Loading…',
  'common.retry': 'Try again',
  'common.search': 'Search',
  'common.apply': 'Apply',
  'common.clear': 'Clear',
  'common.previous': 'Previous',
  'common.next': 'Next',
  'common.page': 'Page',
  'common.of': 'of',
  'common.showing': 'Showing',
  'common.noRecords': 'No records available',
  'common.back': 'Back to',
  'common.sitemap': 'Sitemap',
  'common.results': 'results for',
  'common.result': 'result for',
  'common.pendingSource': 'Data source not yet established by the department',
  'common.noDataSource': 'no data source yet',

  // async states
  'state.errorTitle': 'Unable to load this information',
  'state.offline':
    'We could not reach the PM SETU service. Please check your connection and try again.',
  'state.timeout': 'The PM SETU service took too long to respond. Please try again.',
  'state.notFoundTitle': 'Page not found',

  // contact form
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.subject': 'Subject',
  'contact.message': 'Message',
  'contact.send': 'Send message',
  'contact.sending': 'Sending…',
  'contact.thanks': 'Thank you',
  'contact.successBody':
    'Your message has been received by the PM SETU Cell. A reply will be sent to the email address you provided.',

  // policies
  'policy.accessibility': 'Accessibility Statement',
  'policy.privacy': 'Privacy Policy',
  'policy.terms': 'Terms of Use',
  'policy.copyright': 'Copyright Policy',
  'policy.hyperlink': 'Hyperlink Policy',
  'policy.content': 'Content Contribution / Review Policy',
}

export default en
