import { Link } from 'react-router-dom'
import Section from '../common/Section'
import './ClusterMapSection.css'

/**
 * AP Cluster Map — plan §32 item 7.
 *
 * The interactive GIS map is a PHASE 4 deliverable and the portal
 * specification says it must only use "the exact GIS provider/service ...
 * decided according to approved government infrastructure" (plan §22). No
 * provider has been chosen and no map service is available, so this renders an
 * explicit placeholder rather than a fake map or an invented plot of markers.
 * The clusters table below it is the real, working substitute for now.
 */
const ClusterMapSection = () => (
  <Section
    id="cluster-map"
    title="Andhra Pradesh Cluster Map"
    lead="Cluster locations plotted on an interactive map of Andhra Pradesh."
    tone="tinted"
  >
    <div className="map-placeholder">
      <p className="map-placeholder__badge">Phase 4 &mdash; awaiting GIS service</p>
      <p className="map-placeholder__title">Interactive AP map not yet enabled</p>
      <p className="map-placeholder__text">
        The cluster map will be connected once a government-approved GIS service
        is available. Until then, use the cluster list, which is live.
      </p>
      <Link className="btn btn--primary" to="/clusters">
        Browse AP Clusters
      </Link>
    </div>
  </Section>
)

export default ClusterMapSection
