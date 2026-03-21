/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Disable Next.js built-in SWC styled-components transform
    // to use babel-plugin-styled-components instead
    styledComponents: false,
  },
  images: {
    domains: ['randomuser.me', 'via.placeholder.com', 'ui-avatars.com'],
  },
  // Absolute imports
  experimental: {
    // Allow styled-components SSR
  },
};

module.exports = nextConfig;
