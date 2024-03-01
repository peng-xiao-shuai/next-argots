const path = require('path')
const { withPayload } = require("@payloadcms/next-payload")

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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['@@'] = path.join(__dirname, 'public')
    config.resolve.alias['&'] = path.join(__dirname, 'src/server')

    // 重要: 返回修改后的配置
    return config
  },
}

module.exports = withPayload(nextConfig, {
  // The second argument to `withPayload`
  // allows you to specify paths to your Payload dependencies
  // and configure the admin route to your Payload CMS.

  // Point to your Payload config (required)
  configPath: path.resolve(__dirname, "./src/server/payload/payload.config.ts"),

  // Point to your exported, initialized Payload instance (optional, default shown below`)
  payloadPath: path.resolve(__dirname, "./src/server/payload/get-payload.ts"),

  // Set a custom Payload admin route (optional, default is `/admin`)
  // NOTE: Read the "Set a custom admin route" section in the payload/next-payload README.
  adminRoute: "/admin",
}
)
