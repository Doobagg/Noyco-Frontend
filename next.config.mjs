/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['framer-motion'],
  webpack: (config, { isServer }) => {
    // Handle ES modules properly
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    // Ensure proper module resolution
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/admin/:path*',
        destination: `${API_URL}/admin/:path*`,
      },
      {
        source: '/public/:path*',
        destination: `${API_URL}/public/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${API_URL}/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: '/dataEHR/:path*',
        destination: `${API_URL}/dataEHR/:path*`,
      },
      {
        source: '/billing/:path*',
        destination: `${API_URL}/billing/:path*`,
      },
      {
        source: '/phone/:path*',
        destination: `${API_URL}/phone/:path*`,
      },
      {
        source: '/patients/:path*',
        destination: `${API_URL}/patients/:path*`,
      },
      {
        source: '/user-profile/:path*',
        destination: `${API_URL}/user-profile/:path*`,
      },
      {
        source: '/stripe/:path*',
        destination: `${API_URL}/stripe/:path*`,
      },
      {
        source: '/public/:path*',
        destination: `${API_URL}/public/:path*`,
      },
      {
        source: '/tracking/:path*',
        destination: `${API_URL}/tracking/:path*`,
      },
      {
        source: '/schedule/:path*',
        destination: `${API_URL}/schedule/:path*`,
      },
      {
        source: '/schedule/tracking/:path*',
        destination: `${API_URL}/schedule/tracking/:path*`,
      },
      {
        source: '/metrics/:path*',
        destination: `${API_URL}/metrics/:path*`,
      },
    ];
  },
};

export default nextConfig;
