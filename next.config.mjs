/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Allow loading images served from a local backend at port 8000 (use remotePatterns when port is used)
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
