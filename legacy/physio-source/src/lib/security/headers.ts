/**
 * Security Headers Configuration
 * Includes CSP to block external Google Font requests
 * 
 * Add to next.config.js or middleware
 */

function buildCsp(options: { frameAncestors: "'none'" | "'self'" }): string {
  // In Development: 'unsafe-eval' für Next.js Webpack Dev + React Fast Refresh
  // In Production: 'unsafe-eval' wird NICHT hinzugefügt (CSP strict)
  const isDev = process.env.NODE_ENV === "development"
  const unsafeEval = isDev ? " 'unsafe-eval'" : ""

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${options.frameAncestors}`,

    // script-src: 'self' + 'unsafe-inline' (erforderlich für Next.js Inline-Scripts)
    // + 'unsafe-eval' nur im Dev-Modus (Webpack Dev + React Fast Refresh)
    `script-src 'self' 'unsafe-inline'${unsafeEval}`,

    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self'",
  ].join("; ")
}

export const defaultSecurityHeaders = {
  "Content-Security-Policy": buildCsp({ frameAncestors: "'none'" }),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
} as const

export const previewSecurityHeaders = {
  // Preview darf im Admin-iframe aus derselben Origin gerendert werden.
  "Content-Security-Policy": buildCsp({ frameAncestors: "'self'" }),
  // X-Frame-Options darf hier NICHT DENY sein (sonst blockt der Browser immer).
  // SAMEORIGIN passt zur CSP-Strategie frame-ancestors 'self'.
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
} as const

// Usage in next.config.js:
/*
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]
  }
*/
