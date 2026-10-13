import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/hoteis",
        destination: "/hospedagens",
        permanent: true,
      },
      {
        source: "/hoteis/:path*",
        destination: "/hospedagens/:path*",
        permanent: true,
      },
      {
        source: "/voos",
        destination: "/passagens",
        permanent: true,
      },
      {
        source: "/voos/:path*",
        destination: "/passagens/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
