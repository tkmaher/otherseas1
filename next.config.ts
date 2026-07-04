import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;

export default nextConfig;
