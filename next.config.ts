import type { NextConfig } from "next";
import { BASE_PATH } from "@/configs/Config";

const nextConfig: NextConfig = {
  distDir: 'out',
  output: "export",
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;