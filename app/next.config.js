/** @type {import('next').NextConfig} */
const nextConfig = {
	// output to build
	distDir: "build",
	output: "export",
	swcMinify: true,
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: '',
				pathname: '/photos/**',
			},
		],
		unoptimized: true
	},
};

module.exports = nextConfig;
