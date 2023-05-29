/** @type {import('next').NextConfig} */
const nextConfig = {
	// output to build
	distDir: "build",
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
	},
};

module.exports = nextConfig;
