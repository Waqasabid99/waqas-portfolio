/**
 * generateMetadata.ts
 * ─────────────────────────────────────────────
 * Central factory that builds a Next.js `Metadata` object.
 * Every dynamic page calls one typed helper below which
 * calls this function — so all metadata stays consistent.
 *
 * Usage:
 *   import { generateblogMetadata } from "@/lib/seo/generateMetadata";
 *   export const generateMetadata = ({ params }) =>
 *     generateblogMetadata(blog);
 */

import { SITE, ROBOTS } from "./seo.config";
// ─── Core factory ─────────────────────────────────────────────────────────────

function buildMetadata(input) {
  const {
    title,
    description,
    canonicalUrl,
    ogImage = SITE.defaultOgImage,
    ogImageAlt = title,
    noindex = false,
    keywords,
  } = input;

  const absoluteCanonical = canonicalUrl.startsWith("http")
    ? canonicalUrl
    : `${SITE.url}${canonicalUrl}`;

  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${SITE.url}${ogImage}`;

  const robots = noindex ? ROBOTS.noindex : ROBOTS.public;

  return {
    // ── Title ──────────────────────────────────────────────────────────────
    title: {
      default: `${title} | ${SITE.name}`,
      template: `%s | ${SITE.name}`,
    },
    // ── Description & keywords ────────────────────────────────────────────
    description,
    ...(keywords?.length ? { keywords } : {}),

    // ── Canonical ─────────────────────────────────────────────────────────
    alternates: {
      canonical: absoluteCanonical,
    },

    // ── Robots ────────────────────────────────────────────────────────────
    robots: {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.index,
        follow: robots.follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ── Open Graph ────────────────────────────────────────────────────────
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: absoluteCanonical,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },

    // ── Twitter / X ───────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      site: SITE.twitterHandle,
      title: `${title} | ${SITE.name}`,
      description,
      images: [absoluteOgImage],
    },
  };
}

// ─── Per-page typed helpers ───────────────────────────────────────────────────

/** Data shape expected from your blog API response */

export function generateBlogMetadata(blog) {
  const keywords = [
    blog.title,
    "tech",
    "ai",
    "Artificial Intelligence",
    "cloud computing",
    "web development",
    "mobile development",
    "Software Engineering",
    ...(blog.tags ?? []),
    SITE.name,
  ];

  return buildMetadata({
    title: `${blog.title}`,
    description:
      blog.excerpt.length > 155
        ? blog.excerpt.slice(0, 152) + "…"
        : blog.excerpt,
    canonicalUrl: `/blog/${blog.slug}`,
    ogImage: blog.ogImage,
    ogImageAlt: `${blog.title} ogImage`,
    keywords,
  });
}
