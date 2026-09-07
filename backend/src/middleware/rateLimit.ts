import rateLimit from "express-rate-limit";

// Protects the public tracking-verification endpoint: the tracking code is fixed
// in the URL, so this stops someone from brute-forcing the client email against it.
export const trackingVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez plus tard." },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez plus tard." },
});
