// A function, not a top-level constant: callers that load .env first (via
// dotenv.config()) need process.env read lazily, after that call runs —
// module-level evaluation would freeze these values before .env is loaded.
export function getEnv() {
  return {
    baseUrl: process.env.BASE_URL ?? 'https://sauce-demo.myshopify.com',
    isCI: !!process.env.CI,
  };
}
