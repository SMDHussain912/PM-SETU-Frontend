import { createContext, useContext } from 'react'

/**
 * Accessibility + localisation preferences (plan §26 / §19).
 *
 * The utility bar in the old header rendered A−/A/A+, a contrast toggle and a
 * language select that had no handlers at all. The provider applies these as
 * data-attributes on <html> so CSS reacts without re-rendering the tree:
 *
 *   data-font-scale  'sm' | 'base' | 'lg'   → scales the root font size
 *   data-contrast    'normal' | 'high'      → high-contrast theme
 *   data-lang        'en' | 'te'            → language of the UI chrome
 *   data-theme       set only when the user overrides the OS preference
 *
 * This module holds only the context, constants and hook. The provider
 * component lives in PrefsProvider.jsx so fast-refresh stays valid.
 */

export const PrefsContext = createContext(null)

export const FONT_SCALES = ['sm', 'base', 'lg']
export const FONT_SCALE_LABELS = { sm: 'A-', base: 'A', lg: 'A+' }

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
]

export const PREFS_STORAGE_KEY = 'pmsetu.prefs'

export const PREFS_DEFAULTS = {
  fontScale: 'base',
  contrast: 'normal',
  lang: 'en',
  /** null = follow the operating system */
  theme: null,
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) {
    throw new Error('usePrefs must be used inside <PrefsProvider>')
  }
  return ctx
}
