import { useEffect, useMemo, useState } from 'react'
import {
  FONT_SCALES,
  LANGUAGES,
  PREFS_DEFAULTS,
  PREFS_STORAGE_KEY,
  PrefsContext,
} from './prefs-context'

function readStored() {
  if (typeof window === 'undefined') return PREFS_DEFAULTS
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY)
    if (!raw) return PREFS_DEFAULTS
    const parsed = JSON.parse(raw)
    return {
      fontScale: FONT_SCALES.includes(parsed.fontScale)
        ? parsed.fontScale
        : PREFS_DEFAULTS.fontScale,
      contrast: parsed.contrast === 'high' ? 'high' : 'normal',
      lang: LANGUAGES.some((l) => l.code === parsed.lang) ? parsed.lang : 'en',
      theme: ['light', 'dark'].includes(parsed.theme) ? parsed.theme : null,
    }
  } catch {
    return PREFS_DEFAULTS
  }
}

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(readStored)

  useEffect(() => {
    const root = document.documentElement

    root.setAttribute('data-font-scale', prefs.fontScale)
    root.setAttribute('data-contrast', prefs.contrast)
    root.setAttribute('data-lang', prefs.lang)
    root.lang = prefs.lang

    // Only pin the theme when the user chose one; otherwise leave the
    // attribute off so prefers-color-scheme keeps working.
    if (prefs.theme) {
      root.setAttribute('data-theme', prefs.theme)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [prefs])

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      /* storage unavailable (private mode) — preferences stay session-only */
    }
  }, [prefs])

  const value = useMemo(() => {
    const setFontScale = (fontScale) =>
      setPrefs((p) => (FONT_SCALES.includes(fontScale) ? { ...p, fontScale } : p))

    // A− / A+ step through the same ordered scale instead of being dead buttons.
    const stepFontScale = (direction) =>
      setPrefs((p) => {
        const current = FONT_SCALES.indexOf(p.fontScale)
        const next = Math.min(FONT_SCALES.length - 1, Math.max(0, current + direction))
        return { ...p, fontScale: FONT_SCALES[next] }
      })

    const toggleContrast = () =>
      setPrefs((p) => ({ ...p, contrast: p.contrast === 'high' ? 'normal' : 'high' }))

    const toggleTheme = () =>
      setPrefs((p) => {
        const isDark =
          p.theme ??
          (typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
        return { ...p, theme: isDark ? 'light' : 'dark' }
      })

    const setLang = (lang) =>
      setPrefs((p) => (LANGUAGES.some((l) => l.code === lang) ? { ...p, lang } : p))

    return {
      ...prefs,
      isHighContrast: prefs.contrast === 'high',
      setFontScale,
      stepFontScale,
      toggleContrast,
      toggleTheme,
      setLang,
      reset: () => setPrefs(PREFS_DEFAULTS),
    }
  }, [prefs])

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export default PrefsProvider
