import { useEffect } from 'react'

/**
 * useSeo — per-page document metadata (plan §26 / §9.3).
 *
 * A government portal needs a correct <title>, description and social preview
 * on every page, not just in index.html. Setting these imperatively is the
 * standard React approach for a client-rendered SPA.
 *
 * Also emits a JSON-LD GovernmentOrganization block, which is what makes the
 * site eligible for government structured data.
 */

const SITE_NAME = 'PM SETU – Andhra Pradesh'
const DEFAULT_DESCRIPTION =
  'Official portal for PM SETU in Andhra Pradesh: Government ITI clusters, Anchor Industry Partners, Special Purpose Vehicles, Government Orders, progress dashboard, news and gallery.'

const setMeta = (selector, attr, value) => {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [key, val] = attr.split('=')
    el.setAttribute(key, val)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const desc = description || DEFAULT_DESCRIPTION

    document.title = fullTitle
    setMeta('meta[name="description"]', 'name=description', desc)

    setMeta('meta[property="og:title"]', 'property=og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property=og:description', desc)
    setMeta('meta[property="og:site_name"]', 'property=og:site_name', SITE_NAME)
    setMeta('meta[property="og:type"]', 'property=og:type', 'website')
    setMeta('meta[name="twitter:card"]', 'name=twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', desc)

    // Canonical URL (absolute), required for correct indexing of an SPA.
    const { origin, pathname, search } = window.location
    setLink('canonical', `${origin}${pathname}${search}`)

    // Structured data describing the publishing authority.
    let ld = document.getElementById('pmsetu-jsonld')
    if (!ld) {
      ld = document.createElement('script')
      ld.id = 'pmsetu-jsonld'
      ld.type = 'application/ld+json'
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      name: 'PM SETU – Andhra Pradesh',
      url: origin,
      parentOrganization: {
        '@type': 'GovernmentOrganization',
        name: 'Government of Andhra Pradesh',
      },
    })
  }, [title, description])
}

export default useSeo
