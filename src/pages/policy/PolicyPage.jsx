import PageHeader from '../../components/common/PageHeader'

/**
 * Policy pages — plan §26 requires all six to exist. The content below is
 * placeholder structure clearly marked for departmental/legal review: these
 * are policy documents, so wording must be supplied and approved by the
 * department before publication rather than invented here.
 */
const POLICIES = {
  accessibility: {
    title: 'Accessibility Statement',
    lead: 'Our commitment to making this portal usable by everyone.',
    body: [
      'The Government of Andhra Pradesh is committed to making this portal accessible to all citizens, including persons with disabilities.',
      'This portal is designed to conform to WCAG 2.1 Level AA. It supports keyboard navigation, screen readers, text resizing, high contrast, and English and Telugu language selection.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    lead: 'How we handle information you provide through this portal.',
    body: [
      'Information you submit through the contact form is used only to respond to your enquiry.',
      'No account is required to browse this portal, and browsing does not require you to provide personal information.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    lead: 'The terms under which this portal is made available.',
    body: [
      'This portal is provided by the Government of Andhra Pradesh for public information.',
      'Content is provided in good faith and may be updated, corrected or withdrawn as departmental policy evolves.',
    ],
  },
  copyright: {
    title: 'Copyright Policy',
    lead: 'Ownership and permitted use of material on this portal.',
    body: [
      'Unless stated otherwise, material on this portal belongs to the Government of Andhra Pradesh.',
      'Government emblems and official marks may not be reproduced or altered.',
    ],
  },
  hyperlink: {
    title: 'Hyperlink Policy',
    lead: 'How this portal handles links to other websites.',
    body: [
      'Links to external websites are provided for convenience. The Government of Andhra Pradesh does not control external content and is not responsible for it.',
    ],
  },
  content: {
    title: 'Content Contribution / Review Policy',
    lead: 'How departmental content is authored, reviewed and published.',
    body: [
      'All government content passes through a review and approval workflow before publication: Content Creator, Department Reviewer, Approving Officer, then Publish.',
      'Every change is recorded in an audit log with user, timestamp, old value, new value and approval status.',
    ],
  },
}

const PolicyPage = ({ slug }) => {
  const policy = POLICIES[slug]

  if (!policy) {
    return (
      <>
        <PageHeader title="Policy" />
        <div className="container page-section">
          <p>That policy page does not exist.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={policy.title}
        lead={policy.lead}
        breadcrumb={[{ label: 'Policies', to: '/sitemap' }, { label: policy.title }]}
      />
      <div className="container page-section policy">
        {policy.body.map((para) => (
          <p key={para.slice(0, 32)}>{para}</p>
        ))}

        <p className="policy__review-note">
          <strong>Awaiting departmental review.</strong> This policy text is a
          structural draft and must be confirmed by the department before the
          portal goes live.
        </p>
      </div>
    </>
  )
}

export default PolicyPage