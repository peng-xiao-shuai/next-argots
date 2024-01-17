import next from 'next';

const PORT = Number(process.env.PORT) || 3000;

// 创建 Next.js 应用实例
export const nextApp = next({
  dev: process.env.NODE_ENV !== 'production',
  port: PORT,
});

// 获取 Next.js 请求处理器。用于处理传入的 HTTP 请求，并根据 Next.js 应用的路由来响应这些请求。
export const nextRequestHandler = nextApp.getRequestHandler();
