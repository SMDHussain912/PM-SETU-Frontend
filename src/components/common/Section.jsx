/**
 * Section — a titled band on a page or homepage, in the §32 rhythm.
 * `id` doubles as the anchor target so sections are linkable.
 */
const Section = ({ id, title, lead, action, tone = 'plain', children }) => {
  const toneClass = tone === 'tinted' ? 'section section--tinted' : 'section'

  return (
    <section className={toneClass} id={id}>
      <div className="container">
        {(title || action) && (
          <div className="section__head">
            {title && <h2 className="section__title">{title}</h2>}
            {lead && <p className="section__lead">{lead}</p>}
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export default Section
