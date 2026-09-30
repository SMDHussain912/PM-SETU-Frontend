import { useCallback, useMemo } from 'react'
import { usePrefs } from '../context/prefs-context'
import en from '../i18n/en'
import te from '../i18n/te'

/**
 * useI18n — English / Telugu localisation (plan §19, §26).
 *
 * The selected language already lives in PrefsContext (the utility bar select
 * drives it and it is persisted), so this hook only resolves strings against
 * the chosen catalogue.
 *
 * CRITICAL: a key missing from the Telugu catalogue falls back to English rather
 * than rendering the raw key. Telugu covers the interface chrome only — the
 * government-authored content (page copy, policy text, API records) stays in
 * English until NIC supplies approved translations. See src/i18n/te.js.
 */

const CATALOGUES = { en, te }

export function useI18n() {
  const { lang } = usePrefs()
  const catalogue = CATALOGUES[lang] || en

  const t = useCallback(
    (key) => {
      if (key in catalogue) return catalogue[key]
      // Fall back through English, then to the key itself for visibility.
      if (key in en) return en[key]
      return key
    },
    [catalogue],
  )

  return useMemo(
    () => ({
      t,
      lang,
      isTelugu: lang === 'te',
      /** Keys still falling back to English in the active language. */
      pendingKeys: Object.keys(en).filter((k) => !(k in catalogue)),
    }),
    [t, lang, catalogue],
  )
}

export default useI18n
