import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias['next-rapid'] = path.resolve(__dirname, '_rapid');
    return config;
  }
};

export default nextConfig;
