/**
 * seo.config.ts
 * ─────────────────────────────────────────────
 * Global SEO defaults for Ticketify.
 * All page-level generators import from here so
 * changing these propagates to every route at once.
 */

export const SITE = {
  name: "Waqas Abid | Portfolio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://waser.cloud",
  description:
    "Official website of waqas ali abid, a full stack web developer and AI engineer. Check out my portfolio or hire me for a project.",
  locale: "en_US",
  twitterHandle: "@waser",
  /** Used as the default OG / Twitter fallback image */
  defaultOgImage: "/og-default.jpg",
  themeColor: "#0a0a1a", // matches your dark navy "Void & Volt" base
};

/** Reusable robots directives */
export const ROBOTS = {
  public: { index: true, follow: true },
  noindex: { index: false, follow: false },
  nofollow: { index: true, follow: false },
};
