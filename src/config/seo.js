export const SITE_URL = "https://bryantlabs.dev"
export const SITE_NAME = "Bryant Labs"
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`

export const siteSeo = {
  title: "Bryant Labs — Custom Apps, AI Tools & Business Systems",
  description:
    "Bryant Labs builds modern mobile apps, AI tools, dashboards, and custom business systems for startups, creators, and growing businesses.",
  keywords:
    "custom software studio, mobile apps, AI tools, business systems, dashboards, startups, creators, web applications, Bryant Labs",
  author: "Bryant Labs",
  themeColor: "#050508",
  ogImage: OG_IMAGE_URL,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Bryant Labs — Custom Apps, AI Tools & Business Systems",
  ogType: "website",
  twitterCard: "summary_large_image",
  contactEmail: "projects@bryantlabs.dev",
  logoPath: "/favicon.svg",
}

export function buildCanonicalUrl(pathname = "/") {
  if (!pathname || pathname === "/") {
    return `${SITE_URL}/`
  }

  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

export function buildAbsoluteAssetUrl(assetPath) {
  if (!assetPath) {
    return `${SITE_URL}${siteSeo.ogImage}`
  }

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath
  }

  return `${SITE_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`
}

export function buildMarketingStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: buildAbsoluteAssetUrl(siteSeo.logoPath),
        description: siteSeo.description,
        email: siteSeo.contactEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: siteSeo.description,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  }
}
