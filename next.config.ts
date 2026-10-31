import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The parent "design house" folder has its own lockfile; pin the workspace root to this app
  turbopack: { root: __dirname },
  async redirects() {
    return [
      {
        source: "/submissions",
        destination: "/general-enquiries",
        permanent: false,
      },
      {
        source: "/analytics",
        destination: "/seo",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
