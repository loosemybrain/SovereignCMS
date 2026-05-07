import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@sovereign-cms/core",
    "@sovereign-cms/db",
    "@sovereign-cms/runtime",
    "@sovereign-cms/tenancy",
    "@sovereign-cms/ui",
  ],
}

export default nextConfig
