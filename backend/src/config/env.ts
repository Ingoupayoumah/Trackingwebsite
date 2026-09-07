import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  clientSessionSecret: required("CLIENT_SESSION_SECRET"),
  clientSessionExpiresIn: process.env.CLIENT_SESSION_EXPIRES_IN ?? "6h",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Tracking <no-reply@example.com>",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
};
