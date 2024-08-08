import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl();

/** @type {import('next').NextConfig} */

const nextConfig = withNextIntl({});

export default nextConfig;
