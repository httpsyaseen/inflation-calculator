import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // turn off the rule
    // or to warn instead of error:
    // "@typescript-eslint/no-explicit-any": "warn",
  },
};

export default nextConfig;
