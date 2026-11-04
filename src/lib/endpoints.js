/**
 * Endpoint catalogue — every API route consumed by the frontend.
 * Paths are taken from Backend/src/routes/index.ts and module route files.
 */
import { api } from './api'

// ── Authentication and official accounts ─────────────────────────────────
export const login = (credentials, options) => api.post('/auth/login', credentials, options)
export const getCurrentUser = (options) => api.get('/auth/me', undefined, options)
export const changePassword = (body, options) => api.post('/auth/change-password', body, options)
export const listAdminUsers = (params, options) => api.get('/admin/users', params, options)
export const createAdminUser = (body, options) => api.post('/admin/users', body, options)
export const listAdminRoles = (options) => api.get('/admin/roles', undefined, options)

// ── Home ──────────────────────────────────────────────────────────────────
export const getHomeKpis = (options) => api.get('/home/kpis', undefined, options)

// ── Clusters and ITIs ─────────────────────────────────────────────────────
export const listClusters = (params, options) => api.get('/clusters', params, options)
export const getCluster = (id, options) => api.get(`/clusters/${id}`, undefined, options)
export const getClusterItis = (clusterId, options) => api.get(`/clusters/${clusterId}/itis`, undefined, options)
export const listItis = (params, options) => api.get('/itis', params, options)
export const getIti = (id, options) => api.get(`/itis/${id}`, undefined, options)

// ── Partners, SPVs and SIPs ───────────────────────────────────────────────
export const listAips = (params, options) => api.get('/aips', params, options)
export const getAip = (id, options) => api.get(`/aips/${id}`, undefined, options)
export const listSpvs = (params, options) => api.get('/spvs', params, options)
export const getSpv = (id, options) => api.get(`/spvs/${id}`, undefined, options)
export const getClusterSpv = (clusterId, options) => api.get(`/clusters/${clusterId}/spv`, undefined, options)
export const listSips = (params, options) => api.get('/sips', params, options)
export const getSip = (id, options) => api.get(`/sips/${id}`, undefined, options)
export const getClusterSip = (clusterId, options) => api.get(`/clusters/${clusterId}/sip`, undefined, options)

// ── Governance and public content ─────────────────────────────────────────
export const listGovernanceMembers = (params, options) => api.get('/governance/members', params, options)
export const getGovernanceMember = (id, options) => api.get(`/governance/members/${id}`, undefined, options)
export const listDocuments = (params, options) => api.get('/documents', params, options)
export const getDocument = (id, options) => api.get(`/documents/${id}`, undefined, options)
export const listNews = (params, options) => api.get('/news', params, options)
export const getLatestNews = (params, options) => api.get('/news/latest', params, options)
export const getNews = (id, options) => api.get(`/news/${id}`, undefined, options)
export const listGallery = (params, options) => api.get('/gallery', params, options)
export const listGalleryPhotos = (params, options) => api.get('/gallery/photos', params, options)
export const listGalleryVideos = (params, options) => api.get('/gallery/videos', params, options)
export const listBanners = (params, options) => api.get('/banners', params, options)
export const getActiveBanner = (options) => api.get('/banners/active', undefined, options)

// ── Implementation dashboard ──────────────────────────────────────────────
export const getStateDashboard = (options) => api.get('/dashboard/state', undefined, options)
export const getClustersDashboard = (options) => api.get('/dashboard/clusters', undefined, options)
export const getClusterDashboard = (id, options) => api.get(`/dashboard/clusters/${id}`, undefined, options)
export const getFinanceDashboard = (options) => api.get('/dashboard/finance', undefined, options)
export const getTrainingDashboard = (options) => api.get('/dashboard/training', undefined, options)
export const getPlacementsDashboard = (options) => api.get('/dashboard/placements', undefined, options)

// ── Search and contact ────────────────────────────────────────────────────
export const search = (params, options) => api.get('/search', params, options)
export const submitContactMessage = (body, options) => api.post('/contact', body, options)
