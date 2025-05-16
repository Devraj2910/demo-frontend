/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable persistent caching
    outputFileTracingRoot: process.cwd(),
    // Include other experimental features as needed
  },
  // Ensure proper caching behavior
  onDemandEntries: {
    // Keep pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000,
    // Control page buffer size
    pagesBufferLength: 5,
  },
  // Add webpack configuration to ensure TailwindCSS caching works properly
  webpack: (config) => {
    config.cache = true; // Enable webpack caching
    return config;
  }
};

module.exports = nextConfig; 