import Section from '../common/Section'
import './PmsetuWorkflow.css'

/**
 * How PM SETU Works — plan §8, the nine-step visual workflow.
 *
 * §8 says this content should live in the CMS so the department can change the
 * text, icons and sequencing without a deployment. Until a CMS is selected the
 * steps are held in one clearly-marked array below — the single place to edit.
 */
const STEPS = [
  { title: 'Government of India + Government of Andhra Pradesh', group: 'Governance' },
  { title: 'PM SETU ITI Cluster', group: 'Cluster' },
  { title: 'Anchor Industry Partner (AIP)', group: 'Industry' },
  { title: 'Special Purpose Vehicle (SPV)', group: 'Governance' },
  { title: 'Strategic Investment Plan (SIP)', group: 'Investment' },
  { title: 'ITI Infrastructure & Equipment Upgradation', group: 'Infrastructure' },
  { title: 'Industry-Aligned Courses', group: 'Training' },
  { title: 'Training / Apprenticeship', group: 'Training' },
  { title: 'Employment & Industry Outcomes', group: 'Outcome' },
]

const PmsetuWorkflow = () => (
  <Section
    id="how-pm-setu-works"
    title="How PM SETU Works"
    lead="From government approval to industry-aligned training and employment."
  >
    <ol className="workflow">
      {STEPS.map((step, i) => (
        <li key={step.title} className="workflow__step">
          <span className="workflow__num" aria-hidden="true">
            {i + 1}
          </span>
          <span className="workflow__body">
            <span className="workflow__group">{step.group}</span>
            <span className="workflow__title">{step.title}</span>
          </span>
        </li>
      ))}
    </ol>
  </Section>
)

export default PmsetuWorkflow
