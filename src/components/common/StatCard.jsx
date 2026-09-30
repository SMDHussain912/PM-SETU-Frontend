import { formatCount, isPending, PENDING_HINT } from '../../lib/format'
import './StatCard.css'

/**
 * StatCard — a single AP-at-a-Glance KPI counter (plan §6).
 *
 * Encodes the null rule from the Home KPI contract: a KPI with no confirmed
 * data source renders an em dash with an explanatory caption, never 0. Zero is a
 * factual claim about the programme; a dash means "not measured yet".
 *
 * `format` lets a caller swap in a domain formatter (e.g. formatCurrencyINR for
 * investment) while the pending check still applies to the raw value.
 */
const StatCard = ({ label, value, hint, emphasis = false, format = formatCount }) => {
  const pending = isPending(value)

  return (
    <div
      className={emphasis ? 'stat-card stat-card--emphasis' : 'stat-card'}
      title={pending ? PENDING_HINT : undefined}
    >
      <span className="stat-card__value">
        {format(value)}
        {pending && <span className="stat-card__pending">no data source yet</span>}
      </span>
      <span className="stat-card__label">{label}</span>
      {hint && !pending && <span className="stat-card__hint">{hint}</span>}
    </div>
  )
}

export default StatCard
