import { usePrefs, FONT_SCALE_LABELS, LANGUAGES } from '../../context/prefs-context'
import { useI18n } from '../../hooks/useI18n'
import '../../styles/UtilityBar.css'

/**
 * UtilityBar — the plan §4 "Utility functions" strip.
 *
 * Every control here is now functional (they were decorative before):
 *   Skip to Main Content · A− / A / A+ · high contrast · light-dark · language
 */
const UtilityBar = () => {
  const { t } = useI18n()
  const {
    fontScale,
    setFontScale,
    stepFontScale,
    isHighContrast,
    toggleContrast,
    toggleTheme,
    lang,
    setLang,
  } = usePrefs()

  return (
    <div className="utility-bar">
      <div className="utility-bar__left">
        <span className="utility-bar__gov">{t('util.govIndia')}</span>
      </div>

      <div className="utility-bar__right">
        <a href="#main-content" className="skip-link">
          {t('util.skip')}
        </a>

        <span className="utility-bar__sep" aria-hidden="true">
          |
        </span>

        <div className="utility-bar__group" role="group" aria-label={t('util.textSize')}>
          <button
            type="button"
            className="utility-bar__btn utility-bar__btn--size"
            aria-label={t('util.decreaseText')}
            onClick={() => stepFontScale(-1)}
            disabled={fontScale === 'sm'}
          >
            A-
          </button>
          <button
            type="button"
            className="utility-bar__btn utility-bar__btn--size"
            aria-label={t('util.defaultText')}
            aria-pressed={fontScale === 'base'}
            onClick={() => setFontScale('base')}
            disabled={fontScale === 'base'}
          >
            {FONT_SCALE_LABELS.base}
          </button>
          <button
            type="button"
            className="utility-bar__btn utility-bar__btn--size"
            aria-label={t('util.increaseText')}
            onClick={() => stepFontScale(1)}
            disabled={fontScale === 'lg'}
          >
            A+
          </button>
        </div>

        <span className="utility-bar__sep" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          className="utility-bar__btn"
          aria-label={t('util.contrast')}
          aria-pressed={isHighContrast}
          onClick={toggleContrast}
        >
          <span aria-hidden="true">◐</span>
        </button>

        <button
          type="button"
          className="utility-bar__btn"
          aria-label={t('util.darkMode')}
          onClick={toggleTheme}
        >
          <span aria-hidden="true">☾</span>
        </button>

        <span className="utility-bar__sep" aria-hidden="true">
          |
        </span>

        <label className="visually-hidden" htmlFor="utility-language">
          {t('util.language')}
        </label>
        <select
          id="utility-language"
          className="utility-bar__select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default UtilityBar