import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/erdaohe",
  assetPrefix: "/erdaohe",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
