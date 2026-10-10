import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.6"],
  // The Mira conversation moved from /diagnostic to /orientation (query strings are kept).
  async redirects() {
    return [
      // "/" is the home page; /home would be a duplicate URL for search engines.
      { source: "/home", destination: "/", permanent: true },
      { source: "/psy", destination: "/clinician", permanent: true },
      { source: "/diagnostic", destination: "/orientation", permanent: true },
      { source: "/diagnostic/:path*", destination: "/orientation/:path*", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pplx-res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;