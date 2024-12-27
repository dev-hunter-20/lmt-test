const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push(
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      );
    }
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'letsmetrix.com',
        port: '',
        pathname: '/admin-blog/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.letsmetrix.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api-wix.letsmetrix.com',
        port: '',
      },
    ],
    formats: ['image/webp'],
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
