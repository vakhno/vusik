import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl();

/** @type {import('next').NextConfig} */

const nextConfig = withNextIntl({
	images: {
		domains: ["vusik-bucket.s3.eu-central-1.amazonaws.com"],
	},
});

export default nextConfig;
