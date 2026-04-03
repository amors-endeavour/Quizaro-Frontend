import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /Quizaro-Frontend-deploy/,
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
