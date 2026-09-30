/**
 * Endpoint catalogue — every public route the frontend consumes.
 *
 * Paths are taken from Backend/src/routes/index.ts and each module's
 * *.routes.ts, and were verified live on 2026-09-29 (all return success:true
 * with an empty database). Each entry names the governing section of the
 * approved plan / RoadMap so the contract is traceable.
 */

import { api } from './api'

// ── Home — plan §6 "AP at a Glance" ──────────────────────────────────────
/** GET /home/kpis — 10 KPI counters, database-driven. */
export const getHomeKpis = (options) => api.get('/home/kpis', undefined, options)

// ── Clusters — plan §9 / RoadMap §6 ───────────────────────────────────────
export const listClusters = (params, options) => api.get('/clusters', params, options)
export const getCluster = (id, options) => api.get(`/clusters/${id}`, undefined, options)
export const getClusterItis = (clusterId, options) =>
  api.get(`/clusters/${clusterId}/itis`, undefined, options)

// ── ITI registry — plan §10 / RoadMap §7 ──────────────────────────────────
export const listItis = (params, options) => api.get('/itis', params, options)
export const getIti = (id, options) => api.get(`/itis/${id}`, undefined, options)

// ── Anchor Industry Partners — plan §11 / RoadMap §8 ──────────────────────
export const listAips = (params, options) => api.get('/aips', params, options)
export const getAip = (id, options) => api.get(`/aips/${id}`, undefined, options)

// ── Special Purpose Vehicles — plan §12 / RoadMap §9 ──────────────────────
export const listSpvs = (params, options) => api.get('/spvs', params, options)
export const getSpv = (id, options) => api.get(`/spvs/${id}`, undefined, options)
export const getClusterSpv = (clusterId, options) =>
  api.get(`/clusters/${clusterId}/spv`, undefined, options)

// ── Strategic Investment Plans — plan §13 / RoadMap §10 ───────────────────
export const listSips = (params, options) => api.get('/sips', params, options)
export const getSip = (id, options) => api.get(`/sips/${id}`, undefined, options)
export const getClusterSip = (clusterId, options) =>
  api.get(`/clusters/${clusterId}/sip`, undefined, options)

// ── Governance directory — plan §14 / RoadMap §11 ─────────────────────────
export const listGovernanceMembers = (params, options) =>
  api.get('/governance/members', params, options)
export const getGovernanceMember = (id, options) =>
  api.get(`/governance/members/${id}`, undefined, options)

// ── Document repository — plan §15 / RoadMap §12 ──────────────────────────
export const listDocuments = (params, options) => api.get('/documents', params, options)
export const getDocument = (id, options) => api.get(`/documents/${id}`, undefined, options)

// ── News — plan §16 / RoadMap §13 ─────────────────────────────────────────
export const listNews = (params, options) => api.get('/news', params, options)
export const getLatestNews = (params, options) => api.get('/news/latest', params, options)
export const getNews = (id, options) => api.get(`/news/${id}`, undefined, options)

// ── Media gallery — plan §16 / RoadMap §14 ────────────────────────────────
export const listGallery = (params, options) => api.get('/gallery', params, options)
export const listGalleryPhotos = (params, options) => api.get('/gallery/photos', params, options)
export const listGalleryVideos = (params, options) => api.get('/gallery/videos', params, options)

// ── Banner management — plan §5 / RoadMap §15 ─────────────────────────────
export const listBanners = (params, options) => api.get('/banners', params, options)
export const getActiveBanner = (options) => api.get('/banners/active', undefined, options)

// ── Implementation dashboard — plan §20 / RoadMap §16 ────────────────────
export const getStateDashboard = (options) => api.get('/dashboard/state', undefined, options)
export const getClustersDashboard = (options) => api.get('/dashboard/clusters', undefined, options)
export const getClusterDashboard = (id, options) =>
  api.get(`/dashboard/clusters/${id}`, undefined, options)
export const getFinanceDashboard = (options) => api.get('/dashboard/finance', undefined, options)
export const getTrainingDashboard = (options) => api.get('/dashboard/training', undefined, options)
export const getPlacementsDashboard = (options) =>
  api.get('/dashboard/placements', undefined, options)

// ── Portal-wide search — plan §27 / RoadMap §17 ───────────────────────────
export const search = (params, options) => api.get('/search', params, options)

// ── Public contact form — plan §23 / RoadMap §17 ──────────────────────────
/**
 * POST /contact — public, rate-limited, validated server-side.
 * Body: { name, email, subject?, message, phone? }
 */
export const submitContactMessage = (body, options) => api.post('/contact', body, options)
