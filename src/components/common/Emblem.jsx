import indiaEmblemSvg from '../../assets/india-emblem.svg'
import indiaEmblemWebp from '../../assets/optimized/india-emblem.webp'
import apLogoSvg from '../../assets/ap-logo.svg'
import apLogoWebp from '../../assets/optimized/ap-logo.webp'

/**
 * Emblem — the two government emblems, served efficiently.
 *
 * The source SVGs are 428 KB and 292 KB because they carry ~87,000 and ~45,000
 * path coordinates, but both render at 58-60 CSS px. Shipping the vector on the
 * critical path cost ~720 KB for a 60 px image.
 *
 * Each emblem is therefore shipped as a 2x WebP (12 KB) with the ORIGINAL SVG
 * as a `<picture>` fallback, so:
 *   · artwork is only re-encoded, never altered (D8 — the SVG stays the master)
 *   · browsers without WebP still get the exact official artwork
 *   · the file remains crisp for print / zoom
 */
const SOURCES = {
  goi: { svg: indiaEmblemSvg, webp: indiaEmblemWebp, width: 58, height: 64 },
  ap: { svg: apLogoSvg, webp: apLogoWebp, width: 60, height: 64 },
}

const Emblem = ({ which = 'goi', alt, className = 'gov-header__emblem' }) => {
  const src = SOURCES[which]
  if (!src) return null

  return (
    <picture>
      <source srcSet={src.webp} type="image/webp" />
      <img
        className={className}
        src={src.svg}
        alt={alt}
        width={src.width}
        height={src.height}
        loading="eager"
        decoding="async"
      />
    </picture>
  )
}

export default Emblem
