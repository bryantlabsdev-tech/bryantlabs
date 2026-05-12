import { useEffect } from "react"
import {
  buildAbsoluteAssetUrl,
  buildCanonicalUrl,
  siteSeo,
} from "../config/seo"

function upsertMeta(attribute, key, content) {
  if (!content) {
    return null
  }

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  const previousValue = element.getAttribute("content")
  element.setAttribute("content", content)

  return { element, previousValue }
}

function upsertLink(rel, href) {
  if (!href) {
    return null
  }

  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement("link")
    element.setAttribute("rel", rel)
    document.head.appendChild(element)
  }

  const previousValue = element.getAttribute("href")
  element.setAttribute("href", href)

  return { element, previousValue }
}

export function usePageMeta({
  title = siteSeo.title,
  description = siteSeo.description,
  path = "/",
  robots = "index,follow",
  image = siteSeo.ogImage,
  type = siteSeo.ogType,
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) {
      return undefined
    }
    const previousTitle = document.title
    const canonicalUrl = buildCanonicalUrl(path)
    const imageUrl = buildAbsoluteAssetUrl(image)
    const managedTags = [
      upsertMeta("name", "description", description),
      upsertMeta("name", "robots", robots),
      upsertMeta("property", "og:title", title),
      upsertMeta("property", "og:description", description),
      upsertMeta("property", "og:image", imageUrl),
      upsertMeta("property", "og:image:secure_url", imageUrl),
      upsertMeta("property", "og:image:type", "image/png"),
      upsertMeta(
        "property",
        "og:image:width",
        String(siteSeo.ogImageWidth),
      ),
      upsertMeta(
        "property",
        "og:image:height",
        String(siteSeo.ogImageHeight),
      ),
      upsertMeta("property", "og:image:alt", siteSeo.ogImageAlt),
      upsertMeta("property", "og:url", canonicalUrl),
      upsertMeta("property", "og:type", type),
      upsertMeta("property", "og:site_name", siteSeo.author),
      upsertMeta("name", "twitter:card", siteSeo.twitterCard),
      upsertMeta("name", "twitter:title", title),
      upsertMeta("name", "twitter:description", description),
      upsertMeta("name", "twitter:image", imageUrl),
      upsertMeta("name", "twitter:image:alt", siteSeo.ogImageAlt),
      upsertLink("canonical", canonicalUrl),
    ].filter(Boolean)

    document.title = title

    return () => {
      document.title = previousTitle || siteSeo.title

      for (const tag of managedTags) {
        if (!tag.element) {
          continue
        }

        if (tag.previousValue === null) {
          tag.element.remove()
          continue
        }

        if (tag.element.tagName === "LINK") {
          tag.element.setAttribute("href", tag.previousValue)
          continue
        }

        tag.element.setAttribute("content", tag.previousValue)
      }
    }
  }, [description, enabled, image, path, robots, title, type])
}
