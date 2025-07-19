import type { NextConfig } from "next";
import nextI18nConfig from './next-i18next.config.js';

const nextConfig: NextConfig = {
  /* config options here */
  i18n: nextI18nConfig.i18n,
};

export default nextConfig;