import { Link } from 'react-router-dom'
import Section from '../common/Section'
import './AboutSection.css'

/**
 * About PM SETU — homepage band for plan §32 item 4. A short summary that
 * links to the full seven-subsection page.
 */
const AboutSection = () => (
  <Section
    id="about-pm-setu"
    title="About PM SETU"
    lead="Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs."
    action={
      <Link className="btn btn--secondary" to="/about">
        Read more
      </Link>
    }
  >
    <div className="about-band">
      <p className="about-band__text">
        PM SETU aims to transform Government ITIs into industry-responsive
        institutions capable of delivering high-quality, employment-oriented and
        future-ready skills. The programme promotes strong participation of
        industry through a Hub-and-Spoke cluster model, supported by Anchor
        Industry Partners, Special Purpose Vehicles and Strategic Investment
        Plans.
      </p>
    </div>
  </Section>
)

export default AboutSection
