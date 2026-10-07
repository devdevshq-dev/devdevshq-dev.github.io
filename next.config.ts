import type { NextConfig } from "next";

const config: NextConfig = {
  output: process.env.GITHUB_PAGES === "true" ? "export" : undefined,
  trailingSlash: true,
};

export default config;
