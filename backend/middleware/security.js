import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// Helmet sets a sane set of security-related HTTP response headers
// (X-Content-Type-Options, X-Frame-Options, HSTS, etc.).
// crossOriginResourcePolicy is relaxed so the admin/frontend on other
// origins can still load product images served from /images.
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
});

// Strips any keys containing "$" or "." from req.body / req.query / req.params
// so a malicious payload like { "email": { "$gt": "" } } can't turn a query
// into a NoSQL injection.
export const sanitizeInput = mongoSanitize({
  replaceWith: "_",
});
