/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'chrome-aws-lambda': 'chrome-aws-lambda',
      });
    }
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb'
    },
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
  images: {
    domains: ['localhost', 'cdn.liboqiao.top'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
};

export default nextConfig;
