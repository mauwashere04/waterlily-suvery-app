import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Every route in this app reads the session cookie (cookies() via
  // getCurrentUser), so it's dynamic on every request by nature -- there's
  // no page here that benefits from Next 16's static-by-default Cache
  // Components model, and opting every route out individually would just
  // be noise. Plain per-request rendering is the right default for this app.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
