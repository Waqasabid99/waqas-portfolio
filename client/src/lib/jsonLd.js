/**
 * jsonLd.ts
 * ─────────────────────────────────────────────
 * Schema.org JSON-LD generators for Blog pages.
 *
 * How to use in a page:
 *   import { BlogJsonLd } from "@/lib/seo/jsonLd";
 *
 *   export default function BlogPage({ movie }) {
 *     return (
 *       <>
 *         <BlogJsonLd blog={blog} />
 *         ...rest of page
 *       </>
 *     );
 *   }
 */

import { SITE } from "./seo.config";

// ─── Helper ──────────────────────────────────────────────────────────────────

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Blog page ───────────────────────────────────────────────────────────────
// Schema: https://schema.org/blog

export function BlogJsonLd({ blog }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "blog",
    name: blog.title,
    description: blog.excerpt,
    url: `${SITE.url}/blog/${blog.slug}`,
    ...(blog.coverImage && { image: blog.coverI }),
    ...(blog.categories?.length && { categories: blog.categories }),
  };

  return <JsonLd data={data} />;
}
