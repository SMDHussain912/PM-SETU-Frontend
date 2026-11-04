import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Login from '../pages/Login'
import OfficialWorkspace from '../pages/OfficialWorkspace'
import AdminDashboard from '../pages/AdminDashboard'

import Home from '../pages/Home'
import AboutSetu from '../pages/AboutSetu'
import Governance from '../pages/Governance'
import Clusters from '../pages/Clusters'
import IndustryPartners from '../pages/IndustryPartners'
import SPVs from '../pages/SPVs'
import SIPs from '../pages/SIPs'
import Documents from '../pages/Documents'
import Dashboard from '../pages/Dashboard'
import News from '../pages/News'
import Gallery from '../pages/Gallery'
import Contact from '../pages/Contact'
import Search from '../pages/Search'
import Sitemap from '../pages/Sitemap'
import NotFound from '../pages/NotFound'

import ClusterDetail from '../pages/clusters/ClusterDetail'
import AipDetail from '../pages/industryPartners/AipDetail'
import SpvDetail from '../pages/spvs/SpvDetail'
import SipDetail from '../pages/sips/SipDetail'
import NewsDetail from '../pages/news/NewsDetail'
import PolicyPage from '../pages/policy/PolicyPage'

const AppRoutes = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<AboutSetu />} />
      <Route path="governance" element={<Governance />} />
      <Route path="clusters" element={<Clusters />} />
      <Route path="clusters/:clusterId" element={<ClusterDetail />} />
      <Route path="aip" element={<Navigate to="/industry-partners" replace />} />
      <Route path="industry-partners" element={<IndustryPartners />} />
      <Route path="industry-partners/:aipId" element={<AipDetail />} />
      <Route path="spvs" element={<SPVs />} />
      <Route path="spvs/:spvId" element={<SpvDetail />} />
      <Route path="sips" element={<SIPs />} />
      <Route path="sips/:sipId" element={<SipDetail />} />
      <Route path="documents" element={<Documents />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="news" element={<News />} />
      <Route path="news/:newsId" element={<NewsDetail />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="contact" element={<Contact />} />
      <Route path="search" element={<Search />} />
      <Route path="sitemap" element={<Sitemap />} />
      <Route path="policy/accessibility" element={<PolicyPage slug="accessibility" />} />
      <Route path="policy/privacy" element={<PolicyPage slug="privacy" />} />
      <Route path="policy/terms" element={<PolicyPage slug="terms" />} />
      <Route path="policy/copyright" element={<PolicyPage slug="copyright" />} />
      <Route path="policy/hyperlink" element={<PolicyPage slug="hyperlink" />} />
      <Route path="policy/content" element={<PolicyPage slug="content" />} />

      <Route element={<ProtectedRoute />}>
        <Route path="official" element={<OfficialWorkspace />} />
        <Route element={<ProtectedRoute roles={['super_admin', 'state_pmu_admin', 'det_content_admin', 'approving_authority']} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default AppRoutes
