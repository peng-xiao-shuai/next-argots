const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  compress: true,
  async rewrites() {
    return {
      afterFiles: [
        // 重写所有不包含 `admin` 的路由
        {
          source: '/:path((?!admin))', // 正则表达式排除包含 `admin` 的路径
          destination: '/en-US/:path', // 重写到 `/en/xx`
        },
      ]
    }
  },
  webpack: (config) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['@@'] = path.join(__dirname, 'public')
    config.resolve.alias['&'] = path.join(__dirname, 'src/server')

    // 重要: 返回修改后的配置
    return config
  },
}

module.exports = nextConfig