const path = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['&'] = path.join(__dirname, 'src/server')

    // 重要: 返回修改后的配置
    return config
  },
}

module.exports = nextConfig
