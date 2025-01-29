/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // React Three Fiberのために必要な設定
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
    });
    return config;
  },
  // その他の設定
  reactStrictMode: false, // React Three Fiberのために無効化
  transpilePackages: ['three'],
}

module.exports = nextConfig
