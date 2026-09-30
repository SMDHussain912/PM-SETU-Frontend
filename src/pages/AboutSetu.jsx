import PageHeader from '../components/common/PageHeader'
import './AboutSetu.css'

/**
 * About PM SETU — plan §7.
 * The seven subsections the specification names, in its order.
 * Web-ready wording is transcribed from the approved plan; departmental
 * review happens in the CMS phase.
 */
const SUBSECTIONS = [
  {
    id: 'vision',
    title: 'Vision',
    body: 'PM SETU aims to transform Government ITIs into industry-responsive institutions capable of delivering high-quality, employment-oriented and future-ready skills.',
  },
  {
    id: 'objectives',
    title: 'Objectives',
    body: 'Strengthen industry participation, modernise training infrastructure, align curricula to real occupations, and improve employment outcomes for trainees across Andhra Pradesh.',
  },
  {
    id: 'components',
    title: 'Scheme Components',
    body: 'The programme is delivered through ITI cluster formation, Anchor Industry Partnerships, Special Purpose Vehicles, Strategic Investment Plans, and infrastructure and equipment upgradation.',
  },
  {
    id: 'hub-spoke',
    title: 'Hub-and-Spoke Model',
    body: 'Each cluster is anchored by a Hub ITI that coordinates a network of Spoke ITIs, pooling training capacity, faculty and equipment across a district or region.',
  },
  {
    id: 'industry-partnership',
    title: 'Industry Partnership Model',
    body: 'Anchor Industry Partners co-design curricula, provide machines and faculty, commit to apprenticeships and placements, and support the establishment of Special Purpose Vehicles.',
  },
  {
    id: 'institutional',
    title: 'Institutional Framework',
    body: 'Implementation is guided by a State Steering Committee, the PM SETU State PMU, the department, cluster and SPV structures, and the Hub and Spoke ITI network.',
  },
  {
    id: 'outcomes',
    title: 'Expected Outcomes',
    body: 'Modern ITI infrastructure, future-skills courses, industry-aligned training, apprenticeships, and measurable gains in placement for trainees.',
  },
]

const AboutSetu = () => (
  <>
    <PageHeader
      title="About PM SETU"
      lead="Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs — transforming Government ITIs into industry-responsive institutions."
      breadcrumb={[{ label: 'About PM SETU' }]}
    />

    <div className="container about-layout">
      <aside className="about-layout__toc" aria-label="On this page">
        <p className="about-layout__toc-title">On this page</p>
        <ol className="about-layout__toc-list">
          {SUBSECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ol>
      </aside>

      <div className="about-layout__content">
        {SUBSECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="about-block">
            <h2 className="about-block__title">{s.title}</h2>
            <p className="about-block__body">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  </>
)

export default AboutSetu
