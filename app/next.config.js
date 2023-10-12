/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  trailingSlash: true,
  output: "export",
  swcMinify: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
    ],
    unoptimized: false,
  },
};

module.exports = nextConfig;
