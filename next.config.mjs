/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the SAME build can be wrapped by Ionic Capacitor (webDir: 'out')
  // AND deployed to Vercel. Server logic lives in Supabase Edge Functions, not Next
  // API routes (which static export disables). See CLAUDE.md §6 / §7.
  output: 'export',
  // Required by `output: 'export'` — no Image Optimization server at runtime.
  images: { unoptimized: true },
  // Emit /path/index.html so file-based hosting (Capacitor WebView) resolves routes.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
