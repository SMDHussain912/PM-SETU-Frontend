/**
 * Telugu strings — PARTIAL, pending departmental review.
 *
 * ⚠ COVERAGE (read before assuming the site is fully localised)
 *   This file covers the INTERFACE CHROME ONLY: utility bar, header, primary
 *   navigation, footer headings, common buttons and the async-state labels.
 *
 *   It deliberately does NOT translate:
 *     · page headings and lead paragraphs
 *     · About PM SETU (§7) narrative
 *     · How PM SETU Works (§8) step labels
 *     · governance hierarchy (§14)
 *     · policy page text (§26)
 *     · any API content (cluster / AIP / SPV / news / document text)
 *
 *   Those are government-authored content and must be translated and approved by
 *   the department, not improvised here. A machine translation of an official
 *   scheme document is a compliance risk, so those keys fall back to English
 *   until NIC supplies approved Telugu copy.
 *
 * Any key missing here automatically falls back to the English string (see
 * useI18n), so the portal never renders a raw key like "nav.home".
 */
export const te = {
  // utility bar
  'util.govIndia': 'భారత ప్రభుత్వం',
  'util.govAp': 'ఆంధ్రప్రదేశ్ ప్రభుత్వం',
  'util.skip': 'ప్రధాన విషయానికి వెళ్లండి',
  'util.textSize': 'అక్షర పరిమాణం',
  'util.decreaseText': 'అక్షర పరిమాణం తగ్గించు',
  'util.defaultText': 'సాధారణ అక్షర పరిమాణం',
  'util.increaseText': 'అక్షర పరిమాణం పెంచు',
  'util.contrast': 'అధిక కాంట్రాస్ట్ మార్చు',
  'util.darkMode': 'డార్క్ మోడ్ మార్చు',
  'util.language': 'భాష',

  // header
  'header.ministry': 'నైపుణ్యాభివృద్ధి మరియు వ్యాపారాభివృద్ధి మంత్రిత్వం',
  'header.scheme': 'పీఎం సేతు - ఆంధ్రప్రదేశ్',
  'header.schemeFull': 'ప్రధానమంత్రి – సేవా సేతు',
  'header.ministryAp': 'ఉపాధి మరియు శిక్షణ శాఖ',  // ⚠ D7: matches the English string pending department confirmation

  // navigation
  'nav.home': 'హోమ్',
  'nav.about': 'పీఎం సేతు గురించి',
  'nav.governance': 'పాలన',
  'nav.clusters': 'ఏపీ క్లస్టర్లు',
  'nav.aips': 'పార్ట్నర్లు / ఏఐపీలు',
  'nav.spvs': 'ఎస్‌పీవీలు',
  'nav.documents': 'ప్రభుత్వ ఆర్డర్లు / పత్రాలు',
  'nav.dashboard': 'డాష్‌బోర్డ్',
  'nav.news': 'వార్తలు & గ్యాలరీ',
  'nav.contact': 'సంప్రదించండి',

  // footer
  'footer.quickLinks': 'త్వరిత లింక్‌లు',
  'footer.policies': 'విధానాలు',
  'footer.contact': 'సంప్రదింపులు',
  'footer.rights': 'సర్వ హక్కులు రిజర్వ్డ్.',

  // common
  'common.viewAll': 'అంతా చూడండి',
  'common.loading': 'లోడ్ అవుతోంది…',
  'common.retry': 'మళ్ళీ ప్రయత్నించండి',
  'common.search': 'వెతకండి',
  'common.apply': 'వర్తింపజేయండి',
  'common.clear': 'తొలగించు',
  'common.previous': 'మునుపటి',
  'common.next': 'తదుపరి',
  'common.page': 'పేజీ',
  'common.showing': 'చూపిస్తోంది',
  'common.noRecords': 'రికార్డులు లేవు',
  'common.sitemap': 'సైట్‌మ్యాప్',
  'common.noDataSource': 'మూలం లేదు',
  'common.pendingSource': 'విభాగం ఇంకా మూలం నిర్వచించలేదు',

  // async states
  'state.errorTitle': 'ఈ సమాచారాన్ని లోడ్ చేయలేకపోయాము',
  'state.offline':
    'పీఎం సేతు సేవను చేరుకోలేకపోయాము. దయచేసి మీ కనెక్షన్ తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.',
  'state.timeout': 'పీఎం సేతు సేవ స్పందించడానికి ఎక్కువ సమయం తీసుకుంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
  'state.notFoundTitle': 'పేజీ కనబడడం లేదు',

  // contact form
  'contact.name': 'పేరు',
  'contact.email': 'ఇమెయిల్',
  'contact.subject': 'విషయం',
  'contact.message': 'సందేశం',
  'contact.send': 'సందేశం పంపండి',
  'contact.sending': 'పంపుతోంది…',
  'contact.thanks': 'ధన్యవాదాలు',
}

export default te