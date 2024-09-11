import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['@@'] = path.join(__dirname, 'public')
    config.resolve.alias['&'] = path.join(__dirname, 'src/server')
    config.resolve.alias['@payload-config'] = path.join(__dirname, 'src/server/payload/payload.config.ts')
    // 重要: 返回修改后的配置
    return config
  },
  experimental: {
    reactCompiler: false
  }
}

export default withPayload(nextConfig)