import { useState } from 'react'
import { formatDate } from '../../lib/format'

/**
 * DataAsOf — plan §6: "Every dashboard block should display: Data as on: DD-MM-YYYY".
 *
 * The Home KPI endpoint returns no timestamp (Backend/src/modules/home/home.types.ts),
 * so the only honest value is the moment this block mounted, i.e. when the figures
 * shown were read from the service. The lazy useState initialiser stamps once at
 * mount — it does not re-render, and it avoids a setState inside an effect.
 */
const DataAsOf = ({ className = '' }) => {
  const [asOf] = useState(() => new Date())

  return (
    <p className={className ? `data-as-of ${className}` : 'data-as-of'}>
      Data as on: <time dateTime={asOf.toISOString()}>{formatDate(asOf)}</time>
    </p>
  )
}

export default DataAsOf
