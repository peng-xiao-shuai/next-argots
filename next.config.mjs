import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: 'strict',
    serverSourceMaps: true,
    reactCompiler: false,
    staleTimes: {
      // dynamic: 30,
      static: 180,
    },
  },
  images: {
    // dangerouslyAllowSVG: true,
    // contentDispositionType: 'attachment',
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
  // 重定向到规范 URL 以避免重复内容
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en-US',
        permanent: true,
      },
      {
        source: '/setting',
        destination: '/en-US/setting',
        permanent: true,
      },
      {
        source: '/setting/:path*',
        destination: '/en-US/setting/:path*',
        permanent: true,
      },
      {
        source: '/chat-room',
        destination: '/en-US/chat-room',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['@@'] = path.join(__dirname, 'public')
    config.resolve.alias['&'] = path.join(__dirname, 'src/server')
    config.resolve.alias['@payload-config'] = path.join(__dirname, 'src/server/payload/payload.config.ts')
    // 重要: 返回修改后的配置
    return config
  }
}

export default withPayload(nextConfig)