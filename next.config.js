/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    domains: ['images.unsplash.com', 'api.foursquare.com'],
  },
};

module.exports = nextConfig;
