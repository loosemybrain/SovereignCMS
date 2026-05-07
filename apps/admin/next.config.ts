import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@sovereign-cms/core",
    "@sovereign-cms/tenancy",
    "@sovereign-cms/auth",
    "@sovereign-cms/db",
    "@sovereign-cms/runtime",
    "@sovereign-cms/ui",
  ],
}

export default nextConfig
