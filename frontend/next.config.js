/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "i.kym-cdn.com",
      "cdn.jsdelivr.net",
      "assets.coingecko.com",
      "cryptologos.cc",
    ],
  },
};

module.exports = nextConfig;
